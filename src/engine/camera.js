import { clamp } from "../core/utils.js";

export class Camera {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
  }

  follow(target, worldWidth, worldHeight) {
    const desiredX = target.x + target.w * 0.5 - this.width * 0.45;
    const desiredY = target.y + target.h * 0.5 - this.height * 0.55;
    this.x = clamp(desiredX, 0, Math.max(0, worldWidth - this.width));
    this.y = clamp(desiredY, 0, Math.max(0, worldHeight - this.height));
  }
}
