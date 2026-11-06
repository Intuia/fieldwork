# Attacking Authentication — Ch. 6 Study Guide

Interactive educational website covering Chapter 6 "Attacking Authentication" from *The Web Application Hacker's Handbook, 2nd ed.*, with an update module comparing 2011 guidance to current standards (NIST SP 800-63-4, OWASP, FIDO Alliance 2025).

## Stack

- **Vite** + **React 19** + **TypeScript**
- **Tailwind CSS v4** with custom design tokens
- **Framer Motion** for animations (respects `prefers-reduced-motion`)
- **Fuse.js** for client-side search (Ctrl+K)
- **Vitest** for unit tests

## Getting Started

```bash
npm install
npm run dev        # Start dev server at http://localhost:5173
npm run build      # Production build to dist/
npm run test       # Run Vitest unit tests
npm run test:watch # Run tests in watch mode
```

## Site Map (12 routes)

| Route | Content | Source Slides |
|---|---|---|
| `/` | Home — objectives, access chain, takeaways | 1, 3, 5, 64 |
| `/technologies` | Authentication technologies (forms, MFA, certs, federation) | 6–10 |
| `/design-flaws` | 14 design flaws with attack/impact/fix | 11–26 |
| `/implementation-flaws` | 5 implementation flaws (fail-open, state machine, storage) | 27–32 |
| `/threat-model` | 2×2 threat mapping grid | 33 |
| `/defenses` | 4-layer defense architecture with 9 controls | 34–43 |
| `/assessment` | Safe testing workflow and case analyses | 44–48 |
| `/then-vs-now` | 2011 vs current standards comparison | 49–58 |
| `/labs` | 8 interactive client-side labs | — |
| `/quiz` | 28 scenario-based questions with instant feedback | — |
| `/checklist` | 22-item interactive review checklist (Slide 62) | 62 |
| `/references` | Source links (NIST, OWASP, FIDO, textbook) | — |

## Interactive Labs

All labs run entirely in the browser with toy in-memory servers. No real network requests or attack tooling.

1. **Access Chain Explorer** — Toggle failures at each authentication link
2. **Enumeration Comparator** — Side-by-side vulnerable vs hardened responses
3. **Rate-Limit Simulator** — Compare 4 counter placement strategies
4. **Multistage State Machine** — Skip/repeat/reorder/cross-account attacks
5. **Password Storage Cost** — Compare plaintext, fast hash, and slow hash breach impact
6. **Policy Checker** — Evaluate passwords under 2011 rules vs NIST 800-63B-4
7. **MFA Factor Sorter** — Sort authenticators by factor category and phishing resistance
8. **Then-vs-Now Slider** — Timeline slider morphing guidance from 2011 to 2025

## Tests

Unit tests cover the server logic for labs 2, 3, 4, and 6:

```bash
npm run test
```

## Safety & Ethics

This is defensive security education. The site does not include working exploit code, real-target tooling, credential lists beyond a tiny illustrative blocklist, or instructions for unauthorized access. Every attack concept is presented with its defense. Labs use fake in-memory toy servers — no real network requests, no scanning, no payload lists, no code that could be pointed at an external host. Passwords entered in labs stay in the browser and are never stored or sent.

## Accessibility

- Skip-to-content link for keyboard users
- All interactive elements have ARIA labels and keyboard support
- `prefers-reduced-motion` respected (CSS animations disabled)
- Focus-visible outlines on all interactive elements
- Semantic HTML landmarks (`nav`, `main`, `footer`)
- Print styles included

## Deploy

Build produces a static site in `dist/`. Deploy to any static host.

```bash
npm run build
# Upload dist/ to your host
```

**Vercel:** The included `vercel.json` handles SPA routing automatically.

**Netlify:** The included `public/_redirects` handles SPA routing automatically.

Build command: `npm run build` | Output directory: `dist`

## Sources

- *The Web Application Hacker's Handbook*, 2nd ed., Chapter 6 (Wiley, 2011)
- NIST SP 800-63-4 / 63B-4 — Digital Identity Guidelines (final, July 2025)
- OWASP Authentication & Password Storage Cheat Sheets
- FIDO Alliance — Passkeys guidance (2025)
