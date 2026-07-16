from functools import lru_cache

from sentence_transformers import SentenceTransformer

from app.services.chunker import TextChunk


MODEL_NAME = "sentence-transformers/all-MiniLM-L6-v2"


@lru_cache(maxsize=1)
def get_embedding_model() -> SentenceTransformer:
    """Load and cache the embedding model once per server process."""

    return SentenceTransformer(MODEL_NAME)


def embed_chunks(chunks: list[TextChunk]) -> list[list[float]]:
    """Generate one normalized embedding for each text chunk."""

    if not chunks:
        return []

    model = get_embedding_model()
    texts = [chunk.text for chunk in chunks]

    embeddings = model.encode(
        texts,
        batch_size=32,
        show_progress_bar=False,
        normalize_embeddings=True,
    )

    return embeddings.tolist()