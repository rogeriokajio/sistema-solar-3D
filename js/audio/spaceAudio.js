/**
 * Sintetizador Procedural de Áudio Espacial Ambiente (Web Audio API)
 * Não depende de arquivos MP3/WAV externos: gera um drone cósmico binaural
 * suave e efeitos sonoros sutis de telemetria para a interface HUD.
 */

export class SpaceAudioController {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.masterGain = null;
    this.oscillators = [];
  }

  initContext() {
    if (this.ctx) return;
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;

    this.ctx = new AudioCtx();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.0;
    this.masterGain.connect(this.ctx.destination);

    // Filtro passa-baixa para ambiência espacial profunda
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 260;
    filter.connect(this.masterGain);

    // Osciladores harmônicos binaurais (Acorde cósmico suspenso: D2, A2, E3)
    const freqs = [73.42, 73.85, 110.0, 146.83, 220.0];
    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = f;
      gain.gain.value = i < 2 ? 0.14 : 0.045;
      osc.connect(gain);
      gain.connect(filter);
      osc.start();
      this.oscillators.push(osc);
    });
  }

  toggle() {
    this.initContext();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setTargetAtTime(this.isMuted ? 0.0 : 0.35, now, 0.6);

    if (!this.isMuted) {
      this.playChime(528, 0.12);
    }
    return !this.isMuted;
  }

  playChime(freq = 660, duration = 0.09) {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.25, now + duration);

    gain.gain.setValueAtTime(0.06, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + duration);
  }
}

