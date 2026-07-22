# AI Research Assistant

A PDF research assistant with a Next.js frontend and FastAPI backend. Upload a paper, search its contents with semantic retrieval, and ask grounded questions with page citations.

## What it does

- Upload PDF documents
- Extract and chunk text for retrieval
- Generate embeddings with Sentence Transformers
- Store and search chunks with ChromaDB
- Ask questions against a document with cited sources

## Tech stack

- Frontend: Next.js 16, React 19, TypeScript, Tailwind CSS
- Backend: FastAPI, PyMuPDF, ChromaDB, Sentence Transformers, Groq-powered LLM responses

## Setup

1. Install backend dependencies:

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. Create `backend/.env` with at least:

   ```env
   GROQ_API_KEY=your_key_here
   # Optional:
   # LLM_MODEL=llama-3.3-70b-versatile
   ```

3. If the frontend should point somewhere other than `http://127.0.0.1:8000`, set:

   ```env
   NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000
   ```

4. Install frontend dependencies:

   ```bash
   cd frontend
   npm install
   ```

## Run locally

Start the backend:

```bash
cd backend
uvicorn app.main:app --reload
```

Start the frontend:

```bash
cd frontend
npm run dev
```

The app expects the frontend on `http://localhost:3000` and the API on the backend server started above.

## API

- `GET /health`
- `POST /documents/extract`
- `POST /documents/search`
- `POST /documents/ask`
