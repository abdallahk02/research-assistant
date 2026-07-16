from dataclasses import dataclass


@dataclass
class TextChunk:
    chunk_id: int
    page_number: int
    text: str


def split_text(
    text: str,
    chunk_size: int = 1_500,
    overlap: int = 200,
) -> list[str]:
    if chunk_size <= 0:
        raise ValueError("chunk_size must be greater than zero.")

    if overlap < 0:
        raise ValueError("overlap cannot be negative.")

    if overlap >= chunk_size:
        raise ValueError("overlap must be smaller than chunk_size.")

    cleaned_text = " ".join(text.split())

    if not cleaned_text:
        return []

    chunks: list[str] = []
    start = 0

    while start < len(cleaned_text):
        end = min(start + chunk_size, len(cleaned_text))
        chunk = cleaned_text[start:end]

        # Avoid splitting in the middle of a word.
        if end < len(cleaned_text):
            last_space = chunk.rfind(" ")

            if last_space > 0:
                end = start + last_space
                chunk = cleaned_text[start:end]

        chunks.append(chunk.strip())

        if end >= len(cleaned_text):
            break

        start = end - overlap

    return chunks


def chunk_pdf_pages(
    pages: list[dict[str, object]],
    chunk_size: int = 1_500,
    overlap: int = 200,
) -> list[TextChunk]:
    chunks: list[TextChunk] = []
    chunk_id = 0

    for page in pages:
        page_number = int(page["page_number"])
        page_text = str(page["text"])

        page_chunks = split_text(
            text=page_text,
            chunk_size=chunk_size,
            overlap=overlap,
        )

        for text in page_chunks:
            chunks.append(
                TextChunk(
                    chunk_id=chunk_id,
                    page_number=page_number,
                    text=text,
                )
            )

            chunk_id += 1

    return chunks