# Research Assistant

A local workspace for reading research PDFs and, eventually, exploring them with AI. The app currently includes a Next.js PDF workspace, a FastAPI service, and PostgreSQL with pgvector.

## Requirements

- Node.js 20 or newer
- Python 3.11 or newer
- Docker (for PostgreSQL)

## Setup

Start the database from the repository root:

```bash
docker compose up -d
```

Start the backend:

```bash
cd backend
python -m venv .venv
# Windows PowerShell
.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Start the frontend in a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:3000. The API health endpoint is available at http://localhost:8000/health.

## Checks

```bash
cd frontend
npm run lint
npm run build
```
