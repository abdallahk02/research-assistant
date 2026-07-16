import pymupdf

def extract_pdf_pages(pdf_bytes):
    pages: list[dict[str,object]] = []

    with pymupdf.open(stream=pdf_bytes, filetype='pdf') as document:
        for page_index, page in enumerate(document):
            pages.append(
                {
                    "page_number": page_index + 1,
                    "text": page.get_text("text"),
                }
            )

    return pages
