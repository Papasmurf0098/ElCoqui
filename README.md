# El Coquí — Fresh Vertical Slice Rebuild

A mobile-first browser platformer prototype rebuilt from scratch with a clean, modular foundation.

## Run

Serve the repository with any static server, for example:

```bash
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

## Implemented vertical slice

- Bipedal coquí frog hero with responsive platforming controls.
- Rainforest/waterfall-inspired side-scrolling level.
- Coyote time + jump buffering.
- Chirp action that reveals hidden bridge paths.
- Collectibles, checkpoint, finish goal, and one simple patrol enemy.
- Mobile controls (left/right/jump/chirp) with safe-area aware layout.
- Lightweight browser audio cues (chirp, jump, pickup, checkpoint, finish).

## Architecture

```text
src/
  core/      constants + utils
  engine/    input, camera, audio
  entities/  player logic
  systems/   level simulation + collision + interaction events
  content/   data-driven level content
  scenes/    game scene + scene manager
  render/    stylized canvas rendering
  ui/        title/intro/hud wiring
```

This is intentionally one polished slice with clean seams for future levels and powers.
