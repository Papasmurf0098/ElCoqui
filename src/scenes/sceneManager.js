export class SceneManager {
  set(scene) {
    this.current = scene;
    if (scene.enter) scene.enter();
  }

  update(dt, input) {
    if (this.current?.update) this.current.update(dt, input);
  }
}
