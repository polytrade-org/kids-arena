# Polytrade Kids AI Arena

Consumer product. Web/PWA-first. Mobile-mobile. Kids ages 8–14 create AI characters, deploy them in arenas, earn from popularity. Solo build.

## Canonical references
- `polytrade-kids-arena-brief.md` — full product brief; product decisions live here
- `polytrade-brand-architecture.md` — Polytrade as mother brand decision
- `docs/safety.md` — content moderation and kid-safety design (must exist before user-facing AI generation)
- `docs/parent-controls.md` — parent dashboard spec

## Hard rules

- **Kid safety is non-negotiable.** Every AI generation passes moderation before display. No PII collected from kids beyond age range. No DMs in V1. No image upload (AI-generated only).
- **Parent visibility on everything.** Every kid action is auditable in the parent dashboard. No exceptions.
- **No dark patterns.** No infinite scroll designed to addict. No notification spam. No FOMO mechanics. No gambling-style loot boxes (cosmetics ARE allowed; gambling-disguised-as-cosmetics is not).
- **PWA-first.** No native iOS/Android apps in V1. Web-first means iteration speed and zero app-store dependency.
- **Use SuperAwesome kWS** for COPPA/GDPR-K compliance — don't roll your own kid-data handling.
- **AI generation is async.** Show loading state, don't block UI. Cache aggressively.
- **Hard cost limits per user per day.** AI generation is the variable cost. Cap by tier (free vs premium). Monitor weekly.

## Architecture
- `src/app/` — Next.js App Router pages
- `src/components/` — React components (shadcn/ui base + custom)
- `src/lib/ai/` — AI service clients (Claude, Flux, ElevenLabs)
- `src/lib/moderation/` — pre-display + post-display content moderation
- `src/lib/arena/` — arena mode logic (battle, talkshow, duel, story, hangout)
- `src/lib/economy/` — Spark coin earning + spending logic
- `src/lib/kws/` — SuperAwesome kWS integration
- `prisma/` — schema + migrations
- `docs/` — product/safety/architecture docs

## Stack
- Next.js 15 (App Router)
- TypeScript strict mode
- Tailwind CSS + shadcn/ui
- Framer Motion for character animations
- Prisma + Postgres (Neon)
- Upstash Redis for arena real-time state
- Cloudflare R2 for asset storage
- Clerk for auth (parent + kid accounts)
- SuperAwesome kWS for compliance
- Stripe + Stripe Connect for payments + creator earnings
- Claude API for character personality/dialogue
- Replicate (Flux) for character visual generation
- ElevenLabs for character voices (V1.5)
- PostHog for analytics
- Sentry for errors

## Workflow
- `pnpm dev` — local dev with mocked AI services
- `pnpm dev:full` — local dev with real AI services (uses budget)
- `pnpm test` — unit + integration tests
- `pnpm test:safety` — content moderation pipeline tests (run before any AI feature ships)
- `pnpm db:migrate` — Prisma migrations
- `pnpm deploy:preview` — Vercel preview deploy (for review)
- `pnpm deploy:prod` — protected, requires git tag

## Conventions
- Component files: `PascalCase.tsx`
- Hooks: `use<Name>.ts`
- API routes: kebab-case folders
- Database tables: snake_case
- Arena mode IDs: snake_case (`battle`, `talk_show`, `creative_duel`)
- Spark coins stored as integers (multiply by 1000 for fractional handling); never floats
- Currency stored as integers in cents; never floats
- All timestamps ISO 8601 UTC
- All AI prompts versioned (don't ship prompt changes without version bump)

## When adding features

1. **Does it touch kids' data?** If yes, run through `docs/safety.md` checklist before building.
2. **Does it generate AI content shown to a kid?** If yes, route through `src/lib/moderation/` — no exceptions.
3. **Does it cost money to operate (AI calls)?** If yes, add per-user-tier rate limits before merging.
4. **Does it affect parent visibility?** If yes, update parent dashboard in same PR.
5. **Does it change earning/spending mechanics?** If yes, document in `docs/economy.md` and require additional review.

## Don't
- Don't ship AI generation features without moderation pipeline integration. Ever.
- Don't add features that bypass parent visibility. Even "small" ones.
- Don't roll your own COPPA compliance. Use kWS.
- Don't store PII about kids beyond what kWS-handled flows require.
- Don't use real names anywhere in the product (kid display names are pseudonyms).
- Don't add gambling-disguised-as-cosmetics mechanics. If it has random loot pulls with paid currency, it's gambling.
- Don't build native mobile apps in V1. PWA only.
- Don't optimize for engagement at the cost of kid wellbeing. Daily time limits are a feature, not a friction.

## The "this would scare a parent" test

Before shipping any feature: imagine showing it to a parent who's skeptical of AI products for kids. If the answer to "would this make them concerned?" is yes, address the concern in the design before shipping. Don't ship and "see if anyone notices."

## Compliance review checklist (before any user-facing launch)

- [ ] kWS parent consent flow tested end-to-end
- [ ] Privacy policy + ToS reviewed by counsel
- [ ] Content moderation pipeline tested with adversarial prompts
- [ ] Parent dashboard displays everything kid does
- [ ] Time limit and disable controls work
- [ ] Stripe earnings flow tested with parent-approval gate
- [ ] No PII leaks in logs, analytics, or third-party calls
- [ ] Cost controls verified (per-user AI generation caps)
- [ ] Reporting/flagging mechanism live with manual review queue
