export class InputSystem {
  constructor(target) {
    this.target = target;
    this.down = new Set();
    this.pressed = new Set();
    this.actions = {
      left: ["ArrowLeft", "KeyA"],
      right: ["ArrowRight", "KeyD"],
      jump: ["Space", "KeyW", "ArrowUp"],
      chirp: ["KeyC", "KeyE"],
    };
  }

  attachMobileControls(element) {
    const map = new Map();
    this.pointerActions = new Map();
    element.querySelectorAll("button[data-action]").forEach((button) => {
      const action = button.dataset.action;
      const start = (event) => {
        event.preventDefault();
        button.setPointerCapture?.(event.pointerId);
        this.pointerActions.set(event.pointerId, action);
        this.down.add(action);
        this.pressed.add(action);
      };
      const end = (event) => {
        event.preventDefault();
        const pointerAction = this.pointerActions.get(event.pointerId) || action;
        this.pointerActions.delete(event.pointerId);
        this.down.delete(pointerAction);
      };
      button.addEventListener("pointerdown", start);
      button.addEventListener("pointerup", end);
      button.addEventListener("pointercancel", end);
      button.addEventListener("pointerleave", end);
      map.set(button, { start, end });
    });
    this.releaseAllPointers = () => {
      this.pointerActions.clear();
      this.down.delete("left");
      this.down.delete("right");
      this.down.delete("jump");
      this.down.delete("chirp");
    };
    window.addEventListener("pointerup", this.releaseAllPointers);
    window.addEventListener("pointercancel", this.releaseAllPointers);
    window.addEventListener("blur", this.releaseAllPointers);
    this.mobileListeners = map;
  }

  start() {
    this.keyDown = (event) => {
      const action = this.getAction(event.code);
      if (!action) return;
      event.preventDefault();
      if (!this.down.has(action)) this.pressed.add(action);
      this.down.add(action);
    };
    this.keyUp = (event) => {
      const action = this.getAction(event.code);
      if (!action) return;
      event.preventDefault();
      this.down.delete(action);
    };
    this.target.addEventListener("keydown", this.keyDown);
    this.target.addEventListener("keyup", this.keyUp);
  }

  endFrame() {
    this.pressed.clear();
  }

  isDown(action) {
    return this.down.has(action);
  }

  wasPressed(action) {
    return this.pressed.has(action);
  }

  getAction(code) {
    return Object.keys(this.actions).find((key) => this.actions[key].includes(code));
  }
}
