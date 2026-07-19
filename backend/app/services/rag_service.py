from dataclasses import dataclass
from typing import Literal

from app.services.vector_store import SearchResult, search_document
from app.services.llm_service import generate_answer

DEFAULT_RETRIEVAL_LIMIT = 5
MAX_HISTORY_MESSAGES = 10

@dataclass(frozen=True)
class RagSource:
    chunk_id: int
    page_number: int
    text: str
    distance: float


@dataclass(frozen=True)
class RagResponse:
    answer: str
    sources: list[RagSource]

@dataclass(frozen=True)
class ChatMessage:
    role: Literal["user", "assistant"]
    content: str

def prepare_history(history: list[ChatMessage]) -> list[dict[str, str]]:
    """
    Validate and limit conversation history before sending it to the LLM.
    """
    recent_history = history[-MAX_HISTORY_MESSAGES:]

    prepared_history: list[dict[str, str]] = []

    for message in recent_history:
        content = message.content.strip()

        if not content:
            continue

        prepared_history.append(
            {
                "role": message.role,
                "content": content
            }
        )

    return prepared_history


def build_context(search_results: list[SearchResult]) -> str:
    """
    Convert retrieved document chunks into structured context for the LLM.
    """
    context_blocks: list[str] = []

    for index, result in enumerate(search_results, start=1):
        block = (
            f"[Page {result.page_number}]\n"
            f"Chunk ID: {result.chunk_id}\n"
            f"Content:\n{result.text}"
        )

        context_blocks.append(block)

    return "\n\n".join(context_blocks)


def build_sources(search_results: list[SearchResult]) -> list[RagSource]:
    """
    Convert internal vector-store results into source objects that can be
    returned to the API layer.
    """
    return [
        RagSource(
            chunk_id=result.chunk_id,
            page_number=result.page_number,
            text=result.text,
            distance=result.distance,
        )
        for result in search_results
    ]


def ask_document(
    document_id: str,
    question: str,
    limit: int = DEFAULT_RETRIEVAL_LIMIT,
    history: list[ChatMessage] | None=None
) -> RagResponse:
    """
    Answer a question using chunks retrieved from a specific document.
    """
    normalized_document_id = document_id.strip()
    normalized_question = question.strip()

    if not normalized_document_id:
        raise ValueError("document_id cannot be empty")

    if not normalized_question:
        raise ValueError("question cannot be empty")

    if limit < 1:
        raise ValueError("limit must be at least 1")

    search_results = search_document(
        document_id=normalized_document_id,
        query=normalized_question,
        limit=limit,
    )

    if not search_results:
        return RagResponse(
            answer="I could not find relevant information in this document.",
            sources=[],
        )

    context = build_context(search_results)

    llm_history = prepare_history(history or [])

    answer = generate_answer(
        question=normalized_question,
        context=context,
        history=llm_history
    )

    sources = build_sources(search_results)

    return RagResponse(
        answer=answer,
        sources=sources,
    )