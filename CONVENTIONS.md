# Project Conventions

## Project Overview

eBanking is a full-stack internet banking demo with a Spring Boot backend and React frontend. Users register with OTP verification, open savings accounts, deposit via Razorpay, transfer funds, and use a consent-gated AI chat assistant.

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Java 17, Spring Boot 3.5.7, Spring Security, Spring Data JPA, Spring Data Redis |
| **Frontend** | React 18, TypeScript, Vite, Tailwind CSS, Framer Motion, Zustand, TanStack Query |
| **Database** | MySQL |
| **Cache** | Redis |
| **Payments** | Razorpay (test mode) |
| **AI** | Spring AI / OpenRouter |

## Folder Structure

```
backend/
└── src/main/java/com/jsp/ebanking/
    ├── config/        // Security, JWT, Redis, Swagger configuration
    ├── controller/    // REST controllers (Auth, User, Admin, Chat)
    ├── service/       // Business logic interfaces + implementations
    ├── repository/    // Spring Data JPA repositories
    ├── entity/        // JPA entities (User, SavingBankAccount, Transaction, Consent)
    ├── dto/           // Data transfer objects (Request/Response)
    ├── mapper/        // MapStruct mappers
    ├── exception/     // Custom exceptions + global handler
    └── util/          // JWT utility, Payment helper

frontend/
└── src/
    ├── api/           // Axios client with interceptors
    ├── components/    // Shared UI components (Hero3D, Counter, VirtualCard)
    ├── features/      // Feature modules (auth)
    ├── hooks/         // Custom React hooks
    ├── lib/           // Utility functions
    ├── pages/         // Page components
    ├── providers/     // Context providers (Theme)
    ├── stores/        // Zustand stores (auth, ui)
    ├── types/         // TypeScript type definitions
    ├── animations.css // Global keyframes + animation classes
    ├── index.css      // Tailwind entry + design tokens
    └── App.tsx        // Routes + layout
```

## Commands

| Command | Description |
|---------|-------------|
| `cd backend && mvn spring-boot:run` | Start backend server on :8080 |
| `cd frontend && npm run dev` | Start Vite dev server on :5173 |
| `cd frontend && npm run build` | Production build to `dist/` |
| `cd frontend && npm run preview` | Preview production build |
| `cd backend && mvn test` | Run backend tests |
| `cd backend && mvn clean package` | Build deployable JAR |

## API Base URL

```
http://localhost:8080/api/v1
```

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and fill in:

| Variable | Purpose |
|----------|---------|
| `DB_URL` | MySQL connection string |
| `DB_UN` | MySQL username |
| `DB_PWD` | MySQL password |
| `REDIS_HOST` | Redis hostname |
| `REDIS_PORT` | Redis port |
| `EMAIL` | Gmail address for OTP |
| `APP_PASSWORD` | Gmail app password |
| `JWT_KEY` | JWT signing secret |
| `RZRPY_KEY` | Razorpay API key |
| `RZRPY_SECRET` | Razorpay API secret |
| `OPENROUTER_API_KEY` | OpenRouter key for AI chat |

## Naming Conventions

- **Files**: PascalCase for components (`SignUpForm.tsx`), camelCase for utilities (`formatCurrency.ts`)
- **Functions**: camelCase, verb-noun pattern (`handleSubmit`, `fetchUser`)
- **Components**: PascalCase (`Dashboard`, `VirtualCard`)
- **Hooks**: camelCase starting with `use` (`useAuth`, `useSmoothScroll`)
- **Stores**: camelCase with Store suffix (`authStore`, `uiStore`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`, `API_TIMEOUT`)
- **CSS classes**: Tailwind utility classes, kebab-case for custom classes (`card-interactive`, `btn-primary`)

## Error Handling

- Backend uses `@RestControllerAdvice` with custom exceptions (`DataNotFoundException`, `ExpiredException`, `PaymentFailedException`, etc.)
- Frontend uses React Hook Form + Zod for form validation
- API errors are intercepted and toasted via `sonner`

## Auth Pattern

- JWT tokens stored in `localStorage` via Zustand persist
- Axios interceptors attach `Authorization: Bearer` header
- 401 responses trigger automatic logout (GET requests only)
- Role-based access: `ROLE_USER` and `ROLE_ADMIN`

## Testing

- Backend: JUnit 5 + Mockito (in `src/test/`)
- Frontend: No tests yet (linting only via ESLint)

## Code Style

- Java: Follow Spring conventions, use `@Transactional` for write operations
- TypeScript: Strict mode enabled, no `any` types
- CSS: Tailwind-first, custom CSS via `@layer` in `index.css`

## Gotchas

- Backend `.env` must be sourced manually before `mvn spring-boot:run`
- Vite proxy forwards `/api/*` to backend (use port 5173, not 8080)
- First build triggers Vite dependency pre-bundling (~20s)
- Password must contain upper + lower + digit + special (`@$!%*?&`)
- 5 failed login attempts = 15-minute lockout
