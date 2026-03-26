import { PHYSICS, PLAYER_SIZE } from "../core/constants.js";
import { clamp } from "../core/utils.js";

export class Player {
  constructor(spawn) {
    this.spawn = { ...spawn };
    this.x = spawn.x;
    this.y = spawn.y;
    this.w = PLAYER_SIZE.w;
    this.h = PLAYER_SIZE.h;
    this.vx = 0;
    this.vy = 0;
    this.facing = 1;
    this.onGround = false;
    this.coyoteLeft = 0;
    this.jumpBufferLeft = 0;
    this.chirpCooldown = 0;
    this.chirpFlash = 0;
  }

  respawn(point) {
    this.x = point.x;
    this.y = point.y;
    this.vx = 0;
    this.vy = 0;
  }

  update(dt, input, level, sounds) {
    const axis = (input.isDown("right") ? 1 : 0) - (input.isDown("left") ? 1 : 0);
    if (axis !== 0) this.facing = axis;

    const accel = this.onGround ? PHYSICS.accelGround : PHYSICS.accelAir;
    const target = axis * PHYSICS.moveSpeed;
    if (axis !== 0) {
      this.vx = this.approach(this.vx, target, accel * dt);
    } else {
      this.vx = this.approach(this.vx, 0, PHYSICS.friction * dt);
    }

    if (this.onGround) {
      this.coyoteLeft = PHYSICS.coyoteTime;
    } else {
      this.coyoteLeft -= dt;
    }

    if (input.wasPressed("jump")) {
      this.jumpBufferLeft = PHYSICS.jumpBuffer;
    } else {
      this.jumpBufferLeft -= dt;
    }

    if (this.jumpBufferLeft > 0 && this.coyoteLeft > 0) {
      this.vy = -PHYSICS.jumpVelocity;
      this.onGround = false;
      this.coyoteLeft = 0;
      this.jumpBufferLeft = 0;
      sounds.jump();
    }

    this.vy = clamp(this.vy + PHYSICS.gravity * dt, -2000, PHYSICS.maxFall);

    level.moveBody(this, this.vx * dt, 0);
    const landed = level.moveBody(this, 0, this.vy * dt);
    if (landed.hitBottom) this.vy = 0;
    this.onGround = landed.onGround;

    if (input.wasPressed("chirp") && this.chirpCooldown <= 0) {
      this.chirpCooldown = 0.55;
      this.chirpFlash = 0.22;
      sounds.chirp();
      level.activateChirp(this);
    }

    this.chirpCooldown -= dt;
    this.chirpFlash -= dt;
  }

  approach(value, target, delta) {
    if (value < target) return Math.min(target, value + delta);
    return Math.max(target, value - delta);
  }
}
