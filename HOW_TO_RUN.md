# How to Run eBanking

Complete guide to running the eBanking application locally.

## Prerequisites

- **Java 17+**
- **Node.js 18+** and npm
- **MySQL 8+** running on port 3306
- **Redis** running on port 6379
- **Maven 3.8+** (or use the included `mvnw`/`mvnw.cmd`)

## Quick Start

### 1. Database Setup

Ensure MySQL is running and create the database:

```sql
CREATE DATABASE IF NOT EXISTS eBanking;
```

The app uses `ddl-auto: update` — tables are created automatically on first boot.

### 2. Backend Setup

```bash
cd backend
```

Copy the environment template:

```bash
cp .env.example .env
```

Edit `.env` with your actual credentials (MySQL, Redis, JWT secret, Razorpay keys, Gmail app password for OTP).

Start the backend:

```bash
# Linux/macOS
./mvnw spring-boot:run

# Windows
mvnw.cmd spring-boot:run
```

Wait for: `Started EbankingApplication in X seconds` and `Tomcat started on port 8080`.

Verify: open http://localhost:8080/ → redirects to Swagger UI.

API base URL: `http://localhost:8080/api/v1`

### 3. Frontend Setup

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Wait for: `VITE ready` + `Local: http://localhost:5173/`

Open http://localhost:5173 — the Vite dev proxy forwards `/api/*` to `localhost:8080`, so no CORS configuration is needed.

## Using the Application

1. **Sign Up** → fill the registration form
2. Check your inbox for the **6-digit OTP** (valid for 5 minutes, 5 wrong attempts = 15-minute lockout)
3. Log in → **Accounts** page → create your savings account
4. **Deposits** → enter amount (₹0.01 – ₹1,00,000) → complete Razorpay test checkout
5. **Transfers** → send by mobile or account number
6. **AI Chat** → first enable "Data Sharing with Third Parties" in Profile → Privacy settings

## Default Roles

- New users are always registered as `USER` (no self-registration as `ADMIN`)
- To create an admin, promote an existing user via database: `UPDATE user SET role = 'ADMIN' WHERE email = 'user@example.com'`

## Stopping

Press `Ctrl+C` in each terminal to stop the servers.

## Troubleshooting

| Symptom | Solution |
|---------|----------|
| Backend exits with DB errors | MySQL not running — start the MySQL service |
| Backend exits with Redis refused | Redis not running — start Redis |
| `mvn` not found | Use `./mvnw` (Linux/macOS) or `mvnw.cmd` (Windows) |
| Vite proxy 404s | Backend not running or port mismatch — ensure backend is on :8080 |
| OTP email never arrives | Check Gmail app password in `.env` |
| AI chat returns error | `OPENROUTER_API_KEY` missing/invalid in `.env` |
| Login: "Too many failed attempts" | 5 wrong attempts = 15-minute lockout (by design) |
| Maven build fails | Ensure Java 17+ is the active JDK (`java -version`) |

## Environment Variables Reference

See `backend/.env.example` for all required variables.

## Production Build

```bash
# Backend
cd backend
./mvnw clean package
java -jar target/ebanking-0.0.1-SNAPSHOT.jar

# Frontend
cd frontend
npm run build      # Output in dist/
npm run preview    # Preview production build
```
