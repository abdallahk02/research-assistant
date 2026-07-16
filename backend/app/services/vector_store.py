from functools import lru_cache
from pathlib import Path

import chromadb
from chromadb.api.models.Collection import Collection

from app.services.chunker import TextChunk


DATABASE_PATH = Path(__file__).resolve().parents[2] / "data" / "chroma"
COLLECTION_NAME = "research_documents"


@lru_cache(maxsize=1)
def get_chroma_client() -> chromadb.PersistentClient:
    DATABASE_PATH.mkdir(parents=True, exist_ok=True)

    return chromadb.PersistentClient(
        path=str(DATABASE_PATH),
    )


@lru_cache(maxsize=1)
def get_document_collection() -> Collection:
    client = get_chroma_client()

    return client.get_or_create_collection(
        name=COLLECTION_NAME,
    )


def store_document_chunks(
    document_id: str,
    filename: str,
    chunks: list[TextChunk],
    embeddings: list[list[float]],
) -> int:
    if len(chunks) != len(embeddings):
        raise ValueError(
            "Each chunk must have a corresponding embedding."
        )

    if not chunks:
        return 0

    collection = get_document_collection()

    ids = [
        f"{document_id}-chunk-{chunk.chunk_id}"
        for chunk in chunks
    ]

    documents = [chunk.text for chunk in chunks]

    metadatas = [
        {
            "document_id": document_id,
            "filename": filename,
            "chunk_id": chunk.chunk_id,
            "page_number": chunk.page_number,
        }
        for chunk in chunks
    ]

    collection.upsert(
        ids=ids,
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas,
    )

    return len(ids)