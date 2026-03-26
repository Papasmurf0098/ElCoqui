import { rectsOverlap } from "../core/utils.js";

export class LevelSystem {
  constructor(levelData) {
    this.data = structuredClone(levelData);
    this.world = { width: levelData.world.width, height: levelData.world.height };
    this.solids = [...levelData.solids, ...levelData.hiddenBridges.filter((b) => b.revealed)];
    this.hiddenBridges = levelData.hiddenBridges.map((bridge) => ({ ...bridge }));
    this.collectibles = levelData.collectibles.map((item) => ({ ...item, collected: false }));
    this.checkpoint = { ...levelData.checkpoint, activated: false };
    this.goal = { ...levelData.goal };
    this.enemies = levelData.enemies.map((e) => ({ ...e, dir: 1 }));
  }

  resetDynamic() {
    this.collectibles.forEach((item) => (item.collected = false));
    this.hiddenBridges.forEach((bridge) => (bridge.revealed = false));
    this.checkpoint.activated = false;
  }

  get activeSolids() {
    return [...this.data.solids, ...this.hiddenBridges.filter((b) => b.revealed)];
  }

  moveBody(body, dx, dy) {
    const result = { hitBottom: false, onGround: false };
    body.x += dx;
    for (const tile of this.activeSolids) {
      if (rectsOverlap(body, tile)) {
        if (dx > 0) body.x = tile.x - body.w;
        if (dx < 0) body.x = tile.x + tile.w;
      }
    }

    body.y += dy;
    for (const tile of this.activeSolids) {
      if (rectsOverlap(body, tile)) {
        if (dy > 0) {
          body.y = tile.y - body.h;
          result.hitBottom = true;
          result.onGround = true;
        }
        if (dy < 0) body.y = tile.y + tile.h;
      }
    }

    if (body.y + body.h >= this.world.height) {
      body.y = this.world.height - body.h;
      result.onGround = true;
      result.hitBottom = true;
    }
    return result;
  }

  activateChirp(player) {
    for (const bridge of this.hiddenBridges) {
      if (bridge.revealed) continue;
      const dx = bridge.x + bridge.w * 0.5 - (player.x + player.w * 0.5);
      const dy = bridge.y + bridge.h * 0.5 - (player.y + player.h * 0.5);
      if (Math.hypot(dx, dy) <= bridge.revealRadius) {
        bridge.revealed = true;
      }
    }
  }

  updateEntities(player, sounds) {
    let collectedNow = 0;
    for (const item of this.collectibles) {
      if (!item.collected && rectsOverlap(player, item)) {
        item.collected = true;
        collectedNow += 1;
        sounds.collect();
      }
    }

    if (!this.checkpoint.activated && rectsOverlap(player, this.checkpoint)) {
      this.checkpoint.activated = true;
      sounds.checkpoint();
    }

    let hitEnemy = false;
    for (const enemy of this.enemies) {
      enemy.x += enemy.speed * enemy.dir;
      if (enemy.x < enemy.minX || enemy.x > enemy.maxX) enemy.dir *= -1;
      if (rectsOverlap(player, enemy)) hitEnemy = true;
    }

    const reachedGoal = rectsOverlap(player, this.goal);
    return { collectedNow, hitEnemy, reachedGoal };
  }
}
