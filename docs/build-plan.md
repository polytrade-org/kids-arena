# Polytrade Kids AI Arena — V1 Build Plan

> Sequential build plan for finishing the V1 alpha. Each session is a discrete milestone. Claude Code should execute one session at a time, stopping at the end of each for human approval before proceeding.

## Current state (as of this plan creation)

✅ Next.js 15 scaffolded — TypeScript, Tailwind, App Router, src/ layout, pnpm
✅ Prisma schema with snake_case mapping in dedicated `kids_arena` Postgres schema (Neon)
✅ Models: Parent, Kid, Character per brief §9.3
✅ Clerk auth working end-to-end: sign-up creates Parent row in DB
✅ Protected `/parent-dashboard` route with currentUser() integration
✅ DATABASE_URL and CLERK keys are set in .env.local
✅ Repo on GitHub (polytrade-org/kids-arena), connected to Vercel (Hobby tier)

## What remains for Phase A (Friends & Family Alpha)

5 sessions. Execute each, summarize, wait for human approval before next.

---

## SESSION 1 — Housekeeping

**Goal:** clean up loose ends from the auth session.

1. Update `CLAUDE.md` — add a note about middleware location with src/ layout, under the Architecture section:
   > `src/middleware.ts` — Clerk auth middleware. NOTE: with src/ layout, middleware.ts must live at `src/middleware.ts`, not at the project root.

2. Group any uncommitted changes from the auth session into logical commits:
   - Commit 1: "Add Prisma migration, Clerk auth, parent dashboard"
   - Commit 2 (separate, for log clarity): "docs(claude): note middleware location with src/ layout"

3. Push to GitHub. Vercel will auto-deploy.

4. Instruct the human to:
   - Drop old public tables in Neon by running this SQL in the Neon SQL Editor:
     ```sql
     DROP TABLE IF EXISTS public.users CASCADE;
     DROP TABLE IF EXISTS public.profiles CASCADE;
     DROP TABLE IF EXISTS public.kyc_submissions CASCADE;
     DROP TABLE IF EXISTS public.faucet_drips CASCADE;
     DROP TYPE IF EXISTS public.kyc_status;
     ```
   - Add `DATABASE_URL` (with `&schema=kids_arena` suffix copied from `.env.local`) to Vercel → Settings → Environment Variables
   - Add both `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` to Vercel env vars
   - Sign up on the deployed Vercel URL to verify production auth works end-to-end

**Stop. Wait for human to confirm production sign-up creates a Parent row.**

---

## SESSION 2 — Service signups + kid profile flow

**Pre-work the human will complete in browser before starting this session:**

- Sign up at https://console.anthropic.com — add `ANTHROPIC_API_KEY` (starts with `sk-ant-`) to `.env.local` and Vercel env vars. Add $10–20 in credits. Set spending limit at $50/mo.
- Sign up at https://replicate.com — add `REPLICATE_API_TOKEN` (starts with `r8_`) to `.env.local` and Vercel env vars. Add $10 in prepaid credits.

**Goal:** parents can add kids to their account.

1. Verify the Prisma schema has Parent → Kid → Character relations correctly defined. Generate Prisma client.

2. Create `src/app/parent-dashboard/kids/new/page.tsx` — a form to create a new kid profile:
   - displayName (string, 2–30 chars, no PII)
   - ageRange (enum: AGES_8_10 / AGES_11_12 / AGES_13_14 — define as Prisma enum, migrate)
   - Use shadcn/ui or simple Tailwind components

3. Create a server action `createKid(formData)`:
   - Verify authenticated user
   - Look up the Parent row by Clerk userId (or email)
   - Validate inputs with zod
   - Create Kid linked to Parent
   - Redirect to `/parent-dashboard/kids/[kidId]`

4. Update `/parent-dashboard`:
   - List of the parent's kids (cards or simple list)
   - "Add a Kid" button → `/parent-dashboard/kids/new`
   - Each kid card links to `/parent-dashboard/kids/[kidId]`

5. Create `/parent-dashboard/kids/[kidId]/page.tsx` — placeholder showing kid details + empty characters list (will populate in Session 3).

6. Test: sign up → add a kid → see kid in dashboard → click into kid detail.

**Use server actions, not API routes.** Validate all inputs with zod. Use the Prisma client singleton from `src/lib/db.ts`.

**Stop. Summarize. Wait for human approval.**

---

## SESSION 3 — Character Creator (the core feature)

**Goal:** kids design AI characters via prompts; AI generates personality + visual.

1. Create `src/app/parent-dashboard/kids/[kidId]/characters/new/page.tsx` — character creation form:
   - name (string, 2–50 chars, profanity-filtered)
   - vibeDescription (textarea, max 500 chars — "describe what this character is like")
   - visualStyle (select: realistic / cartoon / anime / pixel)
   - stats: power (1–10), wit (1–10), charm (1–10), mystery (1–10) — sum capped at 20 to force trade-offs

2. Create `src/lib/ai/` directory with:
   - `claude.ts` — Anthropic SDK client, helper for character personality generation
   - `replicate.ts` — Replicate client, helper for visual generation using Flux Schnell (fast, cheap)
   - `moderation.ts` — pre-display content moderation using Claude (returns `{safe: boolean, reason?: string}`)

3. Server action `createCharacter(formData, kidId)`:
   - Validate with zod (name length, stat sum, ownership of kid)
   - Run name + vibeDescription through `moderation.ts` BEFORE generating anything. Reject if unsafe.
   - Generate personality via Claude:
     - System prompt: "You're designing an AI character for a kid creator on Polytrade Arena. The character has these traits: [name, vibe, style, stats]. Generate a JSON with: catchphrase (under 50 chars), speakingStyle (one sentence), favoriteThings (array of 3), quirks (array of 2). Keep PG-rated. Output JSON only."
     - Parse, validate, run through moderation again
   - Generate visual via Replicate (Flux Schnell):
     - Prompt: "[visualStyle] portrait of [name], [vibeDescription excerpt], digital art, kid-friendly, vibrant colors, no text"
     - Save image URL to character.visualUrl
   - Save character to DB with personalityJson, statsJson, visualUrl
   - Redirect to character detail page

4. Create `/parent-dashboard/kids/[kidId]/characters/[characterId]/page.tsx`:
   - Display character: visual + name + personality + stats
   - "Chat with character" button → opens a simple chat UI where the kid can talk to their character via Claude API using personalityJson as system context
   - Chat history stored in DB (new ChatMessage model linking to Character)

5. Update `/parent-dashboard/kids/[kidId]` to show characters as a grid (visual + name cards).

6. Per-kid rate limits:
   - Free tier: 3 character creations per week per kid
   - Track via Character.createdAt counts
   - Show remaining quota in the create-character UI

7. Loading + error states:
   - AI generation can take 5–15 seconds; show progress indicator
   - Handle Replicate timeout (>30s): save character with visualUrl=null, queue retry
   - Show friendly error messages on moderation rejection

**Test the full flow yourself:** create a kid → create a character → wait for AI generation → see character → chat with character.

**Stop. Summarize. Wait for human approval.**

---

## SESSION 4 — Arena Battle Mode

**Goal:** characters can compete; results matter to creators.

1. Add to Prisma schema:
   - `Battle` model (id, characterAId, characterBId, scenario, winnerId, outcomeNarrative, sparkCoinsAwarded, createdAt)
   - Add `sparkBalance` field to Kid (integer, default 0)
   - Migrate

2. Create `src/app/arena/page.tsx` — public arena page (no auth required; safe by design):
   - "Battle Arena" section header
   - Recent battle outcomes (last 20)
   - Top characters this week (by wins)
   - Note: public read-only views show character name + visual + creator's displayName, NOT parent emails or PII

3. Create `src/app/arena/battle/new/page.tsx`:
   - Auth required
   - Select one of the kid's characters
   - Auto-match against a random recently-active character (avoid self-match)
   - Run battle: feed both characters' personality + stats + a random scenario from a curated list (`src/lib/arena/scenarios.ts` — start with ~20 kid-safe scenarios) into Claude
   - Claude returns: `{winnerId, narrative (2–3 sentences, kid-friendly, no violence), sparkCoinsAwarded (10–50 based on margin)}`
   - Animate the reveal in the UI
   - Increment winner's kid sparkBalance by award amount
   - Save Battle row

4. Each Character detail page shows battle history (wins, losses, total spark coins earned).

5. Update parent dashboard to show kid's sparkBalance (no cashout in V1 — virtual only per brief §7).

6. Cost control: rate-limit battles to 10 per kid per day to manage Claude API spend.

**Stop. Summarize. Wait for human approval.**

---

## SESSION 5 — Polish + Sharing + Alpha-ready

**Goal:** prepare for friends & family alpha test.

1. **Sharable character cards:**
   - Generate an OG image for each character at `/c/[characterId]/og` (visual + name + stats + "Made on Polytrade Arena")
   - Add OG meta tags to character detail page
   - Test that pasting a character URL into iMessage / WhatsApp shows the rich preview

2. **Public character profile** at `/c/[characterId]` — read-only, no auth, shareable URL. Shows visual, name, personality public bits (catchphrase, quirks), stats, recent battles.

3. **Mobile polish:**
   - Test every flow at 375px width (iPhone SE viewport)
   - Fix any horizontal scroll, button-too-small, text-overflow issues
   - Tap targets minimum 44×44px

4. **Loading + empty states:**
   - Cute character-generation loader (something kids will tolerate during the 10s wait)
   - Empty state for new parents ("Welcome — add your first kid")
   - Empty state for new kids ("Create your first character")
   - Empty state for arena (when no battles yet)

5. **Error handling:**
   - AI generation failures → friendly retry button, no scary error codes
   - Network failures → toast notifications
   - Moderation rejections → kid-friendly "Let's try a different idea" messaging

6. **Parent dashboard improvements:**
   - Total characters created across all kids
   - Total battles won this week
   - Total time spent (track via simple session start/end pings)
   - Settings page placeholder (time limits, content prefs — V1.5)

7. **Daily/weekly leaderboard** on `/arena` page:
   - Top 10 characters by battle wins this week
   - Rolls over Monday 00:00 UTC

8. **Final pre-alpha checklist:**
   - All forms validate
   - All AI outputs go through moderation
   - All errors caught and displayed gracefully
   - No console errors in browser dev tools
   - Production deploy on Vercel works end-to-end
   - Parent can do the full loop without confusion

**Stop. Hand off to human for alpha invites.**

---

## After Session 5: Human will do

- Invite 10–20 known kids (son's friends, family kids — Vihaan first) to alpha
- Get parents' verbal consent (no formal kWS yet — Phase C)
- Manually monitor flagged content via daily DB review
- Observe usage for 4 weeks (Phase B — Validate)
- Decision at end of Phase B: GO PUBLIC (start Phase C), PIVOT, or KILL per brief §16

If validation passes, V1.5 begins. V1.5 has two parallel workstreams: Arena retention features (Session 6) and the Studio module (Sessions 7–11). Studio is a first-class module of Kids AI Arena, not a feature add — see brief §6a for the two-module thesis.

---

## V1.5 — Sessions 6–11

These sessions ship only after V1 alpha validates. Don't start any of them until human gives the green light post-validation.

---

## SESSION 6 — Arena V1.5 (retention + earning loops)

**Goal:** add Spark coin cashout, character marketplace, more arena modes.

1. Spark coin → real money cashout flow:
   - Conversion rate from brief §7 (1000 Spark = $1)
   - Minimum payout threshold ($20)
   - Parent approval required
   - Stripe Connect integration for payout to parent's bank
   - Tax form collection for parents above earning thresholds

2. Character marketplace:
   - Listings page where kids browse/buy characters from other kids
   - Listing flow (kid lists own character, sets Spark price)
   - Trade transactions with 15% marketplace fee to platform
   - Creator royalty system (original creator earns 5% on every resale)

3. Two more arena modes (per brief §4.2):
   - Creative Duel (characters face creative challenges; community vote)
   - Story Mode (characters live in evolving worlds, write their own stories)

4. Daily/weekly featured creator program:
   - Algorithmic + manual curation
   - Featured creators get bonus Spark coins + leaderboard badge

Stop, summarize, wait for human approval before starting Studio sessions.

---

## SESSION 7 — Studio foundation + Thumbnail Generator

**Goal:** lay Studio module infrastructure and ship the first creator tool — thumbnail generation.

**Why thumbnails first:**
- Lowest technical risk (image generation, same pipeline as character visuals)
- Immediate visible value to kid creators
- Validates the Studio user flow before expensive features (video)
- Vihaan-validated need: thumbnails are real friction on his channel today

**Pre-work the human will complete in browser before this session:**
- Confirm Anthropic + Replicate API budgets can absorb additional load (estimate +$50–100/mo)
- (Optional) Sign up for Recraft V3 or Ideogram via API if higher-quality typography on thumbnails is needed

1. Add Studio entry point to the parent dashboard:
   - New top-level nav option: "Studio" alongside existing "Arena"
   - Route: `/parent-dashboard/kids/[kidId]/studio`
   - Empty state with the planned tools listed; thumbnail generator marked "Available"

2. Create `src/app/parent-dashboard/kids/[kidId]/studio/thumbnails/new/page.tsx` — thumbnail creation form:
   - Video description (textarea, max 300 chars)
   - Channel niche (select from kid's profile defaults: cars / gaming / anime / sports / general)
   - Title text (50 chars max, shown on thumbnail)
   - Style preset (bright/energetic, mysterious, comedic, professional)
   - Optionally upload a reference image (e.g., the kid's face for inclusion)

3. Server action `generateThumbnails(formData)`:
   - Validate with zod
   - Run video description + title through moderation
   - Generate 8 thumbnail variants using Flux Pro (better text rendering than Schnell):
     - Prompt template includes niche, style preset, title text overlay
     - Parallel API calls for speed
   - Save thumbnail set to DB (new `ThumbnailSet` and `Thumbnail` models)
   - Display tournament-style grid for kid to pick favorite

4. Thumbnail set detail page:
   - Grid of 8 thumbnails
   - Tap to enlarge
   - "Pick this one" → marks selected + offers download (PNG/JPG, exact YouTube dimensions 1280×720)
   - "Generate more" option (counts against weekly quota)

5. Per-kid rate limit: 5 thumbnail sets per week on free tier; unlimited on premium.

6. Update parent dashboard's main view to show Studio activity (thumbnails generated this week).

Test full flow with Vihaan as primary user: select a real recent Dubai Car Spotter upload, generate thumbnails for it, compare to the one he actually used. Document the gap.

Stop, summarize, wait for human approval.

---

## SESSION 8 — Studio: Script Writer

**Goal:** generate scripts for kid creators in their niche and voice.

1. Add `/parent-dashboard/kids/[kidId]/studio/scripts/new/page.tsx`:
   - Niche selector (defaults from kid profile)
   - Video topic (textarea, max 500 chars)
   - Target length (30 sec / 60 sec / 2 min / custom)
   - Tone (excited / educational / funny / calm explainer)
   - "Match my style" toggle (uses past scripts from this kid as voice reference if any exist)

2. Server action `generateScript(formData)`:
   - Validate + moderate inputs
   - Use Claude with a system prompt tuned for kid creator scripts:
     - "Generate a video script for a [age range] kid creator in the [niche] niche. Tone: [tone]. Target length: [length]. Topic: [topic]. Include: hook (first 3 sec), main content, payoff/CTA. Output as JSON: {hook, sections[], outro, estimatedDuration}. Keep language at a [age range] reading level."
   - Save Script to DB
   - Display in editable format (kid can rewrite sections inline)

3. Script library page: `/parent-dashboard/kids/[kidId]/studio/scripts` — list of all scripts for this kid, filterable by niche.

4. Export options:
   - Plain text copy
   - Teleprompter mode (large text, scrollable, pace-controlled)
   - Send to Shorts editor (when Session 10 ships)

5. Rate limit: 10 scripts per week free tier.

Stop, summarize, wait for approval.

---

## SESSION 9 — Studio: B-roll Generator/Fetcher

**Goal:** kid types a description; gets royalty-free or AI-generated footage.

1. Add `/parent-dashboard/kids/[kidId]/studio/broll/new/page.tsx`:
   - Description ("3 seconds of a red Ferrari accelerating", "drone shot of Dubai skyline at sunset")
   - Duration (1s / 3s / 5s / 10s)
   - Source preference: AI-generated, royalty-free stock, or "best available"

2. Server action `generateBroll(formData)`:
   - Validate + moderate
   - For stock: query Pexels API (free) or Pixabay (free) — return top matches
   - For AI-generated: use Replicate's video model (Veo, Runway Gen-3, or LTX-Video depending on availability/cost)
   - Save B-roll asset to R2 storage; save metadata to DB
   - Display all matches; kid picks favorite

3. B-roll library page (saved clips for reuse)

4. Rate limit: 5 AI-generated clips per week free; unlimited stock.

5. Cost monitoring: video gen is expensive ($0.10–$1 per clip depending on model). Add per-kid daily caps independent of weekly free-tier limits.

Stop, summarize, wait for approval.

---

## SESSION 10 — Studio: Shorts Auto-Editor

**Goal:** kid uploads raw footage; AI suggests an edit; outputs a publishable short.

This is the most complex session. Likely needs to be split across two work sessions if it gets too large — Claude Code should flag if so.

1. Video upload + processing pipeline:
   - Direct upload to R2 (presigned URLs)
   - Process via FFmpeg in a serverless function or queue worker
   - Generate thumbnails of every ~2-second segment for AI to "see"
   - Extract audio for AI transcription (via Whisper API or Deepgram)

2. AI editing logic (use Claude as the editor):
   - Feed scene thumbnails + transcript chunks to Claude
   - Claude returns suggested cut list: `[{startTime, endTime, reason}]`
   - Apply cuts via FFmpeg server-side
   - Add captions (from transcript) with style preset
   - Suggest music from a curated royalty-free library
   - Output: 30–60s short, 9:16 vertical, ready to publish

3. Editor UI:
   - Timeline view with AI-suggested cuts highlighted
   - Kid can accept/reject each cut
   - Music selector (preview, pick)
   - Caption style picker (font, color, position)
   - Preview before export

4. Export to MP4 + 9:16 thumbnail.

5. Rate limit: 3 shorts edits per week free.

6. Cost watch: this is the most expensive Studio feature. Per-edit cost likely $0.50–$2 in compute + AI. Set hard per-kid daily cap.

If complexity blows the session, split into 10a (upload + transcription + AI cut suggestion) and 10b (FFmpeg apply + caption + export).

Stop, summarize, wait for approval.

---

## SESSION 11 — Studio: Voice Generation + Publishing + Polish

**Goal:** voice cloning for narration, direct publish to YouTube/TikTok/Instagram, V1.5 polish.

**Pre-work the human will do:**
- Sign up for ElevenLabs (voice cloning API)
- Add `ELEVENLABS_API_KEY` to .env.local and Vercel
- Apply for YouTube, TikTok, and Instagram API access (these take 1–2 weeks; start early)

1. Voice samples + cloning:
   - Voice consent flow: parent must explicitly approve voice cloning for their kid (separate from general account consent — COPPA-conscious)
   - Recording UI: 3 minutes of sample audio (read provided script)
   - Voice authentication: re-record a phrase to verify it's the same person
   - Submit to ElevenLabs for voice clone training
   - Save voice profile ID to Kid model

2. Voice usage:
   - In script writer: "Generate audio" button reads script in kid's cloned voice
   - In Shorts editor: replace original audio with cloned narration (kid's choice)

3. One-click publish:
   - YouTube Shorts: OAuth flow, upload Shorts directly with title + description + thumbnail
   - TikTok: same pattern via TikTok for Developers
   - Instagram Reels: same via Instagram Graph API
   - Always include "Made with Polytrade Studio" in description as soft viral mechanic

4. Studio dashboard:
   - Total content shipped this week
   - Spark coins earned from Studio (via per-publish bonus + view-based rewards)
   - Best-performing thumbnail / script / clip
   - Vihaan-style real-creator metrics

5. V1.5 polish across both Arena and Studio:
   - Unified earning dashboard (Arena + Studio Spark in one view)
   - Cross-promote: in Arena character detail, link to "Make a video about this character" (sends to Studio); in Studio detail, link to "Make a character for this video" (sends to Arena)
   - Onboarding flow: new parent picks "creator-focused" (Studio first) or "play-focused" (Arena first); both modules visible regardless

Stop, summarize. V1.5 ships.

---

## After Session 11: Phase C (public launch readiness)

If V1.5 validates with Vihaan + alpha cohort, move to Phase C per brief:
- SuperAwesome kWS for full COPPA/GDPR-K compliance
- Domain registration
- Legal review of ToS/Privacy
- Brand identity contractor
- Public beta launch

---

## Execution rules (apply to every session)

1. **Re-read `CLAUDE.md` and `docs/brief.md`** if context feels missing or stale.
2. **Use server actions over API routes** in the App Router. Use `'use server'` and pass via form action or button.
3. **Validate every input with zod.** Inputs from the client are never trusted.
4. **Every AI generation passes moderation** before storage and before display. No exceptions.
5. **Use Prisma client singleton** from `src/lib/db.ts`. Don't instantiate new clients.
6. **Commit at the end of each session** with meaningful messages. Push to GitHub.
7. **Test on yourself** (`pnpm dev`, simulate the flow) before claiming "done."
8. **If the brief or CLAUDE.md doesn't cover a decision**, pause and ask the human. Don't assume — flag it.
9. **If a task seems too large for one session**, say so and split it.
10. **Stop after EACH session.** Summarize what changed, what decisions were made, what's deferred. Wait for human approval before proceeding to the next session.

---

## Open questions still unresolved (defer until they block work)

- Final visual style direction for character generation (anime / realistic / pixel / mixed) — Q8 from brief §14. Start with letting kids choose per character; revisit if generation quality varies too much.
- Voice characters — defer to V1.5 per brief §6.
- Subscription pricing test ($5 vs $7 vs $10) — defer until post-alpha; alpha is free.
- Domain registration — defer; use Vercel subdomain for alpha.

---

## How to use this plan

When starting a Claude Code session, the first prompt to give should reference this file:

```
Read CLAUDE.md, docs/brief.md, and docs/build-plan.md.

Execute Session [N] from build-plan.md. Follow all execution rules at the bottom of the plan. Stop at the end of the session, summarize what changed, and wait for my approval before proceeding.
```

Replace `[N]` with the session number (1, 2, 3, 4, or 5).

---

**End of build plan.**
