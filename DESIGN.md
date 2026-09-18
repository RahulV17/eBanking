# Design System: eBanking

> Portfolio-grade internet banking demo. Real authentication, test-mode payments, AI assistant with genuine privacy controls.

---

## 1. Visual Theme & Atmosphere

A **restrained, gallery-airy interface** with **confident asymmetric layouts** and **fluid spring-physics motion**. The atmosphere is **clinical yet warm** — like a well-lit architecture studio. Built for trust and clarity in equal measure.

- **Density:** Art Gallery Airy (3/10)
- **Variance:** Offset Asymmetric (6/10)
- **Motion:** Fluid CSS (5/10)

---

## 2. Color Palette & Roles

### Neutrals (Zinc family, cool grey)
- **Canvas** `#F9FAFB` — Primary background surface
- **Surface** `#FFFFFF` — Card and container fill
- **Surface Elevated** `#F1F5F9` — Sidebar, elevated panels
- **Ink Primary** `#0F172A` — Headlines and primary text
- **Ink Secondary** `#64748B` — Body text, descriptions, metadata
- **Border** `#E8ECF0` — Structural lines, card borders

### Accent (Single, restrained)
- **Electric Blue** `#2563EB` — CTAs, active states, focus rings, links
  - **Hover:** `color-mix(in oklab, #2563EB 88%, black)`
  - **Active:** `scale(0.98)` press feedback

### Semantic
- **Success** `#059669` — Positive balances, active status, confirmations
- **Warning** `#D97706` — Pending states, attention needed
- **Danger** `#DC2626` — Errors, blocked status, destructive actions

### Banned
- Pure black `#000000` — never use; always use off-black Ink Primary
- Pure white `#FFFFFF` on pure white — always surface-elevated or tinted
- Purple/blue neon gradients — banned as AI default
- More than one accent color — Electric Blue only
- Warm grays mixed with cool grays — Zinc family only

---

## 3. Typography Rules

### Type Stack
- **Sans (body):** Inter, system-ui, -apple-system, sans-serif
- **Display (headings):** Inter, system-ui, -apple-system, sans-serif — track-tight, controlled scale
- **Mono (data):** JetBrains Mono, Fira Code, monospace — for balances, account numbers, timestamps

### Scale (clamp for responsive)
- **Display/Hero:** `clamp(2.25rem, 5vw, 3.75rem)` — `tracking-tighter`, `font-weight: 700`
- **H1:** `clamp(2rem, 4vw, 3rem)` — `tracking-tight`
- **H2:** `clamp(1.5rem, 3vw, 2.25rem)` — `tracking-tight`
- **H3:** `clamp(1.25rem, 2vw, 1.5rem)` — `tracking-tight`
- **Body:** `1rem` (16px), `line-height: 1.6`, `max-width: 65ch`
- **Small:** `0.875rem` (12-14px), `font-weight: 500`
- **Micro:** `0.6875rem` (11px), `font-weight: 500`

### Banned
- Serif fonts (this is a product UI, not editorial)
- More than one accent color in text
- Gradient text on large headers
- All-caps subheaders everywhere (max 1 per 3 sections)
- `text-wrap: balance` on headings (allowed)
- `text-wrap: pretty` on long prose (allowed)

---

## 4. Component Stylings

### Buttons
- **Primary:** Solid `#2563EB` fill, white text, `rounded-lg`, `px-4 py-2`
  - **Hover:** Darken 88% + subtle shadow increase
  - **Active:** `scale(0.98)` press feedback
  - **Focus:** `outline: none; ring: 2px ring-primary-100; border-color: primary-500`
- **Secondary:** Surface-muted fill, text-primary, no border
  - **Hover:** `bg-border`
- **Ghost:** Transparent, text-secondary → text-primary on hover
- **Contrast check:** All button text passes WCAG AA 4.5:1 minimum
- **CTA wrap:** Max 3 words, single line at desktop, no wrapping

### Cards
- **Style:** Generously rounded (`rounded-2xl`), `border: 1px solid #E8ECF0`, no shadow
- **Elevation:** Background color only, no box-shadow (shadows are reserved for modals/dropdowns)
- **Usage:** Only when elevation communicates hierarchy
- **High-density:** Replace with `border-t` dividers or negative space

### Inputs
- **Label:** Above input, `text-sm font-medium text-text-primary`
- **Input:** `w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary`
- **Focus:** `outline-none ring-2 ring-primary-100 border-primary-500`
- **Error:** Below input, `text-sm text-danger-600`
- **Placeholder:** Never use as label substitute

### States
- **Loading:** Skeletal loaders matching layout shape (no generic spinners)
- **Empty:** Composed "getting started" view with CTA
- **Error:** Inline error messages, contextual (not `window.alert()`)
- **Disabled:** `opacity-50 cursor-not-allowed`

---

## 5. Layout Principles

### Grid
- **Container:** `max-w-7xl mx-auto px-4 sm:px-6` (1280px max, responsive padding)
- **Responsive:** CSS Grid over flexbox math — no `calc()` percentage hacks
- **Hero:** Asymmetric split (text left, visual right), not centered
- **Features:** Bento grid with mixed cell sizes (not 3 equal cards)
- **Mobile:** Strict single-column collapse below 768px

### Spacing
- **Section gaps:** `py-16 lg:py-24` (generous, breathable)
- **Card gaps:** `gap-4` to `gap-6`
- **Tight data:** `gap-2` for compact lists
- **Viewport stability:** `min-h-[100dvh]`, never `h-screen` (iOS Safari fix)

### Z-Index Scale
- `z-40` — Sticky navbars, sidebar overlays
- `z-50` — Dropdowns, modals, toasts
- `z-[60]` — Grain/noise overlay (fixed, pointer-events-none)

---

## 6. Motion & Interaction

### Animation Rules
- **Engine:** Motion (framer-motion) for UI, CSS transitions for hover/active
- **Duration:** 200-300ms for hover/fade, 400-550ms for entry
- **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (expo-out) for reveals
- **Properties:** Animate ONLY `transform` and `opacity` — never `top/left/width/height`

### Hero
- Staggered entry: badge → headline → subtext → CTAs → trust strip
- Each element `delay: i * 0.05` with `y: 16-20` fade-up
- Product mock bars animate with `height: 0 → target` on mount

### Reduced Motion
- All animations honor `prefers-reduced-motion: reduce`
- Fallback: instant transition (opacity only, no transform)

---

## 7. Anti-Patterns (NEVER DO)

### Visual
- ❌ Pure black `#000000` backgrounds
- ❌ Neon/outer glow shadows
- ❌ Oversaturated accent colors
- ❌ Purple/blue AI gradient aesthetic
- ❌ Glassmorphism (backdrop-blur) on headers
- ❌ Gradient text on large headers
- ❌ Decorative status dots on every list item

### Typography
- ❌ Serif fonts in product UI
- ❌ Inter as default display font (allowed here, but pair with Mono)
- ❌ All-caps eyebrow above every section (max 1 per 3 sections)
- ❌ Tiny uppercase wide-tracked labels everywhere

### Layout
- ❌ 3-column equal card grids
- ❌ Centered hero sections when variance > 4
- ❌ Complex flexbox percentage math (`calc(33%-1rem)`)
- ❌ Cards inside cards inside cards

### Content
- ❌ "John Doe" / "Acme Corp" placeholder names
- ❌ "Elevate" / "Seamless" / "Unleash" AI clichés
- ❌ Fake round numbers (99.99%, 50%)
- ❌ Exclamation marks in success messages
- ❌ "Oops!" error messages
- ❌ Em-dashes anywhere visible (use hyphen `-`)

### Interaction
- ❌ Buttons without hover states
- ❌ Instant transitions (0ms)
- ❌ Missing focus rings
- ❌ Generic circular spinners (use skeleton loaders)
- ❌ Empty dashboards with no empty state
- ❌ Dead links (`href="#"`)
