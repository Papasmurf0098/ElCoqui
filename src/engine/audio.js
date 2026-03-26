export class AudioSystem {
  constructor() {
    this.ctx = null;
  }

  ensure() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") this.ctx.resume();
  }

  beep(type, freqStart, freqEnd, length = 0.12, volume = 0.06) {
    this.ensure();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freqStart, now);
    osc.frequency.exponentialRampToValueAtTime(Math.max(40, freqEnd), now + length);
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(volume, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + length);
    osc.connect(gain).connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + length + 0.02);
  }

  chirp() {
    this.beep("triangle", 1300, 2100, 0.09, 0.08);
    setTimeout(() => this.beep("triangle", 980, 1600, 0.08, 0.07), 70);
  }

  jump() {
    this.beep("square", 340, 220, 0.07, 0.045);
  }

  collect() {
    this.beep("sine", 520, 760, 0.08, 0.055);
  }

  checkpoint() {
    this.beep("triangle", 390, 710, 0.14, 0.06);
  }

  complete() {
    this.beep("triangle", 430, 980, 0.2, 0.075);
  }
}
