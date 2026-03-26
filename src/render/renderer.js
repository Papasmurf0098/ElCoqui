import { VIEWPORT } from "../core/constants.js";

export class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.resize();
    window.addEventListener("resize", () => this.resize());
  }

  resize() {
    const ratio = window.devicePixelRatio || 1;
    this.canvas.width = Math.floor(VIEWPORT.width * ratio);
    this.canvas.height = Math.floor(VIEWPORT.height * ratio);
    this.ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  }

  draw(scene) {
    const { ctx } = this;
    const { camera, level, player, hud } = scene;

    ctx.clearRect(0, 0, VIEWPORT.width, VIEWPORT.height);
    this.drawBackdrop(ctx, camera, level.world.width);

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    level.activeSolids.forEach((tile) => this.roundRect(ctx, tile, "#2a7a66"));
    level.hiddenBridges.filter((b) => !b.revealed).forEach((bridge) => {
      this.roundRect(ctx, bridge, "rgba(120,220,195,0.15)", true);
    });

    level.collectibles.filter((i) => !i.collected).forEach((item) => {
      this.roundRect(ctx, item, "#ffe17d");
    });

    this.roundRect(ctx, level.checkpoint, level.checkpoint.activated ? "#52f7c5" : "#3fa0a4");
    this.roundRect(ctx, level.goal, "#ffd9a4");
    level.enemies.forEach((enemy) => this.roundRect(ctx, enemy, "#8a4368"));
    this.drawPlayer(ctx, player);

    ctx.restore();

    hud.textContent = `Relics ${scene.collectedCount}/${scene.totalCollectibles} • Checkpoint ${
      level.checkpoint.activated ? "Active" : "Hidden"
    }`;
  }

  drawBackdrop(ctx, camera, worldWidth) {
    ctx.fillStyle = "#93dff0";
    ctx.fillRect(0, 0, VIEWPORT.width, VIEWPORT.height);

    const farX = (camera.x / worldWidth) * 120;
    ctx.fillStyle = "#80c9c1";
    ctx.beginPath();
    ctx.ellipse(220 - farX, 450, 340, 130, 0, 0, Math.PI * 2);
    ctx.ellipse(640 - farX, 430, 390, 120, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#5da7b6";
    ctx.fillRect(500 - farX * 1.6, 70, 80, 330);
    ctx.fillStyle = "rgba(198,244,255,0.6)";
    ctx.fillRect(525 - farX * 1.6, 70, 28, 330);

    ctx.fillStyle = "#4b9e7a";
    for (let i = 0; i < 5; i += 1) {
      ctx.beginPath();
      const x = i * 260 - (camera.x * 0.35) % 260;
      ctx.arc(x + 120, 520, 90, Math.PI, Math.PI * 2);
      ctx.fill();
    }
  }

  drawPlayer(ctx, p) {
    const body = { x: p.x, y: p.y, w: p.w, h: p.h };
    this.roundRect(ctx, body, "#58df9c");

    ctx.fillStyle = "#f7fff6";
    ctx.beginPath();
    ctx.arc(p.x + p.w * 0.32, p.y + 14, 6, 0, Math.PI * 2);
    ctx.arc(p.x + p.w * 0.68, p.y + 14, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#163329";
    ctx.beginPath();
    ctx.arc(p.x + p.w * 0.32, p.y + 14, 2, 0, Math.PI * 2);
    ctx.arc(p.x + p.w * 0.68, p.y + 14, 2, 0, Math.PI * 2);
    ctx.fill();

    if (p.chirpFlash > 0) {
      ctx.strokeStyle = "rgba(233,255,206,0.75)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(p.x + p.w * 0.5, p.y + p.h * 0.45, 24 + p.chirpFlash * 40, 0, Math.PI * 2);
      ctx.stroke();
    }
  }

  roundRect(ctx, rect, fill, dashed = false) {
    const r = 8;
    ctx.save();
    if (dashed) ctx.setLineDash([8, 8]);
    ctx.fillStyle = fill;
    ctx.beginPath();
    ctx.moveTo(rect.x + r, rect.y);
    ctx.arcTo(rect.x + rect.w, rect.y, rect.x + rect.w, rect.y + rect.h, r);
    ctx.arcTo(rect.x + rect.w, rect.y + rect.h, rect.x, rect.y + rect.h, r);
    ctx.arcTo(rect.x, rect.y + rect.h, rect.x, rect.y, r);
    ctx.arcTo(rect.x, rect.y, rect.x + rect.w, rect.y, r);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}
