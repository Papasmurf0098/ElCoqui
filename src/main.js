import { VIEWPORT } from "./core/constants.js";
import { InputSystem } from "./engine/input.js";
import { AudioSystem } from "./engine/audio.js";
import { Renderer } from "./render/renderer.js";
import { levelRainforest } from "./content/levelRainforest.js";
import { GameScene } from "./scenes/gameScene.js";
import { SceneManager } from "./scenes/sceneManager.js";
import { UI } from "./ui/ui.js";

const canvas = document.getElementById("gameCanvas");
canvas.width = VIEWPORT.width;
canvas.height = VIEWPORT.height;

const renderer = new Renderer(canvas);
const input = new InputSystem(window);
const audio = new AudioSystem();
const ui = new UI();

input.start();
input.attachMobileControls(document.getElementById("mobileControls"));

const sceneManager = new SceneManager();
const scene = new GameScene(levelRainforest, audio, ui);
sceneManager.set(scene);

let started = false;
ui.onStart(() => {
  started = true;
  audio.ensure();
});

let last = performance.now();
function loop(now) {
  requestAnimationFrame(loop);
  const dt = Math.min(0.033, (now - last) / 1000);
  last = now;

  if (started) {
    sceneManager.update(dt, input);
  }

  renderer.draw(scene);
  input.endFrame();
}
requestAnimationFrame(loop);
