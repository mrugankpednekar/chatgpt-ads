# ChatGPT Ads — Design System

B2B SaaS workspace (Impeccable product register). Utility first, restrained chrome. Treat all campaigns as real client work; no demo disclaimers in UI.

## Product positioning

- **Product name:** ChatGPT Ads (workspace may use "Ads Studio" in marketing contexts)
- **Tone:** Minimal copy; labels earn their place. No "demo", "mock", "sample output", or placeholder disclaimers in user-facing strings
- **Reference client:** Bubble Skincare — Spring Launch is a live campaign, not a sandbox label

## Typography

- **UI / body:** IBM Plex Sans (400, 500, 600)
- **Metrics / data:** IBM Plex Mono with `tabular-nums`
- Fixed rem scale for product UI (no fluid clamp on workspace headings)
- No Inter, no gradient display type

## Color

- **Ground:** `oklch(98.5% 0.004 95)` warm off-white
- **Surface:** `oklch(100% 0 0)` with hairline border
- **Text primary:** `oklch(22% 0.012 95)`
- **Text secondary:** `oklch(48% 0.012 95)` (≥4.5:1 on ground for body)
- **Accent:** `oklch(42% 0.11 155)` single green for primary actions and active nav
- **Border:** `oklch(91% 0.006 95)`
- Restrained strategy: tinted neutrals + one accent ≤10% of chrome

## Spatial rhythm

- Spacing scale: 8 / 16 / 24 / 32 px (`gap-2`, `gap-4`, `gap-6`, `gap-8`)
- Section breaks: `mb-10`–`mb-12` between major blocks
- Page header: `mb-10 pb-8` below title row

## Rules

- Hairline borders before shadows; flat surfaces
- No glassmorphism, mesh gradients, purple/violet AI accents
- No nested cards; one surface level per section
- One primary action per screen header
- Radius: 6px (`rounded-md`); 8px for modals only
- Motion: 150–200ms ease-out; no bounce on buttons
- Cards only when they are the right affordance; prefer single bordered surfaces

## Impeccable

Skills installed at `.cursor/skills/impeccable/` (also `.agents/skills/impeccable/`). Follow `reference/product.md`, `quieter.md`, and `typeset.md` for workspace changes.
