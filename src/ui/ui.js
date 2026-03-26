export class UI {
  constructor() {
    this.hud = document.getElementById("hud");
    this.introCard = document.getElementById("introCard");
    this.titleScreen = document.getElementById("titleScreen");
    this.startButton = document.getElementById("startButton");
  }

  onStart(cb) {
    this.startButton.addEventListener("click", () => {
      this.titleScreen.style.display = "none";
      cb();
    });
  }

  showIntro(message, duration = 2600) {
    this.introCard.textContent = message;
    this.introCard.classList.add("visible");
    clearTimeout(this.introTimeout);
    this.introTimeout = setTimeout(() => this.introCard.classList.remove("visible"), duration);
  }
}
