# Submission Tracker

Submission Tracker is a full-stack workspace for reviewing broker-submitted opportunities. The app
includes a Django REST Framework backend and a Next.js frontend with filtering, pagination, and
detail views.

## Stack

- **Backend:** Django 5, Django REST Framework, django-filter
- **Frontend:** Next.js 16, React 19, Material UI, TanStack Query, Axios

## What Is Implemented

### Backend API

- `GET /api/submissions/`
  - Paginated response (`PAGE_SIZE = 10`)
  - Nested `broker`, `company`, and `owner`
  - `documentCount`, `noteCount`, and `latestNote` preview on each row
  - Filters:
    - `status`
    - `priority`
    - `createdFrom` (`YYYY-MM-DD`)
    - `createdTo` (`YYYY-MM-DD`)
    - `brokerId` (exact broker match)
    - `brokerSearch` (broker name contains)
    - `companySearch` (company name contains)
    - `hasDocuments` (true/false)
    - `hasNotes` (true/false)
    - `page`
- `GET /api/submissions/<id>/`
  - Full submission record with related `contacts`, `documents`, and `notes`
- `GET /api/brokers/`
  - Broker options for the list filter dropdown

### Frontend

- `/submissions`
  - Filter form wired to backend query params
  - Server-backed table with pagination
  - Loading, empty, and error states
  - Links into submission detail
- `/submissions/[id]`
  - Full detail layout (overview, broker/company/owner, contacts, documents, notes)
  - Loading, empty, and error handling

## Data Model

Entities are defined in `backend/submissions/models.py`:

- `Broker`
- `Company`
- `TeamMember`
- `Submission`
- `Contact`
- `Document`
- `Note`

Seed data (~25 submissions with related records) is available via:

```bash
python manage.py seed_submissions
```

Use `--force` to rebuild seed data.

## Project Structure

- `backend/` Django project and API
- `frontend/` Next.js application
- `INTERVIEWER_NOTES.md` reviewer context

## Environment Variables

Frontend requests default to:

- `NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api`

To override, create `frontend/.env.local`.

## Running Locally

### 1) Start Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_submissions   # optional but recommended
python manage.py runserver 0.0.0.0:8000
```

### 2) Start Frontend (new terminal)

```bash
cd frontend
npm install
cp .env.example .env.local          # optional if default API URL is fine
npm run dev
```

Open:

- `http://localhost:3000/submissions` (UI)
- `http://localhost:8000/api/submissions/` (API)

## Verification Checklist

- Submissions list loads and paginates
- Filters update query results
- Broker dropdown loads from `/api/brokers/`
- Clicking a row summary opens `/submissions/[id]`
- Detail page renders contacts, documents, and notes

## Common Local Issues

- **`Network Error` in UI**
  - Confirm backend is running on port `8000`
  - Confirm `NEXT_PUBLIC_API_BASE_URL` points to `http://localhost:8000/api`
  - Restart the frontend dev server after changing `.env.local`
- **`404` at `http://localhost:3000/brokers`**
  - Expected. `brokers` is an API endpoint (`/api/brokers/`), not a Next.js page route.
