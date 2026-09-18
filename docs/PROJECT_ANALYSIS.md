# eBanking Project — Full Analysis Report
> Generated: 2026-09-18 | Tools: code-review-graph + manual inspection

---

## 1. Project Statistics

| Metric | Backend | Frontend | Total |
|--------|---------|----------|-------|
| **Files** | 60 | 29 | 89 |
| **Nodes** | 350 | 136 | 486 |
| **Edges** | 1,926 | 1,197 | 3,123 |
| **Languages** | Java, YAML, Bash | TSX, TypeScript, CSS | — |
| **Communities** | 13 | 10 | 23 |
| **Execution Flows** | 32 | 5 | 37 |

---

## 2. Architecture Communities

### Backend (13 communities)

| Community | Size | Cohesion | Description |
|-----------|------|----------|-------------|
| **service-account** | 93 | 0.16 | `src/main/java/com/jsp/ebanking/service` — Account operations |
| **controller-account** | 57 | 0.45 | `src/main/java/com/jsp/ebanking/controller` — REST endpoints |
| **resources** | 45 | 0.00 | `src/main/resources` — YAML configs |
| **repository-find** | 18 | 0.29 | Repository query methods |
| **util-extract** | 17 | 0.17 | Utility extraction functions |
| **dto-razorpay** | 16 | 0.13 | Razorpay DTOs |
| **service-redis** | 15 | 0.20 | Redis operations |
| **config-security** | 12 | 0.33 | Security configuration |
| **entity-consent** | 11 | 0.27 | User consent entities |
| **service-token** | 10 | 0.30 | Token management |
| **dto-response** | 9 | 0.33 | Response DTOs |
| **config-swagger** | 8 | 0.25 | Swagger/OpenAPI config |
| **exception-handler** | 7 | 0.43 | Exception handlers |

### Frontend (10 communities)

| Community | Size | Cohesion | Description |
|-----------|------|----------|-------------|
| **pages-handle** | 55 | 0.06 | `pages/` — Page components |
| **components-sign** | 12 | 0.06 | `features/auth/components` — Sign-in/up forms |
| **hooks-use** | 8 | 0.02 | `hooks/` — Custom hooks |
| **types-user** | 8 | 0.05 | `types/` — TypeScript types |
| **src-route** | 7 | 0.07 | `App.tsx` — Route definitions |
| **stores-auth** | 7 | 0.14 | Zustand stores |
| **api-client** | 6 | 0.17 | API client + interceptors |
| **lib-utils** | 5 | 0.20 | Utility functions |
| **components-layout** | 5 | 0.20 | Layout components |
| **providers-theme** | 4 | 0.25 | Theme provider |

---

## 3. Dead Code Analysis

### Backend (33 dead symbols)

| Category | Count | Examples |
|----------|-------|----------|
| **Unused Classes** | 3 | `BankingRole`, `EbankingApplicationTests`, `EbankingApplication` |
| **Unused Functions** | 30 | `getOtpTtlSeconds`, `toDtoList`, `revokeAllUserTokens`, `findByRole`, `getDashboardStats`, `getAllUsers`, `searchUsers`, `getPendingAccounts`, `approveBankAccount`, `blockAccount`, `unblockAccount`, `TokenService`, `register`, `verifyOtp`, `resendOtp`, `forgotPassword`, `resetPassword`, `login`, `logout`, `viewSavingsAccount`, `createSavingsAccount`, `checkBalance`, `deposit`, `confirmPayment`, etc. |

### Frontend (27 dead symbols)

| Category | Count | Examples |
|----------|-------|----------|
| **Unused Types** | 3 | `AdminTab`, `AuthResponse`, `ConsentSettings` |
| **Unused Functions** | 24 | `response`, `closeMobile`, `handleSuccess`, `toggleMode`, `onSubmit`, `onRegister`, `onVerifyOtp`, `handleResendOtp`, `maskAccountNumber`, `handleKeyPress`, `handleEnableConsent`, `clearChat`, `handleCreateAccount`, `handleSendOtp`, `handleVerifyOtp`, `handleResetPassword`, `handleDownloadCSV`, `executeConfirmed`, etc. |

---

## 4. Large Functions (Refactoring Candidates)

### Backend

| File | Lines | Issue |
|------|-------|-------|
| `UserServiceImpl.java` | 532 | God class — handles auth, accounts, transfers, deposits |
| `ChatService.java` | 205 | Monolithic AI chat handler |
| `AdminServiceImpl.java` | 179 | Multiple admin concerns |
| `AdminController.java` | 130 | Too many endpoints |
| `RedisService.java` | 105 | Cache + session + OTP in one |

### Frontend

| File | Lines | Issue |
|------|-------|-------|
| `AIChat.tsx` | 416 | Complex chat UI + logic + streaming |
| `Transfers.tsx` | 409 | Order creation + confirmation + Razorpay |
| `Accounts.tsx` | 388 | Account creation + display + cards |
| `Dashboard.tsx` | 381 | Balance + transactions + stats |
| `Profile.tsx` | 337 | Profile + privacy + consent |

---

## 5. Execution Flows (Critical Paths)

### Backend — Top 5 by Criticality

| Flow | Criticality | Depth | Nodes | Files |
|------|-------------|-------|-------|-------|
| **login** | 0.815 | 3 | 13 | 10 |
| **getAllUsers** | 0.805 | 3 | 6 | 5 |
| **approveAccount** | 0.792 | 3 | 5 | 4 |
| **getBankAccount** | 0.783 | 3 | 5 | 4 |
| **confirmTransfer** | 0.775 | 4 | 8 | 6 |

### Frontend — Top 5 by Criticality

| Flow | Criticality | Depth | Nodes | Files |
|------|-------------|-------|-------|-------|
| **App** | 0.765 | 4 | 60 | 20 |
| **Dashboard** | 0.720 | 3 | 25 | 8 |
| **Transfers** | 0.695 | 4 | 18 | 6 |
| **Accounts** | 0.680 | 3 | 15 | 5 |
| **AIChat** | 0.650 | 3 | 12 | 4 |

---

## 6. Knowledge Gaps & Risks

### Backend

| Gap | Severity | Description |
|-----|----------|-------------|
| **UserServiceImpl** | 🔴 High | 532-line god class — split into AuthService, AccountService, TransferService |
| **No unit tests** | 🔴 High | `EbankingApplicationTests` is dead — zero test coverage |
| **Hardcoded secrets** | 🟡 Medium | JWT secret in `application-dev.yml` should be env-var |
| **No input sanitization** | 🟡 Medium | `register()` accepts unsanitized DTO |

### Frontend

| Gap | Severity | Description |
|-----|----------|-------------|
| **AIChat.tsx** | 🔴 High | 416 lines — extract message parsing, streaming, and consent logic |
| **Transfers.tsx** | 🔴 High | 409 lines — split into OrderForm, ConfirmationModal, RazorpayWrapper |
| **No error boundaries** | 🟡 Medium | Missing React error boundaries |
| **No loading skeletons** | 🟡 Medium | Pages show blank while fetching |
| **Type duplication** | 🟡 Medium | `AuthResponse` defined but unused — actual response types inline |

---

## 7. Recommendations

### Immediate (Before GitHub Upload)

1. **Create `.env.example`** — Document required env vars (DB_URL, JWT_SECRET, RAZORPAY_KEY, REDIS_URL)
2. **Add README.md** at root — Quickstart for backend + frontend
3. **Add LICENSE** — MIT or Apache 2.0

### Short-Term (Next Sprint)

1. **Refactor `UserServiceImpl`** — Extract:
   - `AuthService` (register, login, logout, OTP)
   - `AccountService` (createAccount, viewAccount, checkBalance)
   - `TransferService` (createOrder, confirmTransfer)
   - `DepositService` (initDeposit, confirmDeposit)

2. **Refactor large frontend pages** — Extract:
   - `AIChat` → `useAIChat` hook + `MessageList` + `ConsentGate`
   - `Transfers` → `TransferForm` + `ConfirmationModal` + `RazorpayButton`

3. **Add unit tests** — Start with `AuthService` + `TransferService`

### Long-Term

1. **Add integration tests** — Spring Boot Test + TestContainers (MySQL + Redis)
2. **Add E2E tests** — Playwright for critical flows (register → login → deposit)
3. **Add CI/CD** — GitHub Actions for build + test + deploy

---

## 8. Tech Stack Summary

| Layer | Technology |
|-------|------------|
| **Backend** | Spring Boot 3.5.7, Java 17, Spring Security, JWT, JPA/Hibernate, Redis, Razorpay |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, R3F (Three.js), Zustand, TanStack Query, React Hook Form, Zod |
| **Database** | MySQL (JPA/Hibernate) |
| **Cache** | Redis (sessions, OTP, rate limiting) |
| **Payments** | Razorpay (test mode) |
| **AI** | Spring AI / OpenRouter (chat assistant) |

---

## 9. Project File Count Summary

| Category | Count |
|----------|-------|
| **Java files** | 56 |
| **TSX/TS files** | 29 |
| **CSS files** | 3 |
| **Config files** | 6 (yml, json, toml) |
| **Asset files** | 16 (png, jpg, mp4) |
| **Documentation** | 7 (md files) |
| **Total tracked** | ~117 files |

---

## 10. Build & Run Commands

```bash
# Backend (from backend/)
./mvnw spring-boot:run

# Frontend (from frontend/)
npm install
npm run dev    # Development (http://localhost:5173)
npm run build  # Production build
```

---

*Report generated by code-review-graph + Hermes Agent*
