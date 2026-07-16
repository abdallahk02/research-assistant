# AI Research Assistant

An AI-powered research assistant for interacting with PDF documents using Retrieval-Augmented Generation (RAG). The project is designed as a production-quality portfolio application, emphasizing clean architecture, modular services, and an intuitive document reading experience.

## Features

* Modern PDF viewer built with Next.js and React
* PDF text extraction using PyMuPDF
* Overlapping text chunking for semantic retrieval
* Local embeddings with Sentence Transformers (`all-MiniLM-L6-v2`)
* Persistent vector storage with ChromaDB
* Semantic document search
* AI-powered question answering with cited source pages
* FastAPI backend with modular service architecture

## Tech Stack

### Frontend

* Next.js 16
* React 19
* TypeScript
* Tailwind CSS
* React-PDF (PDF.js)

### Backend

* FastAPI
* PyMuPDF
* Sentence Transformers
* ChromaDB
* Python 3.12
* Groq API (LLM)
* Document annotations
* Document comparison
