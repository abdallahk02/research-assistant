from functools import lru_cache
from pathlib import Path
from dataclasses import dataclass

import chromadb
from chromadb.api.models.Collection import Collection

from app.services.chunker import TextChunk
from app.services.embedding_service import embed_query


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

@dataclass
class SearchResult:
    chunk_id: int
    page_number: int
    text: str
    distance: float


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


def search_document(
    document_id: str,
    query: str,
    limit: int = 5,
) -> list[SearchResult]:
    if not document_id.strip():
        raise ValueError("document_id cannot be empty.")

    if limit <= 0:
        raise ValueError("limit must be greater than zero.")

    query_embedding = embed_query(query)
    collection = get_document_collection()

    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=limit,
        where={"document_id": document_id},
        include=["documents", "metadatas", "distances"],
    )

    documents = results["documents"][0] if results["documents"] else []
    metadatas = results["metadatas"][0] if results["metadatas"] else []
    distances = results["distances"][0] if results["distances"] else []

    search_results: list[SearchResult] = []

    for document, metadata, distance in zip(
        documents,
        metadatas,
        distances,
    ):
        if document is None or metadata is None or distance is None:
            continue

        search_results.append(
            SearchResult(
                chunk_id=int(metadata["chunk_id"]),
                page_number=int(metadata["page_number"]),
                text=document,
                distance=float(distance),
            )
        )

    return search_results
