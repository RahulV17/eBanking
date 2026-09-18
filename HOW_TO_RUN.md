# eBanking — How to Run (verified walkthrough)

Every step below was executed live on this machine (2026-09-10) before writing: backend started in ~11s, Vite ready in ~19s, and a login request through the browser port (5173) reached the backend and returned a real API response. Paths are for this machine.

## What you need running before you start

**MySQL and Redis are already Windows services on this machine and are running** (verified: 3306 and 6379 listening). If you reboot and they didn't start:

    # PowerShell (admin) — or use services.msc
    Start-Service MySQL80      # check the exact service name: Get-Service *mysql*
    Start-Service Redis

If Redis isn't installed as a service, start it manually:
    "C:\Program Files\Redis\redis-server.exe"

## 1. Start the backend (port 8080)

Open a terminal in **D:\Claude-Project\Ebanking\backend**.

The backend does NOT read `backend\.env` by itself (no dotenv library) — you must load the variables into the environment first.

**Git Bash (what the agent shell uses — verified working):**

    cd /d/Claude-Project/Ebanking/backend
    set -a && . ./.env && set +a
    "C:/Program Files/Apache/Maven/apache-maven-3.9.16-bin/apache-maven-3.9.16/bin/mvn.cmd" spring-boot:run

**PowerShell (no extra tooling):**

    cd D:\Claude-Project\Ebanking\backend
    Get-Content .env | ForEach-Object { $k,$v = $_ -split '=',2; [Environment]::SetEnvironmentVariable($k,$v) }
    mvn spring-boot:run

Wait for: `Started EbankingApplication in X seconds` and `Tomcat started on port 8080`.
First boot takes ~11s; it also auto-creates/updates the DB schema (`ddl-auto: update`) — no SQL scripts to run.

Verify: open http://localhost:8080/ in a browser → redirects to Swagger UI (dev profile). API base: http://localhost:8080/api/v1

## 2. Start the frontend (port 5173)

New terminal:

    cd D:\Claude-Project\Ebanking\frontend
    npm run dev

Wait for: `VITE ready` + `Local: http://localhost:5173/` (first boot ~20s — it re-optimizes deps after the dependency changes).

Open **http://localhost:5173** — that's the app. The Vite dev proxy forwards `/api/*` to `localhost:8080`, so no CORS dance as long as you use 5173 (not 8080) in the browser.

## 3. Use it (happy path)

1. **Sign Up** (5173 → /register): fill the form — no role dropdown anymore (users are always USER now, even if the API is called directly with role=ADMIN).
2. Check your inbox for the **6-digit OTP** (sent from the Gmail in `.env`; ~5 min validity, 5 wrong tries = 15-min lockout).
3. Log in → **Accounts** page → create your savings account (₹0, pending admin approval).
4. **Log in as your admin** (your pre-existing admin account from the DB) → Admin page → approve the pending account.
5. Back as the user → **Deposits** → amount (₹0.01–₹1,00,000) → Razorpay test checkout.
6. **Transfers** → send by mobile/account — you now get a confirmation modal first.
7. **AI Chat**: first enable "Data Sharing with Third Parties" in Profile → Privacy settings, or the assistant will tell you it's gated.

## Stop everything

    Ctrl+C in the frontend terminal, then Ctrl+C in the backend terminal. (MySQL/Redis services stay running — leave them.)

## Troubleshooting (the real gotchas on this machine)

| Symptom | Fix |
|---|---|
| Backend exits instantly, DB errors | MySQL service not running (step 0). Check `netstat -an \| findstr 3306`. |
| Backend exits with Redis connection refused | Redis not running. `"C:\Program Files\Redis\redis-server.exe"` |
| `mvn` not found / classworlds error | Plain `mvn` is broken in some shells here — use the full path `"C:/Program Files/Apache/Maven/apache-maven-3.9.16-bin/apache-maven-3.9.16/bin/mvn.cmd"` or `mvnw.cmd`. |
| Vite proxy 404s/ECONNREFUSED | Backend not up, or multiple node processes fighting over 5173 — kill all node (`taskkill /F /IM node.exe`), kill all java if needed, restart both. Only one of each. |
| OTP email never arrives | Gmail APP_PASSWORD in `.env` stale/wrong — backend logs the mail error. |
| AI chat returns config error | OPENROUTER_API_KEY missing/invalid in `.env` (dev-only feature). |
| Login says "Too many failed attempts" | 5 wrong passwords = 15-min lock (working as designed since wave 2). |

## The `.env` file (backend\.env — never commit it)

DB_URL, DB_UN, DB_PWD (MySQL) · REDIS_HOST, REDIS_PORT · EMAIL, APP_PASSWORD (OTP mail) · PORT (8080) · JWT_KEY · RZRPY_KEY, RZRPY_SECRET (Razorpay test keys) · OPENROUTER_API_KEY (AI chat, dev only)

All keys must be present or boot fails with a placeholder-resolution error naming the missing one — that error is your fastest diagnostic.

## Smoke tests after our fix waves (quick)

- Register via curl with `"role":"ADMIN"` → created user gets USER (verify in Admin → Users).
- POST /api/v1/auth/forgot-password/{random@example.com} → same 200 response as a real email (no oracle).
- Transfer with tampered amount in the body → server uses the Razorpay order amount, not the body.
