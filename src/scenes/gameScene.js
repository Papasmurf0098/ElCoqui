import { VIEWPORT } from "../core/constants.js";
import { Camera } from "../engine/camera.js";
import { Player } from "../entities/player.js";
import { LevelSystem } from "../systems/levelSystem.js";

export class GameScene {
  constructor(levelData, audio, ui) {
    this.level = new LevelSystem(levelData);
    this.player = new Player(levelData.spawn);
    this.camera = new Camera(VIEWPORT.width, VIEWPORT.height);
    this.audio = audio;
    this.ui = ui;
    this.collectedCount = 0;
    this.totalCollectibles = this.level.collectibles.length;
    this.spawnPoint = { ...levelData.spawn };
    this.finished = false;
  }

  enter() {
    this.ui.showIntro(this.level.data.title);
  }

  update(dt, input) {
    if (this.finished) return;
    this.player.update(dt, input, this.level, this.audio);
    const events = this.level.updateEntities(this.player, this.audio);
    this.collectedCount += events.collectedNow;

    if (this.level.checkpoint.activated) {
      this.spawnPoint = {
        x: this.level.checkpoint.x,
        y: this.level.checkpoint.y - this.player.h,
      };
    }

    if (events.hitEnemy || this.player.y > this.level.world.height + 90) {
      this.player.respawn(this.spawnPoint);
    }

    if (events.reachedGoal && !this.finished) {
      this.finished = true;
      this.audio.complete();
      this.ui.showIntro("Sanctuary reached! The coquí song echoes through the shrine.", 4600);
    }

    this.camera.follow(this.player, this.level.world.width, this.level.world.height);
  }
}
