# GigFlow

A lightweight marketplace for posting gigs and submitting bids. This repository contains a Node/Express backend and a React + Vite frontend.

---

## 🔧 Tech Stack

- **Backend:** Node.js, Express, MongoDB (Mongoose)
- **Frontend:** React, Vite, Tailwind CSS
- **Auth:** JWT via HttpOnly cookies

---

## 🚀 Project Structure

Root folders:
- `backend/` — Express API server
- `Frontend/` — React frontend (Vite)

Important files:
- `backend/app.js` — Express app / route mounting
- `backend/.env` — backend env vars (MONGOURI, JWTSECRET, FRONTEND_URL)
- `backend/src/routes/*.js` — API routes (`/api/auth`, `/api/gigs`, `/api/bids`)
- `Frontend/src/utils/axiosInstance.js` — axios instance (uses `VITE_BASE_URL`)

---

## ⚙️ Setup (Windows)

Prerequisites: Node.js, npm, a MongoDB connection string.

1. Clone repository and install dependencies

```powershell
cd "d:\Study folder\projects\GigFlow\backend"
npm install

cd "d:\Study folder\projects\GigFlow\Frontend"
npm install
```

2. Configure environment variables

- Backend: create `backend/.env` with:

```dotenv
MONGOURI=<your mongodb connection string>
JWTSECRET=<your jwt secret>
FRONTEND_URL=http://localhost:5173
```

- Frontend: create `Frontend/.env` (Vite expects vars prefixed with VITE_):

```env
VITE_BASE_URL=http://localhost:5000
```

3. Run the servers

- Backend (prod-like):
```powershell
cd backend
npm start
# or for auto-restart during dev:
# npx nodemon app.js
```

- Frontend (dev):
```powershell
cd Frontend
npm run dev
```

The backend listens on port **5000** and the frontend dev server usually runs on **5173**.

---

## 🔐 Environment & Cookies

- Backend reads `MONGOURI`, `JWTSECRET`, and `FRONTEND_URL` from `backend/.env`.
- Auth uses a JWT stored in a cookie called `accessToken`. Cookie options are set in `backend/src/config/cookie.config.js` (HttpOnly, secure, sameSite: none).
- Frontend axios instance is configured in `Frontend/src/utils/axiosInstance.js` and uses `withCredentials: true`, so cookies are sent with requests.

---

## 📡 API Documentation

All API routes are prefixed under `/api`.

### Auth
- POST `/api/auth/register`
  - body: `{ name, email, password }`
  - returns: created `user` and sets `accessToken` cookie
- POST `/api/auth/login`
  - body: `{ email, password }`
  - returns: `user` and sets `accessToken` cookie
- GET `/api/auth/me` (protected)
  - returns current `user` (middleware reads cookie)
- POST `/api/auth/logout` (protected)
  - clears `accessToken` cookie

### Gigs
- POST `/api/gigs/` (protected)
  - body: `{ title, description, budget }`
  - creates a gig owned by authenticated user
- GET `/api/gigs/?search=<query>`
  - returns gigs; `search` uses text indexes on `title` and `description`

### Bids
- POST `/api/bids/` (protected)
  - body: `{ gigId, message }` — creates a bid by authenticated user
- GET `/api/bids/?gigId=<id>` (protected)
  - returns bids for a gig; only gig owner may view bids
- PATCH `/api/bids/:bidId/hire` (protected)
  - gig owner accepts a bid — bid becomes `hired`, other bids become `rejected` and gig status becomes `assigned`

Notes:
- Protected endpoints use `authMiddleware` which expects a valid JWT sent via `accessToken` cookie.
- Example curl login flow (save cookies to a jar):


---

## 🗂 Models (summary)

User (`backend/src/models/User.model.js`)
- `name` (String, required)
- `email` (String, unique, required)
- `password` (String, required, select: false)

Gig (`backend/src/models/gig.model.js`)
- `title`, `description`, `budget`, `ownerId` (ref `user`), `status` (`open` | `assigned`)
- text index on `title` & `description` for search

Bid (`backend/src/models/bid.model.js`)
- `gigId` (ref `Gig`), `freelancerId` (ref `user`), `message`, `status` (`pending` | `hired` | `rejected`)

---

## 💡 Tips & Notes

- Because cookies are HttpOnly, the frontend relies on the backend setting the cookie; axios is configured to send cookies with `withCredentials: true`.
- If you want hot-reload for backend development, use `npx nodemon app.js` (nodemon is listed in devDependencies).
- Search on gigs uses MongoDB text search and expects a text index (already defined in `gig.model.js`).

---