# Polytrade Kids AI Arena

> A creative platform where kids (ages 8–14) build AI-powered characters, deploy them into evolving arenas where they perform and compete, and earn money as their creations gain popularity.

**Status:** 🟢 In active build (V1)

A product of [Polytrade](https://github.com/polytrade-org/polytrade), the multi-product company.

---

## What it is

Kids today are creators, not just consumers — they run YouTube channels, design Roblox games, edit TikToks, build characters in Minecraft. The tools they use weren't designed for them, and AI changes what's possible.

Kids AI Arena is the AI-native creator platform for the next generation:

- **Create** AI characters via text prompts (visual + personality + abilities)
- **Deploy** them into the Arena — battle, talk show, creative duel, story mode
- **Earn** as your characters gain popularity, get featured, win competitions
- **Trade** characters with friends (V1.5)
- **Export** to Roblox, Minecraft, Fortnite Creative (V2)

Built kid-safe from day one with parent dashboards, content moderation, COPPA/GDPR-K compliance.

---

## For parents

Every kid has a parent account. Parents control:
- Time limits (per day, per session)
- Content visibility (see everything kid creates and interacts with)
- Communication settings (no DMs in V1; only public arena)
- Earnings management (kid-earned money flows to parent-approved accounts above threshold)

Subscription pricing: $7/month or $60/year for premium features. Free tier available.

---

## Tech stack

- **Frontend:** Next.js 15 (PWA-first, mobile-mobile)
- **Database:** Postgres (Neon)
- **Real-time:** Upstash Redis
- **Storage:** Cloudflare R2
- **AI:** Claude (personality), Flux via Replicate (visuals), ElevenLabs (voice — V1.5)
- **Auth:** Clerk
- **Compliance:** SuperAwesome kWS (COPPA/GDPR-K)
- **Payments:** Stripe + Stripe Connect (parent-managed earnings)
- **Analytics:** PostHog
- **Errors:** Sentry

---

## Documentation

- [`docs/brief.md`](./docs/brief.md) — full product brief: positioning, mechanics, MVP scope, monetization, roadmap, risks, open questions
- `CLAUDE.md` — repo conventions for Claude Code development

---

## Setup

> *Setup instructions to be added as the build progresses.*

```bash
# Coming soon
pnpm install
pnpm dev
```

---

## Roadmap

- **V1 (Weeks 1–12):** PWA with character creation, 2 arena modes, parent dashboard, subscription monetization
- **V1.5 (Weeks 13–20):** Native iOS, character marketplace, Spark-coin cashout, 2 more arena modes
- **V2 (Months 6–12):** Cross-platform export (Roblox/Minecraft/Fortnite), voice characters, sponsorship marketplace

See `docs/brief.md` §6 for full roadmap.

---

## Contributing

> *Contribution guidelines will be added when the project is ready for external contributors.*

---

## License

> *To be determined. Likely a source-available license for now; may open-source specific components later.*

---

*Built by [Polytrade](https://github.com/polytrade-org/polytrade). Part of the Polytrade product portfolio.*
