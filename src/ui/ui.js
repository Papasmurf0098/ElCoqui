export class UI {
  constructor() {
    this.introCard = document.getElementById("introCard");
    this.titleScreen = document.getElementById("titleScreen");
    this.startButton = document.getElementById("startButton");
    this.relicCountLeft = document.getElementById("relicCountLeft");
    this.relicCountMain = document.getElementById("relicCountMain");
    this.chirpHintState = document.getElementById("chirpHintState");
    this.levelName = document.getElementById("levelName");
    this.powerMode = document.getElementById("powerMode");
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

  setHud(state) {
    const relicText = `${state.collected}/${state.total}`;
    this.relicCountLeft.textContent = relicText;
    this.relicCountMain.textContent = relicText;
    this.levelName.textContent = state.levelName;
    this.powerMode.textContent = state.powerMode;
    this.chirpHintState.textContent = state.checkpointActive ? "Checkpoint active" : "Chirp to reveal paths";
  }
}
