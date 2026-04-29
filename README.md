# Lead Dashboard & Reporting System

A production-style lead management dashboard built as a TypeScript monorepo.

## Stack

- Frontend: Next.js App Router, TypeScript, Tailwind CSS, Recharts
- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose, Zod
- Reporting: MongoDB aggregation, CSV and Excel export
- AI Insights: Gemini API via `@google/genai` with rule-based fallback
- Bonus: Python data analysis script

## Features

- Add, view, update, and delete leads
- Required lead fields: name, mobile, email, city, service, budget, status
- Dashboard metrics:
  - Total leads
  - Status-wise counts
  - City-wise distribution
  - Service-wise distribution
  - Conversion rate
  - Budget summaries
- Reports with filters:
  - Date range
  - City
  - Status
  - Service
  - Search by name/mobile/email
- CSV and Excel export
- Gemini-powered insights card
- Seed script for sample data
- Pagination, validation, centralized error handling, indexes

## Project Structure

```txt
lead-dashboard-reporting/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── server.ts
│   └── package.json
├── frontend/
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── types/
│   └── package.json
├── scripts/
│   └── analyze_leads.py
└── README.md
```

## Local Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure backend environment

Create `backend/.env` from the example:

```bash
cp backend/.env.example backend/.env
```

Update values:

```env
PORT=8000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/lead_dashboard
CLIENT_URL=http://localhost:3000
GEMINI_API_KEY=your_optional_gemini_api_key
```

Gemini is optional. If `GEMINI_API_KEY` is missing, the API returns rule-based insights.

### 3. Configure frontend environment

Create `frontend/.env.local`:

```bash
cp frontend/.env.example frontend/.env.local
```

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000/api
```

### 4. Seed sample data

```bash
npm run seed
```

### 5. Run the app

```bash
npm run dev
```

Frontend: `http://localhost:3000`  
Backend health: `http://localhost:8000/health`

## Main API Endpoints

### Leads

```txt
POST   /api/leads
GET    /api/leads?page=1&limit=10&search=rahul
GET    /api/leads/:id
PATCH  /api/leads/:id
DELETE /api/leads/:id
```

### Dashboard

```txt
GET /api/dashboard/metrics
GET /api/dashboard/insights
```

### Reports

```txt
GET /api/reports/leads?fromDate=2026-04-01&toDate=2026-04-29&city=Delhi&status=Interested&service=SEO
GET /api/reports/leads/export?format=csv
GET /api/reports/leads/export?format=xlsx
```

## Deployment

Recommended free/low-cost deployment:

- Frontend: Vercel
- Backend: Render or Railway
- Database: MongoDB Atlas free cluster

### Backend deploy environment

```env
NODE_ENV=production
PORT=8000
MONGODB_URI=<mongodb-atlas-uri>
CLIENT_URL=<vercel-frontend-url>
GEMINI_API_KEY=<optional>
```

Build command:

```bash
npm install && npm run build --workspace backend
```

Start command:

```bash
npm run start --workspace backend
```

### Frontend deploy environment

```env
NEXT_PUBLIC_API_BASE_URL=<backend-live-url>/api
```

## Python Analysis Bonus

Export a CSV report from the UI, then run:

```bash
python scripts/analyze_leads.py path/to/leads-report.csv
```

It prints summary metrics and creates chart images in `scripts/output`.

## Design Decisions

1. Separate frontend and backend for clean RESTful API evaluation.
2. MongoDB indexes are added for `createdAt`, `city`, `status`, `service`, and common reporting filter combinations.
3. Dashboard metrics are returned from one aggregation endpoint to reduce frontend round trips.
4. Reports use query-level filters with pagination to avoid loading all leads.
5. Export uses the same filter builder as reports, keeping table and exported data consistent.
6. Gemini insights are optional and resilient. The app continues working without an AI key.
