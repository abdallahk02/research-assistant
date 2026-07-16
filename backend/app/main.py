from fastapi import FastAPI, File, HTTPException, UploadFile

from app.services.pdf_parser import extract_pdf_pages
from app.services.chunker import chunk_pdf_pages
from app.services.embedding_service import embed_chunks

app = FastAPI(
    title="Research Assistant API",
    version="0.1.0",
)


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

    try:
        pages = extract_pdf_pages(pdf_bytes)
    except Exception as error:
        raise HTTPException(
            status_code=422,
            detail="Unable to read the uploaded PDF.",
        ) from error

    chunks = chunk_pdf_pages(pages)

    embeddings = embed_chunks(chunks)

    full_text = "\n\n".join(
        str(page["text"]) for page in pages
    )

    return {
        "filename": file.filename,
        "page_count": len(pages),
        "chunk_count": len(chunks),
        "embedding_count": len(embeddings),
        "embedding_dimensions": (
            len(embeddings[0]) if embeddings else 0
        ),
        "sample_chunk": {
            "chunk_id": chunks[0].chunk_id,
            "page_number": chunks[0].page_number,
            "text": chunks[0].text,
        } if chunks else None,
        "sample_embedding": embeddings[0][:10] if embeddings else [],
    }