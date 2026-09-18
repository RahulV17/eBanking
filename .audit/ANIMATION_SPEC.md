# GOAT Fintech Animation Specification
## Source: https://dribbble.com/shots/27369899-GOAT-Save-Smarter-with-AI
## Analysis: 14 frames @ 1fps + video observation

---

## 1. PER-FRAME ANIMATION TIMELINE

### Frame 0-1s: Hero Entry
- **Background**: Peach-to-white gradient fades in from left (duration: 800ms, ease: expo-out)
- **Headline "SAVE SMARTER."**: Letters stagger in from below (duration: 600ms, delay: 200ms, stagger: 30ms per letter)
- **3D Abstract Shapes**: Float in from right with scale-up (duration: 800ms, delay: 400ms, scale: 0.8 → 1)
- **Subheadline**: Fade in + slide up (duration: 500ms, delay: 600ms)
- **Scroll Indicator**: Bounce in from bottom (duration: 400ms, delay: 900ms)

### Frame 2-3: Stats/Glassmorphism Entry
- **Headline "BUILD BETTER..."**: Text fade in + slide up (duration: 500ms, delay: 0ms)
- **4 Glass Cards**: Stagger up from below (duration: 600ms, delay: 100ms, stagger: 80ms)
  - Each card: slideY(40px → 0) + opacity(0 → 1)
  - Backlight glows fade in behind each card (duration: 400ms, delay: 300ms)
- **Numbers count up**: 0 → final value (duration: 1200ms, ease: expo-out)

### Frame 4-7: How It Works / Phone Mockups
- **"HOW IT WORKS" header**: Slide in from left (duration: 400ms)
- **4 Numbered Steps**: Stagger fade in + slide left (duration: 400ms, stagger: 100ms)
- **Phone Mockups**: Slide in from right with parallax (duration: 700ms, delay: 200ms)
  - Left phone (Top Up): delay 200ms
  - Right phone (Dashboard): delay 400ms
- **Cursor hover effect**: Appears over Step 01 (pulse animation, continuous)

### Frame 8-12: Feature Details
- **Goal cards (Trip to Italy, New Car)**: Scale in with spring physics (duration: 500ms, spring: stiffness: 200, damping: 20)
- **Progress bars**: Animate fill from 0% to target (duration: 1500ms, ease: expo-out, delay: 600ms)
- **Suggestion items**: Stagger slide in from bottom (duration: 300ms, stagger: 60ms)
- **Keypad buttons**: Ripple effect on tap (scale: 1 → 0.95 → 1, duration: 150ms)

### Frame 13-14: CTA / Footer
- **"Download app" button**: Scale in with spring (duration: 500ms, delay: 100ms)
- **Subscribe input**: Slide up from bottom (duration: 400ms, delay: 200ms)
- **Footer links**: Stagger fade in (duration: 300ms, stagger: 50ms)

---

## 2. GLOBAL ANIMATION TOKENS

| Token | Value | Usage |
|-------|-------|-------|
| `--duration-instant` | 100ms | Micro-interactions |
| `--duration-fast` | 200ms | Hover states |
| `--duration-normal` | 300ms | Transitions |
| `--duration-slow` | 500ms | Entrance effects |
| `--duration-slower` | 800ms | Complex reveals |
| `--duration-glacial` | 1200ms | Count-up numbers |
| `--ease-out-expo` | cubic-bezier(0.16, 1, 0.3, 1) | Most animations |
| `--ease-out-quart` | cubic-bezier(0.25, 1, 0.5, 1) | Gentle exits |
| `--ease-out-back` | cubic-bezier(0.34, 1.56, 0.64, 1) | Bouncy reveals |
| `--ease-spring` | cubic-bezier(0.175, 0.885, 0.32, 1.275) | Spring physics |
| `--stagger-fast` | 50ms | Tight lists |
| `--stagger-normal` | 100ms | Standard lists |
| `--stagger-slow` | 150ms | Hero elements |

---

## 3. COMPONENT PATTERNS

### Hero Section
```tsx
// Background gradient fade
<motion.div
  initial={{ opacity: 0, scaleX: 0 }}
  animate={{ opacity: 1, scaleX: 1 }}
  transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
/>

// Headline letter stagger
<motion.h1>
  {"SAVE SMARTER.".split("").map((letter, i) => (
    <motion.span
      key={i}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 + i * 0.03 }}
    >
      {letter}
    </motion.span>
  ))}
</motion.h1>

// 3D shapes float in
<motion.div
  initial={{ opacity: 0, scale: 0.8, x: 40 }}
  animate={{ opacity: 1, scale: 1, x: 0 }}
  transition={{ duration: 0.8, delay: 0.4 }}
>
  {/* Floating shapes with continuous animation */}
  <motion.div animate={{ y: [-8, -12, -6, -8], rotate: [0, 1, 0, -1, 0] }} transition={{ duration: 6, repeat: Infinity }} />
</motion.div>
```

### Glassmorphism Cards
```tsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: index * 0.08 }}
  style={{
    background: 'rgba(255, 255, 255, 0.7)',
    backdropFilter: 'blur(12px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  }}
>
  {/* Backlight glow */}
  <div style={{
    position: 'absolute',
    inset: '-20px',
    background: 'radial-gradient(circle, rgba(251, 191, 36, 0.15) 0%, transparent 70%)',
    zIndex: -1,
  }} />
</motion.div>
```

### Number Count-Up
```tsx
<motion.span
  initial={{ opacity: 0, y: 10 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
  viewport={{ once: true }}
>
  <CountUp end={91} duration={1.2} suffix="%" />
</motion.span>
```

### Progress Bar Fill
```tsx
<motion.div
  initial={{ width: 0 }}
  whileInView={{ width: '76%' }}
  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: 0.6 }}
  style={{ height: '8px', borderRadius: '4px', background: '#8B5CF6' }}
/>
```

### Phone Mockups
```tsx
// Parallax slide-in
<motion.div
  initial={{ opacity: 0, x: 60 }}
  whileInView={{ opacity: 1, x: 0 }}
  transition={{ duration: 0.7, delay: index * 0.2 }}
>
  <PhoneFrame>
    <Screen />
  </PhoneFrame>
</motion.div>
```

### 3D Floating Shapes (Background)
```tsx
<motion.div
  animate={{
    y: [-8, -12, -6, -8],
    rotate: [0, 1, 0, -1, 0],
    scale: [1, 1.02, 1],
  }}
  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
  style={{
    width: '300px',
    height: '300px',
    borderRadius: '50%',
    background: 'radial-gradient(circle at 30% 30%, #FCD34D, #F59E0B)',
    boxShadow: '0 20px 40px rgba(245, 158, 11, 0.3)',
  }}
/>
```

---

## 4. CONTINUOUS AMBIENT ANIMATIONS

### Floating Shapes
- `animation: float 6s ease-in-out infinite`
- Variants: `float-slow` (8s), `float-delay-1/2/3` (staggered starts)

### Background Blobs
- `animation: gradient-shift 8s ease infinite` (background-size: 200% 200%)
- Slow rotation: `animation: spin-slow 20s linear infinite`

### Pulse Glow
- `animation: pulse-glow 3s ease-in-out infinite`
- For backlight effects behind cards

### Bounce Subtle
- `animation: bounce-subtle 2s ease-in-out infinite`
- For scroll indicators, download buttons

---

## 5. SCROLL-TRIGGERED ANIMATIONS

| Trigger | Animation | Delay |
|---------|-----------|-------|
| Hero visible | Background gradient fade | 0ms |
| Headline visible | Letter stagger | 200ms |
| Stats visible | Cards slide up + numbers count | 100ms |
| Steps visible | Steps stagger + phones slide | 200ms |
| Goals visible | Cards scale + progress fill | 300ms |
| CTA visible | Button spring + input slide | 100ms |
| Footer visible | Links stagger fade | 50ms |

---

## 6. GLASSMORPHISM & 3D EFFECTS

### Glass Card
```css
background: rgba(255, 255, 255, 0.7);
backdrop-filter: blur(12px);
border: 1px solid rgba(255, 255, 255, 0.3);
box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
```

### Backlight Glow (behind cards)
```css
position: absolute;
inset: -20px;
background: radial-gradient(circle at center, rgba(251, 191, 36, 0.15) 0%, transparent 70%);
border-radius: inherit;
z-index: -1;
```

### 3D Button Press
```css
transform-style: preserve-3d;
transition: transform 100ms, box-shadow 100ms;
/* On active */
transform: translateY(2px) scale(0.98);
```

---

## 7. PAGE TRANSITIONS

### Slide Transition (between sections)
```tsx
<motion.div
  initial={{ opacity: 0, y: 40 }}
  animate={{ opacity: 1, y: 0 }}
  exit={{ opacity: 0, y: -40 }}
  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
/>
```

### Fade + Scale (modal/overlay)
```tsx
<motion.div
  initial={{ opacity: 0, scale: 0.95 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0, scale: 0.95 }}
  transition={{ duration: 0.3 }}
/>
```

---

## 8. IMPLEMENTATION CHECKLIST

- [ ] Add animation tokens to CSS
- [ ] Create `animations.css` with keyframes
- [ ] Implement hero letter stagger
- [ ] Add glassmorphism card styles
- [ ] Implement number count-up component
- [ ] Add progress bar fill animation
- [ ] Create floating 3D shapes component
- [ ] Add scroll-triggered animations (whileInView)
- [ ] Implement phone mockup parallax
- [ ] Add continuous ambient animations
- [ ] Add page transitions
- [ ] Add reduced-motion support
- [ ] Verify all animations honor prefers-reduced-motion
