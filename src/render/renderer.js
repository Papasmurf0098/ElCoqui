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
    const { camera, level, player } = scene;

    ctx.clearRect(0, 0, VIEWPORT.width, VIEWPORT.height);
    this.drawBackdrop(ctx, camera, level.world.width);

    ctx.save();
    ctx.translate(-camera.x, -camera.y);

    level.activeSolids.forEach((tile) => this.drawGroundTile(ctx, tile));
    level.hiddenBridges.filter((b) => !b.revealed).forEach((bridge) => {
      this.roundRect(ctx, bridge, "rgba(120,220,195,0.18)", true);
    });

    level.collectibles.filter((i) => !i.collected).forEach((item) => {
      this.drawCoin(ctx, item);
    });

    this.roundRect(ctx, level.checkpoint, level.checkpoint.activated ? "#66edb7" : "#58aa8a");
    this.roundRect(ctx, level.goal, "#ffd9a4");
    level.enemies.forEach((enemy) => this.roundRect(ctx, enemy, "#8a4368"));
    this.drawPlayer(ctx, player);

    ctx.restore();
  }

  drawBackdrop(ctx, camera, worldWidth) {
    ctx.fillStyle = "#9ad7df";
    ctx.fillRect(0, 0, VIEWPORT.width, VIEWPORT.height);

    const farX = (camera.x / worldWidth) * 90;
    ctx.fillStyle = "rgba(190,225,216,0.45)";
    ctx.beginPath();
    ctx.ellipse(100 - farX * 0.4, 300, 220, 38, 0, 0, Math.PI * 2);
    ctx.ellipse(360 - farX * 0.35, 280, 190, 32, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#84bfb2";
    ctx.beginPath();
    ctx.moveTo(-20, 380);
    ctx.lineTo(160 - farX, 290);
    ctx.lineTo(300 - farX, 370);
    ctx.lineTo(470 - farX, 300);
    ctx.lineTo(640 - farX, 370);
    ctx.lineTo(820 - farX, 280);
    ctx.lineTo(980, 380);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#75b0a1";
    ctx.beginPath();
    ctx.moveTo(-20, 470);
    ctx.lineTo(260 - farX * 1.2, 350);
    ctx.lineTo(540 - farX * 1.25, 450);
    ctx.lineTo(880 - farX * 1.2, 350);
    ctx.lineTo(980, 470);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = "#4a966f";
    for (let i = 0; i < 8; i += 1) {
      ctx.beginPath();
      const x = i * 150 - (camera.x * 0.3) % 150;
      ctx.arc(x + 25, 180, 52, Math.PI, Math.PI * 2);
      ctx.arc(x + 80, 168, 46, Math.PI, Math.PI * 2);
      ctx.arc(x + 130, 182, 52, Math.PI, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = "rgba(104, 155, 139, 0.35)";
    ctx.lineWidth = 3;
    for (let i = 0; i < 6; i += 1) {
      const x = i * 170 - (camera.x * 0.18) % 170;
      ctx.beginPath();
      ctx.moveTo(x + 30, 20);
      ctx.lineTo(x + 40, 200);
      ctx.stroke();
    }
  }

  drawPlayer(ctx, p) {
    const centerX = p.x + p.w * 0.5;
    const facing = p.facing || 1;
    const blink = Math.sin(performance.now() * 0.006) > 0.98;
    const hop = Math.sin(performance.now() * 0.012 + p.x * 0.02) * 1.2;

    ctx.fillStyle = "#2f8f6d";
    ctx.beginPath();
    ctx.ellipse(p.x + p.w * 0.22, p.y + p.h * 0.78 + hop, 6, 10, 0.6, 0, Math.PI * 2);
    ctx.ellipse(p.x + p.w * 0.78, p.y + p.h * 0.78 + hop, 6, 10, -0.6, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#3cb985";
    ctx.beginPath();
    ctx.ellipse(centerX, p.y + p.h * 0.56 + hop, p.w * 0.4, p.h * 0.34, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#63e7a8";
    ctx.beginPath();
    ctx.ellipse(centerX, p.y + p.h * 0.35 + hop, p.w * 0.33, p.h * 0.28, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#dffbe9";
    ctx.beginPath();
    ctx.ellipse(centerX, p.y + p.h * 0.61 + hop, p.w * 0.18, p.h * 0.15, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#7af4bc";
    ctx.beginPath();
    ctx.arc(p.x + p.w * 0.3, p.y + 9 + hop, 7.2, 0, Math.PI * 2);
    ctx.arc(p.x + p.w * 0.7, p.y + 9 + hop, 7.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "#f7fff6";
    ctx.beginPath();
    ctx.arc(p.x + p.w * 0.32, p.y + 14 + hop, 5.2, 0, Math.PI * 2);
    ctx.arc(p.x + p.w * 0.68, p.y + 14 + hop, 5.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#163329";
    ctx.lineWidth = 1.8;
    if (blink) {
      ctx.beginPath();
      ctx.moveTo(p.x + p.w * 0.27, p.y + 14 + hop);
      ctx.lineTo(p.x + p.w * 0.37, p.y + 14 + hop);
      ctx.moveTo(p.x + p.w * 0.63, p.y + 14 + hop);
      ctx.lineTo(p.x + p.w * 0.73, p.y + 14 + hop);
      ctx.stroke();
    } else {
      ctx.fillStyle = "#163329";
      ctx.beginPath();
      ctx.arc(p.x + p.w * 0.32 + facing * 0.6, p.y + 14 + hop, 1.8, 0, Math.PI * 2);
      ctx.arc(p.x + p.w * 0.68 + facing * 0.6, p.y + 14 + hop, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.strokeStyle = "#20513f";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.arc(centerX + facing * 2, p.y + p.h * 0.49 + hop, 4, 0.2, Math.PI - 0.2);
    ctx.stroke();

    ctx.fillStyle = "#34a679";
    ctx.beginPath();
    ctx.ellipse(p.x + p.w * 0.18, p.y + p.h - 5 + hop, 7, 4.5, 0, 0, Math.PI * 2);
    ctx.ellipse(p.x + p.w * 0.82, p.y + p.h - 5 + hop, 7, 4.5, 0, 0, Math.PI * 2);
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

  drawGroundTile(ctx, tile) {
    const grassHeight = Math.min(14, tile.h * 0.28);
    this.roundRect(ctx, tile, "#8b562f");
    this.roundRect(ctx, { x: tile.x, y: tile.y, w: tile.w, h: grassHeight }, "#65bf68");
    ctx.fillStyle = "#6db16f";
    for (let i = 0; i < tile.w; i += 16) {
      ctx.fillRect(tile.x + i, tile.y + grassHeight - 4, 8, 4);
    }
  }

  drawCoin(ctx, item) {
    const cx = item.x + item.w * 0.5;
    const cy = item.y + item.h * 0.5;
    ctx.fillStyle = "#ffd56b";
    ctx.beginPath();
    ctx.arc(cx, cy, item.w * 0.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#d09018";
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}
