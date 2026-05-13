# Polytrade Kids AI Arena — Product Brief

| Field | Value |
|---|---|
| **Mother Brand** | Polytrade |
| **Product** | Kids AI Arena |
| **Working name** | Polytrade Kids AI Arena (short: Arena) |
| **Version** | 0.1 (Draft) |
| **Owner** | Founder |
| **Status** | Locked direction; ready to build |
| **Last updated** | May 2026 |

---

## 1. TL;DR

Polytrade Kids AI Arena is a mobile-first creative platform where kids (ages 8–14) design AI-powered characters, deploy them into an evolving arena where they perform, battle, and interact, and earn money as their creations gain popularity. It combines the character-creation impulse of Roblox, the dialogue intelligence of Character.AI, the social mechanics of TikTok, and the creator-earning model of YouTube — built specifically for the next generation of kid creators with AI-native tools that didn't exist when Roblox was built. Solo-buildable MVP in 12 weeks. Web/PWA first, native mobile in V2. Distribution organic via YouTube + school friend networks. Monetization through freemium + cosmetics + creator marketplace fees.

This is the first product launched under the Polytrade mother brand (post the marketplace shutdown). Beacon and other future products will follow.

---

## 2. Vision & Positioning

### 2.1 The opportunity

Kids today are creators, not just consumers. They run YouTube channels, design Roblox games, edit TikToks, and build characters in Minecraft. The tools they use weren't designed for them — Premiere is too complex, CapCut doesn't help with creativity, Roblox Studio is a steep learning curve, Character.AI has no kid safety. There's a real gap for **AI-native creative tools designed specifically for kid creators, with monetization built in from day one.**

The kids who use this product aren't a niche audience. Roblox has 80M+ daily active users, mostly under 16. Minecraft has 200M+ active players. The Gen Alpha cohort (born 2010+) is the first generation that never knew a world without smartphones; they treat creation tools the way previous generations treated TV.

### 2.2 Positioning statement

> *Polytrade Kids AI Arena is where kids build AI characters, watch them perform, and earn money when others love what they create. Built safe by parents, designed for kids who already create.*

### 2.3 What this is NOT

- Not a game (it's a platform where characters live and earn)
- Not just a character creator (creation is the entry point, not the product)
- Not a kids' YouTube clone (creators here own and earn from AI characters, not videos)
- Not a Roblox competitor (we ride alongside platforms like Roblox, eventually exporting to them)
- Not adult content adjacent (PG-13 ceiling, no romantic/sexual character types)

### 2.4 The defensible position

Roblox and Minecraft are walled gardens with high barriers to creation. Character.AI has the dialogue layer but no monetization. CapCut is editing-only. **Nobody has built the "AI character economy for kids" yet** because it requires three things to converge: cheap LLM/image generation (now possible), kid-safe content moderation infrastructure (now mature via SuperAwesome / kWS), and a generation of kids who already create natively (now arrived).

---

## 3. The User

### 3.1 Primary user: Kid Creator (ages 8–14)

**Profile:**
- Already creates content on YouTube, TikTok, Roblox, Minecraft, or similar
- Spends 2+ hours daily on creative platforms (not just consumption)
- Has favorite characters from games/anime/cartoons they want to remix
- Wants to be seen, recognized, sometimes earn
- Phone-first (may not own a laptop)
- Comfortable with AI tools (has used ChatGPT/Snapchat AI)

**Friction points the product solves:**
- Character creation in Roblox/Minecraft is technical and slow → AI generates in seconds
- They have ideas faster than tools allow → AI catches up to their imagination
- No way to monetize creativity at their age → built-in earning mechanics with parent gating
- Audience-building is hard from zero → arena mechanics give every character exposure
- Existing platforms don't reward creativity directly → here, popular characters earn

**Behavior signals from real observation:**
- Elder kid (Dubai Car Spotter): runs niche YouTube channel, edits all day, picks specific creative niches
- Younger kid: wants to design game characters, drawn to creation > consumption
- Both spend daily time creating, not just watching

### 3.2 Secondary user: Parent

**Profile:**
- Wants kid to do something more creative than scrolling shorts
- Worried about screen time, content safety, AI exposure
- Willing to pay for tools that channel creativity productively
- Wants visibility into what kid is doing without being intrusive

**What parents need from us:**
- Clear safety controls (content moderation, time limits, communication restrictions)
- Visibility dashboard (what kid is creating, who they're interacting with)
- Earnings management (any money kid makes goes through parent-approved account)
- Reasonable subscription pricing ($5–15/mo range)

### 3.3 Tertiary user: Audience kids

Other kids who don't create but love discovering and interacting with characters made by their friends and favorite creators. These users drive the network effect — they're the audience that makes creators' work valuable.

---

## 4. Product Concept

### 4.1 The core loop

```
CREATE  →  DEPLOY  →  PERFORM  →  EARN/GROW  →  CREATE MORE
  ↑                                                  ↓
  └──────────────────────────────────────────────────┘
```

**1. Create** — Kid designs an AI character. Inputs a name, a vibe, abilities, personality traits, visual style. AI generates the character (visual + dialogue model + arena stats).

**2. Deploy** — Character enters the Arena. Different arena modes: battle, talk-show, performance challenge, creative duel.

**3. Perform** — Character interacts with other characters and players. Wins/loses interactions. Gathers fans.

**4. Earn/Grow** — Popular characters earn the creator coins/rewards. Top characters get featured. Creator can level up character with earnings.

**5. Create more** — Kid uses earnings to create more characters or upgrade existing ones. Compounding engagement.

### 4.2 The Arena modes

The Arena isn't one thing — it's several environments characters can enter:

- **Battle Arena** — characters face off in turn-based competitions (stats + dialogue + creative response)
- **Talk Show** — characters interview each other or famous AI personalities; audience kids vote
- **Creative Duel** — characters face creative challenges (write a song, tell a joke, solve a riddle); judged by AI + community
- **Story Mode** — characters live in evolving worlds and write their own stories
- **Open Hangout** — characters chat freely in shared spaces (heavily moderated)

Each arena mode rewards different character traits — strength characters win battles, wit characters win talk shows. Encourages creators to design diverse characters.

### 4.3 The earning mechanic

Creators earn **Spark coins** when:
- Their characters perform well in arena (win battles, top talk shows)
- Other kids "favorite" or interact heavily with their characters
- Their characters get featured on daily/weekly leaderboards
- Other creators "remix" or build derivative characters from theirs

Spark coins convert to real money via parent-approved cashout (above a threshold, like $20).

This isn't a gambling mechanic — it's a creator royalty mechanic. Popular content earns. Same as YouTube AdSense, just designed for kid creators with parent gating.

---

## 5. MVP Scope (V1 — 12 weeks)

### 5.1 What ships in V1

**Character Creation:**
- Visual generation (text-to-image via Flux / SDXL)
- Personality designer (5–10 trait sliders + free-text vibe description)
- Voice selection (3–5 voice options via ElevenLabs or similar)
- Stats: power, wit, charm, mystery (used in arena modes)

**Arena (V1 = two modes only):**
- **Battle Arena** — turn-based 1v1, AI judges based on character stats + dialogue
- **Talk Show** — character pairs interview each other; audience emoji reactions

**Social:**
- Profile pages for each creator
- Character cards (shareable to social media)
- Friend/follow system
- Like / favorite mechanics
- Daily leaderboard (top 10 characters by interactions)

**Parent Dashboard:**
- Time limits (per day, per session)
- Content visibility (see kid's characters, interactions)
- Communication controls (no DMs in V1, only public arena)
- Earnings management (kid earnings flow into parent-approved account, threshold-based payout)

**Monetization (V1):**
- Free tier: 3 character creations per week, 1 active character at a time
- Premium ($7/mo): unlimited creations, 5 active characters, premium voices, exclusive trait packs
- One in-app cosmetic store (basic skins, accessories)
- No marketplace yet (V2)

**Tech (V1):**
- Web/PWA only (works on phones via browser, install to homescreen)
- No native iOS/Android apps yet (V2)

### 5.2 What is explicitly NOT in V1

- Native mobile apps (PWA only)
- Voice chat between characters (text only)
- Image upload (AI-generated only — safer)
- Direct messaging between users
- Character marketplace (creator-to-creator trading) — V2
- Cross-platform export (Roblox/Minecraft) — V2
- Real-time multiplayer arenas — V2
- User-generated arena modes — V2
- Live streaming of arena events — V2
- Spark coins → real money cashout — start with virtual only, real cashout in V1.5

---

## 6. Roadmap

### V1 (Weeks 1–12) — Functional MVP (Arena module)
Per §5. Web/PWA. Character creation + 2 arena modes + parent dashboard. Subscription monetization only.

### V1.5 (Weeks 13–24) — Studio module + earning loops

Two distinct workstreams ship in V1.5:

**(a) Arena retention + earning** (continuation of V1):
- Spark coin → real money cashout (parent-approved)
- Character marketplace (kids trade/sell characters to other kids; creator earns royalty)
- Two more arena modes (Creative Duel + Story Mode)
- Daily/weekly featured creator program

**(b) Studio — AI creator tools for kid content creators** ⭐ first-class module, not a feature add
The Studio module serves kid creators making real content (videos, shorts, thumbnails) for YouTube/TikTok/Instagram. Same user, same parent dashboard, same earnings system as Arena — different surface.

Founder-validated user: Vihaan and the millions of kid creators like him already running niche channels.

V1.5 Studio features:
- **Thumbnail generator** — describe the video; AI generates 5–10 thumbnail variants with title text, character expressions, on-trend styling
- **Script writer** — pick a niche (cars / gaming / anime / sports / etc.) + topic + tone (excited / educational / funny); AI returns a 30s–2min script
- **B-roll fetcher / generator** — "I need 3 seconds of a Lamborghini revving" → royalty-free footage retrieved or AI-generated. Critical for niche creators who can't film every subject themselves.
- **Shorts auto-editor** — kid uploads long-form footage or selects scenes; AI suggests cuts, captions, transitions, music for a 30–60s short ready for upload
- **Voice generation** — kid records voice samples (with parent consent + voice authentication); AI clones for narration. Especially valuable during puberty when kids hate their natural voice.
- **One-click publish** — direct to YouTube Shorts, TikTok, Instagram Reels via OAuth. Always includes "Made with Polytrade Studio" attribution as a soft viral mechanic.

Both Arena and Studio plug into the same earnings system (Spark coins). A creator who's good at both compounds earnings faster.

### V1.5 native iOS
Ships alongside V1.5 modules. Web/PWA stays the primary surface; native iOS adds offline capability + push notifications.

### V2 (Months 7–14) — Platform expansion
- Native Android app
- Cross-platform export: Roblox character export, Minecraft skin generation
- Voice characters in Arena (use Studio's voice infrastructure for in-character speech)
- Creator analytics dashboard (both Arena and Studio metrics in one view)
- Brand sponsorships marketplace (PG-rated, parent-approved)
- Open SDK for arena mode creation by sophisticated creators

### V3+ — Scale
- International expansion (multilingual)
- Educational integrations (teachers create classroom arenas + classroom Studio for school media projects)
- AR character viewer
- Hardware integrations (smart toy?)

---

## 6a. The two-module thesis

Polytrade Kids AI Arena is **one product, two modules** — not two products under one brand.

**Arena** = creative play with AI characters. The fictional world. Users design characters, deploy them in competitions, earn from popularity. Pure creative expression with AI-native mechanics.

**Studio** = real-world creator tools. The publishing world. Users make actual videos, thumbnails, scripts. The output goes to YouTube/TikTok/Instagram, where their existing audiences live.

The user is the same kid. The parent dashboard is the same. The earnings system is the same. The brand is the same.

Why this matters:
- Arena alone is creative play without external impact — risk of being seen as "just another kid app"
- Studio alone is editing tools without the social/competitive layer — risk of being commoditized by CapCut + better
- Together, they form an actual "creator platform for kids" — creative practice in Arena, real-world publishing via Studio, both feeding the same earnings flywheel

Vihaan running Dubai Car Spotter is the founder-validated proof: kid creators already exist, already produce, already want better tools. Studio is the module they need. Arena is the module that compounds engagement when they're not actively publishing.

Build sequence: Arena first (V1) for novelty + viral mechanics + validation. Studio second (V1.5) for retention + real-world utility + creator earnings. Together they're the platform.

---

## 7. Monetization Model

### 7.1 Revenue streams

| Stream | When | Pricing | Estimated contribution by V1.5 |
|---|---|---|---|
| **Subscription** (Premium) | V1 | $7/mo, $60/yr | 60% of revenue |
| **In-app cosmetics** | V1 | $0.99–$4.99 per item | 20% |
| **Character marketplace fee** | V1.5 | 15% of every kid-to-kid trade | 10% |
| **Sponsorship marketplace** | V2 | 20% of brand deals | 10% (V2) |
| **Spark coin sales** (kids/parents buy coins for upgrades) | V1.5 | $4.99 = 500 coins | included in cosmetics |

### 7.2 Unit economics target (V1.5)

- Average revenue per active kid: $4–8/month (mix of free + premium + cosmetics)
- Acquisition cost target: $0 (organic only in V1, paid only in V1.5+ if profitable)
- Churn target: <8%/month (kids are sticky on creator platforms)
- Path to profitability: 1,000 paying users = ~$5K MRR; 10K paying users = $50K MRR; achievable within 12 months if distribution works

### 7.3 The creator earning side

- Spark coins earned by creators are credited to parent-approved accounts
- Conversion rate: 1000 Spark coins = $1 (kept low to encourage circulation)
- Minimum payout: $20 (prevents micropayment friction)
- Parent receives notification on every payout
- Kid sees their earnings in-app but can only "spend" with parent approval

---

## 8. Distribution & Go-to-Market

### 8.1 The motion: organic-first, kid-driven

Kid platforms succeed when kids tell other kids. Paid acquisition is wasted on kids (they don't browse; they hear from friends). The motion is:

1. **Seed with hand-picked kid creators** — find 20–30 kid creators on YouTube/TikTok/Roblox who already make character content. Give them early access + premium free + featured status. Their existing audiences become first users.
2. **Make sharing irresistible** — every character is a one-tap-share to TikTok/Instagram with character name, creator handle, and "made on Polytrade Arena" attribution. Built-in viral mechanics.
3. **Focus on a niche first** — start with one specific creator vertical (e.g., car/vehicle character creators, given the Dubai Car Spotter angle), prove the model, then expand
4. **YouTube/TikTok content engine** — short clips of cool arena moments, character battles, creator spotlights. AI-generated, posted daily
5. **School friend networks** — once a few kids in a school are on, virality is automatic

### 8.2 Specific Tier 1 distribution channels (V1 launch)

- **Creator collaborations** — partner with 20+ kid YouTubers (under 1M subs but real audiences) for content + featured creator slots. Free for them, viral for us.
- **TikTok content engine** — daily AI-generated short clips of arena moments, character battles, "kids made these characters" content
- **Reddit communities** — r/Roblox, r/Minecraft, r/kidYouTubers, regional kid-creator subreddits
- **Discord servers** — popular kid-creator Discord servers (with permission); not spam, but presence
- **Parent Facebook groups** — homeschool parents, gifted-kid parents, screen-time-conscious parents (these communities drive parent-purchased subscriptions)

### 8.3 The "patient zero" advantage

The founder's elder son's YouTube channel (Dubai Car Spotter) is itself a launch surface. Featuring Polytrade Arena as a tool he uses, characters he's made, earnings he's earned — that's both authentic content and direct distribution. **The first creator on the platform should be the founder's own kid.**

### 8.4 What we explicitly don't do

- No paid ads to kids (illegal in many jurisdictions, ineffective everywhere)
- No celebrity endorsements (expensive, doesn't translate to retention)
- No app store featuring obsession (web/PWA bypasses this dependency in V1)
- No "growth hacking" through dark patterns (illegal with kids, terrible reputation)

---

## 9. Tech Architecture

### 9.1 Stack

**Frontend:**
- Next.js 15 (App Router) — web/PWA
- Tailwind CSS for styling
- Framer Motion for character animations
- shadcn/ui component library

**Backend:**
- Next.js API routes (serverless functions on Vercel)
- Postgres on Neon or Supabase
- Redis (Upstash) for arena real-time state
- S3 / R2 for character assets

**AI services:**
- **Character dialogue/personality:** Claude (Anthropic API) — best quality + safety for kid contexts
- **Character visual generation:** Flux 1.1 via Replicate or Modal (cost-effective, high quality)
- **Voice generation (V1.5):** ElevenLabs for kid-safe voice library
- **Content moderation:** OpenAI Moderation API + Claude for nuanced kid-safety review + manual queue for flags

**Auth + Compliance:**
- Clerk or Auth0 for user management
- SuperAwesome **kWS (Kids Web Services)** for COPPA/GDPR-K compliance — handles parent consent flow, age gating, kid-safe data handling
- Stripe for parent payment + subscription management
- Stripe Connect for kid earnings → parent accounts

**Infrastructure:**
- Vercel for frontend + serverless backend
- Neon for Postgres (serverless, scales to zero)
- Upstash Redis (serverless)
- Cloudflare R2 for storage (cheaper than S3)
- PostHog for analytics (privacy-conscious)
- Sentry for error monitoring

**Estimated infrastructure cost at MVP:** $50–150/month all-in. AI generation is the variable cost; budget $0.50–$2 per active user per month.

### 9.2 Architecture principles

- Web-first (PWA) — works on every phone via browser, no app store gating
- Serverless everything — scales to zero, pay only for usage
- AI generation is async — show animation/loading state, don't block UI
- Heavy content moderation pipeline — never display generated content without moderation pass
- Parent-first data model — every kid has a parent record, no orphaned kid accounts
- Auditable — every AI generation logged, every interaction stored, every payout traceable

### 9.3 The data model (sketch)

```
Parent
  ├── Kids (1..n)
  │   ├── Characters (1..n)
  │   │   ├── Visuals
  │   │   ├── Personality config
  │   │   ├── Stats
  │   │   ├── Arena history
  │   │   └── Earnings (Spark coins)
  │   ├── Interactions (with other characters)
  │   ├── Spark balance
  │   └── Settings (time limits, content prefs)
  ├── Subscription
  ├── Payment methods
  └── Earnings payout config (where kid earnings flow)

Arena
  ├── Mode (battle / talkshow / duel / story / hangout)
  ├── Participants (Characters)
  ├── Audience (Kids viewing)
  ├── Outcomes
  └── Engagement metrics

Marketplace (V1.5)
  ├── Listings (Characters for sale/trade)
  ├── Transactions
  └── Royalties
```

### 9.4 What we don't build ourselves

- AI inference (use API providers)
- Auth (Clerk/Auth0)
- Compliance (SuperAwesome kWS)
- Payments (Stripe + Stripe Connect)
- Analytics (PostHog)
- Hosting infra (Vercel/Neon/Upstash)

Everything that's not the core experience is bought.

---

## 10. Compliance & Safety

This is non-negotiable for kid products. Get it wrong = product dies + legal exposure.

### 10.1 Required compliance

- **COPPA** (US, ages under 13) — verifiable parental consent before any data collection
- **GDPR-K** (EU, ages under 16 typically) — same in spirit, stricter
- **App store policies** if/when native apps ship — Apple Family Sharing, Google Play Designed for Families
- **AI safety** — content moderation on every generation, both pre-display and post-display

### 10.2 The compliance stack

- **SuperAwesome kWS** — gold-standard kid compliance infrastructure used by Lego, Roblox, Hasbro. Handles parent consent, age gating, safe data flows. Subscription cost but saves months of legal/eng work.
- **Two-layer content moderation:**
  - Pre-display: OpenAI Moderation API + Claude prompt-based safety check on every generated character/dialogue
  - Post-display: Community reporting + manual review queue
- **No PII collection from kids** — no real names, no school info, no location beyond country
- **No image upload** in V1 (only AI-generated visuals) — eliminates major risk vector
- **No DMs** in V1 — all communication is public arena interaction only
- **No predatory mechanics** — no loot boxes, no real-money gambling, no manipulative spending pressure

### 10.3 Trust signals for parents

- Clear privacy policy in plain language
- Visible parent dashboard from day one
- Email digests of kid activity
- One-click pause/disable
- Public safety promises page
- Parent advisory program (10–20 parent advisors who review features pre-launch)

---

## 11. Success Metrics

### 11.1 V1 targets (90 days post-launch)

| Metric | Target | Why |
|---|---|---|
| Daily Active Kid Creators | 500 | Real engagement signal, not vanity |
| Characters created per week | 2,000 | Creation velocity = product is being used the right way |
| Premium subscribers | 100 | Early monetization signal |
| Average session length | 12+ min | Sticky engagement |
| 7-day retention | 40%+ | Habit formation |
| Parent NPS | 40+ | Trust signal |
| Daily organic shares to TikTok/IG | 50+ | Viral mechanics working |
| MRR | $500–1,000 | Real revenue, modest |

### 11.2 V1.5 targets (6 months post-launch)

| Metric | Target |
|---|---|
| Daily Active Kid Creators | 5,000 |
| Premium subscribers | 1,000 |
| MRR | $7,500–15,000 |
| Average creator earnings (top 10%) | $5–20/month |
| Marketplace transactions per week | 100+ |

### 11.3 V2 targets (12 months)

| Metric | Target |
|---|---|
| Daily Active Kid Creators | 25,000+ |
| Premium subscribers | 5,000+ |
| MRR | $40,000+ |
| Top creator earnings | $200+/month |

---

## 12. Risks

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| R1 | Compliance failure (COPPA / GDPR-K violation) | Low | Critical | Use SuperAwesome kWS from day one; no shortcuts on kid safety |
| R2 | Content moderation gaps (inappropriate AI generations slip through) | Medium | High | Two-layer moderation; small generation initially; community reporting; manual review queue |
| R3 | Parent backlash to AI-for-kids framing | Medium | Medium | Frame as "creative tool" not "AI companion"; emphasize parent controls; don't hype |
| R4 | App store rejection (when V1.5 launches native) | Low | Medium | PWA-first sidesteps this in V1; Apple/Google Designed for Families program for V1.5 |
| R5 | Roblox / Character.AI launches competing product | Medium | Medium | Move fast; build creator economy moat early (creators don't migrate) |
| R6 | AI generation costs spiral with usage | Medium | Medium | Hard caps per user; tier-based generation budgets; monitor unit economics weekly |
| R7 | Kids age out faster than acquired | Medium | Low | Wide age window (8–14); next-cohort always coming; brand can adapt |
| R8 | Solo founder bandwidth on consumer product (different from infra build) | High | Medium | Aggressive scope discipline (PWA not native; web not mobile; 2 modes not 5) |
| R9 | Distribution motion fails (kids don't share organically) | Medium | High | Have creator collab program ready week 1; founder's son as patient zero; ready paid plan if organic fails |
| R10 | Polytrade brand confusion (existing crypto holders see "kid product") | Medium | Low | Clear "Polytrade is a multi-product company; this is our consumer launch"; separate domain |

---

## 13. Team & Resourcing

### 13.1 V1 = Solo founder + selective help

- **Founder:** product, design, frontend, backend, copy, distribution
- **Contractor (part-time):** illustration/visual asset design ($2–5K/month)
- **Contractor (one-time):** Logo + brand identity ($2–5K)
- **Legal counsel (one-time):** ToS, privacy policy, COPPA compliance review ($3–8K)
- **Parent advisors (unpaid):** 10–20 parents who review features pre-launch

Total V1 budget excluding founder time: **$10–25K**.

### 13.2 V1.5 = solo + first contractor full-time

- iOS native app developer (3-month contract): $20–40K
- Continued visual design contractor

### 13.3 V2 = small team

- 1–2 engineering hires
- 1 community manager (kid creator relationships)
- Continued legal/compliance retainer

### 13.4 Tools/services budget

| Service | Cost |
|---|---|
| AI API (Claude + Flux + ElevenLabs) | $200–800/mo (scales with users) |
| SuperAwesome kWS | $300–500/mo |
| Vercel + Neon + Upstash + R2 | $50–150/mo |
| Stripe (% of revenue) | 2.9% + $0.30 per transaction |
| PostHog, Sentry, etc. | $50/mo |
| Total fixed | $600–1,500/mo at MVP |

---

## 14. Open Questions

| # | Question | Decision deadline |
|---|---|---|
| Q1 | Final product name (Polytrade Kids AI Arena vs shorter brand)? | Week 1 |
| Q2 | Domain: subdomain of polytrade.io or standalone (arena.fun, getarena.com, etc.)? | Week 1 |
| Q3 | First niche to seed (car characters? sports? anime-style? gaming? specific pop culture)? | Week 2 |
| Q4 | Voice in V1 or V1.5? | Week 2 |
| Q5 | Spark coin → cash conversion in V1 or V1.5? | Week 4 |
| Q6 | Geographic launch first (UAE/India/US/global)? | Week 2 |
| Q7 | Parent advisor program structure (compensated? equity? volunteer?)? | Week 4 |
| Q8 | Visual style direction for character generation (anime / realistic / pixel / mixed)? | Week 3 |
| Q9 | Kid creator early-access program structure (how to identify, invite, onboard)? | Week 6 |
| Q10 | Subscription pricing test ($5 vs $7 vs $10)? | Week 8 (test before launch) |

---

## 15. Sequencing & Timeline

Realistic 12-week timeline for solo founder using Claude Code + selective contractor help.

| Week | Milestone |
|---|---|
| 1 | Open questions resolved (especially name, domain, niche). Repo initialized with CLAUDE.md. SuperAwesome kWS account set up. Stripe + Clerk configured. Brand identity contractor engaged. |
| 2 | Schema + data model designed. Auth + parent/kid relationship working. Basic UI scaffolding. |
| 3 | Character creation V1: text input → AI generates visual + personality. Save to database. |
| 4 | Character display + profile pages. Sharing mechanic. |
| 5 | Arena mode 1 (Battle): two characters + AI judge → outcome. |
| 6 | Arena mode 2 (Talk Show): character interaction + audience reactions. |
| 7 | Friend/follow system. Daily leaderboard. Spark coin economy (virtual). |
| 8 | Parent dashboard: time limits, visibility, basic earnings view. |
| 9 | Subscription + payment integration (Stripe). Premium feature gating. |
| 10 | Content moderation pipeline (full pre/post-display). Community reporting. |
| 11 | Polish, performance, mobile UX optimization. Beta testing with 10–20 kid testers (recruited from founder network). |
| 12 | Public soft launch. Hand-picked creator program live. PR push begins. |

V1.5 work begins week 13 if launch holds. Full audit + iteration based on real user data.

---

## 16. The 90-day decision criteria

If by Day 90 post-launch we have:
- ≥ 500 daily active kid creators
- ≥ 100 paying subscribers
- ≥ 40% 7-day retention
- ≥ Parent NPS of 40

→ V1.5 is greenlit. Continue building.

If we miss 2+ of these significantly:
- Honest review of what's broken (acquisition? activation? retention? monetization?)
- Pivot if needed (different niche, different mechanic, different audience age)
- Don't sunk-cost-fallacy our way into a non-product

---

## 17. References

| Document | Purpose |
|---|---|
| `polytrade-brand-architecture.md` | Polytrade-as-mother-brand decision and product portfolio strategy |
| `CLAUDE-polytrade-kids-arena.md` | Conventions for the Kids Arena build repo |
| `polytrade-beacon-context.md` | Parked Beacon work (future product under same mother brand) |

---

**End of v0.1 brief.**
