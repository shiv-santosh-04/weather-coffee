# PokePortal App

A modern, responsive, dark-themed Pokemon portal web application built with **React**, **Tailwind CSS v4**, and a **FastAPI** backend database.

---

## Project Structure

```text
weather-coffee/
├── main.py                # FastAPI entrypoint (modified to enable CORS)
├── models.py              # Pydantic schemas (User credentials)
├── database.py            # SQLite/Postgres DB setup using SQLAlchemy
├── database_models.py     # SQLAlchemy model definitions (User table)
├── requirements.txt       # Backend dependencies (fastapi, uvicorn, etc.)
│
└── frontend/              # React frontend application
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx        # Navigation & auth status header
    │   │   ├── Login.jsx         # Sign in card with validation & error states
    │   │   ├── Signup.jsx        # Sign up card with validation & success flow
    │   │   └── PokemonSearch.jsx # Animated Pokemon details search screen
    │   ├── App.jsx               # Orchestrator & session manager
    │   ├── index.css             # Tailwind v4 imports & custom styles
    │   └── main.jsx              # Vite entrypoint
    ├── vite.config.js            # Tailwind v4 Vite plugin configuration
    └── package.json              # Frontend npm dependencies
```

---

## Getting Started

Follow these steps to run both the backend and frontend.

### Docker Integration

The Docker setup mirrors the same backend and database flow used in local development:

1. The frontend container serves the Vite app on port `5173`.
2. The backend container runs FastAPI on port `8000`.
3. The backend reads `DATABASE_URL` from `.env` and uses the Postgres service name `postgres` as the host.
4. Inside Docker, `localhost` would point to the container itself, so the database host must be the Compose service name instead of `localhost`.

The current `.env` file is already set up for Docker usage:

```env
DATABASE_URL=postgresql://admin:password@postgres:5432/weather_coffee_db
```

That value works because all Compose services share the same internal network, so the backend can resolve `postgres` directly.

### Prerequisites

Ensure you have the following installed:
* Python 3.8 or higher
* Node.js v18 or higher & npm

---

### Step 1: Run the Backend (FastAPI)

1. Navigate to the root directory (`/home/shiv/projects/weather-coffee`).
2. Activate your Python virtual environment:
   ```bash
   source venv/bin/activate
   ```
3. Install backend dependencies (if you haven't already):
   ```bash
   pip install -r requirements.txt
   ```
4. Start the FastAPI server using Uvicorn:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be running at `http://localhost:8000`.

If you are running the backend outside Docker and using a local Postgres server, change `DATABASE_URL` to use `localhost` instead of `postgres`.

---

### Step 2: Run the Frontend (React + Tailwind)

1. Open a new terminal window and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```
2. Start the Vite developer server:
   ```bash
   npm run dev
   ```
   The frontend will be running locally at `http://localhost:5173`.
3. Open your browser and navigate to **`http://localhost:5173`**.

### Step 3: Run Everything with Docker

1. Make sure Docker Desktop or the Docker Engine is running.
2. From the project root, start the stack:
   ```bash
   docker compose up -d --build
   ```
3. Open the app in your browser:
   * Frontend: `http://localhost:5173`
   * Backend: `http://localhost:8000`

The Compose file builds the backend from the repository root, passes `.env` into the backend container, and starts Postgres first so the FastAPI app can connect successfully.

---

## Features Implemented

1. **Authentication Flow:**
   * **Signup:** Users can register their account. The page validates passwords, checks for existing usernames, handles success states, and automatically redirects to the login screen.
   * **Login:** Integrates with backend SQLite/Postgres. Displays clear error alerts for bad credentials. Persists logged-in users to `localStorage` so they stay signed in on page refresh.

2. **Pokemon Database Search:**
   * Fully responsive layouts mapping custom animations for the load states.
   * Interactive stat progress meters utilizing colors specific to individual statistics.
   * Display of types, weight, height, and active/hidden abilities.
   * Suggested quick-search chips for instant searches (e.g., Pikachu, Charizard, Gengar).
   * Graceful error panels if a Pokemon is not found in the PokeAPI database.

3. **Premium Dark Mode UI:**
   * Modern grid background patterns, blur-based ambient glow decoration, and responsive grid layouts designed for mobile, tablet, and desktop viewports.
