from fastapi import FastAPI, File, HTTPException, UploadFile
from uuid import uuid4
from pydantic import BaseModel, Field

from app.services.pdf_parser import extract_pdf_pages
from app.services.chunker import chunk_pdf_pages
from app.services.embedding_service import embed_chunks
from app.services.vector_store import store_document_chunks, search_document

app = FastAPI(
    title="Research Assistant API",
    version="0.1.0",
)

class DocumentSearchRequest(BaseModel):
    document_id: str
    query: str
    limit: int = Field(default=5, ge=1, le=20)

@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/documents/extract")
async def extract_document(
    file: UploadFile = File(...),
) -> dict[str, object]:
    if file.content_type != "application/pdf":
        raise HTTPException(
            status_code=400,
            detail="Only PDF files are supported.",
        )

    pdf_bytes = await file.read()

    if not pdf_bytes:
        raise HTTPException(
            status_code=400,
            detail="The uploaded file is empty.",
        )

    pages = extract_pdf_pages(pdf_bytes)

    chunks = chunk_pdf_pages(pages)

    embeddings = embed_chunks(chunks)

    document_id = str(uuid4())

    stored_chunk_count = store_document_chunks(
        document_id=document_id,
        filename=file.filename or "document.pdf",
        chunks=chunks,
        embeddings=embeddings,
    )

    full_text = "\n\n".join(
        str(page["text"]) for page in pages
    )

    return {
        "document_id": document_id,
        "filename": file.filename,
        "page_count": len(pages),
        "chunk_count": len(chunks),
        "embedding_count": len(embeddings),
        "stored_chunk_count": stored_chunk_count,
        "embedding_dimensions": (
            len(embeddings[0]) if embeddings else 0
        ),
    }

@app.post("/documents/search")
def search_stored_document(
    request: DocumentSearchRequest,
) -> dict[str, object]:
    try:
        results = search_document(
            document_id=request.document_id,
            query=request.query,
            limit=request.limit,
        )
    except ValueError as error:
        raise HTTPException(
            status_code=400,
            detail=str(error),
        ) from error

    return {
        "document_id": request.document_id,
        "query": request.query,
        "result_count": len(results),
        "results": [
            {
                "chunk_id": result.chunk_id,
                "page_number": result.page_number,
                "text": result.text,
                "distance": result.distance,
            }
            for result in results
        ],
    }