# `@funsociety/corepak`

Unified shared TypeScript + React component, service, and controller library linked across projects via `yalc` (modeled on `rivepak`).

## Modules

- `@funsociety/corepak/daily` — Shared Daily AI Support & Therapy components, hooks, types, and services (`aaforbaldmen.com`, `aazoomforbaldmen.com`, `felinetherapistforbaldmen.com`).
- `@funsociety/corepak/presence` — Real-time Soul Presence controller, ripples, hugs, globe pins, pledges, networking, and poem parser (`TheLoneliestDay`, `exponentialblissmanifesto.com`).
- `@funsociety/corepak/terminal` — Retro Matrix background, VectorSplash, WebAudio synth sound effects, and GA4 loader (`davegeurts`, `exponentialblissmanifesto.com`).
- `@funsociety/corepak/pilgrimage` — Shared CityStops, Milosport, CanyonDrive, SkiFree, BombHole, audio engine, and route utilities (`prayforsnowutah.com`, `prayfororangecounty.com`).

## Workflow

```bash
# Build & publish to local yalc store
npm run build && npx yalc publish

# Watch & auto-push changes to all linked projects
npm run dev:watch
```
