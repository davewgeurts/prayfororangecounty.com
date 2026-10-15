import {
  X96_STATION,
  RFH_FALLBACK_EPISODE,
  formatX96NowPlaying,
  type X96NowPlayingEvent
} from '../data/radioFromHell';

export type RadioStation = 'x96' | 'wasatch';
export type RadioSource = 'x96-live' | 'rfh-podcast' | 'wasatch-synth' | 'custom-track';

export interface RadioStatus {
  station: RadioStation;
  source: RadioSource;
  label: string;
  nowPlaying: string;
  playing: boolean;
}

const SYNTH_RADIO_GAIN = 0.12;
const STREAM_RADIO_VOLUME = 0.5;
const NOW_PLAYING_POLL_MS = 30000;

export class CanyonAudioEngine {
  private static instance: CanyonAudioEngine;
  private ctx: AudioContext | null = null;

  // Sound nodes
  private engineOsc: OscillatorNode | null = null;
  private engineGain: GainNode | null = null;
  private windGain: GainNode | null = null;
  private radioGain: GainNode | null = null;
  private radioMelodyTimer: number | null = null;
  private radioPlaying: boolean = true;
  private customAudio: HTMLAudioElement | null = null;
  private customAudioIsLive: boolean = false;
  private radioStation: RadioStation = 'x96';
  private radioSource: RadioSource = 'wasatch-synth';
  private radioStarted: boolean = false;
  private inSilentRock: boolean = false;
  private nowPlaying: string = '';
  private nowPlayingTimer: number | null = null;
  private nowPlayingGeneration: number = 0;
  private radioListeners = new Set<(status: RadioStatus) => void>();

  private constructor() {}

  public static get(): CanyonAudioEngine {
    if (!CanyonAudioEngine.instance) {
      CanyonAudioEngine.instance = new CanyonAudioEngine();
    }
    return CanyonAudioEngine.instance;
  }

  public init(): void {
    if (this.ctx) return;
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
      this.setupEngineSound();
      this.setupWindSound();
      this.setupRadioSynthesizer();
    } catch (e) {
      console.warn('AudioContext failed to initialize:', e);
    }
    // The stream is a plain <audio> element, so the radio still works without Web Audio
    if (!this.radioStarted) {
      this.radioStarted = true;
      this.tuneStation(this.radioStation);
    }
  }

  private setupEngineSound(): void {
    if (!this.ctx) return;
    this.engineOsc = this.ctx.createOscillator();
    this.engineGain = this.ctx.createGain();

    this.engineOsc.type = 'sawtooth';
    this.engineOsc.frequency.setValueAtTime(45, this.ctx.currentTime); // idle rumble

    const lowpass = this.ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.setValueAtTime(140, this.ctx.currentTime);

    this.engineGain.gain.setValueAtTime(0.08, this.ctx.currentTime);

    this.engineOsc.connect(lowpass);
    lowpass.connect(this.engineGain);
    this.engineGain.connect(this.ctx.destination);

    this.engineOsc.start();
  }

  private setupWindSound(): void {
    if (!this.ctx) return;
    // Procedural white noise buffer for Pacific Ocean waves & sea breeze
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    const bandpass = this.ctx.createBiquadFilter();
    bandpass.type = 'bandpass';
    bandpass.frequency.setValueAtTime(280, this.ctx.currentTime);
    bandpass.Q.setValueAtTime(2.5, this.ctx.currentTime);

    this.windGain = this.ctx.createGain();
    this.windGain.gain.setValueAtTime(0.04, this.ctx.currentTime);

    whiteNoise.connect(bandpass);
    bandpass.connect(this.windGain);
    this.windGain.connect(this.ctx.destination);

    whiteNoise.start();
  }

  private setupRadioSynthesizer(): void {
    if (!this.ctx) return;
    this.radioGain = this.ctx.createGain();
    this.radioGain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
    this.radioGain.connect(this.ctx.destination);

    // Sunny coastal surf-guitar / chill marimba arpeggio notes (SoCal surf vibe)
    const scale = [261.63, 293.66, 329.63, 392.0, 440.0, 523.25, 587.33];
    let noteIndex = 0;

    const playNextNote = () => {
      if (!this.ctx || !this.radioGain || !this.radioPlaying || this.radioSource !== 'wasatch-synth') {
        this.radioMelodyTimer = window.setTimeout(playNextNote, 400);
        return;
      }

      try {
        const freq = scale[noteIndex % scale.length];
        noteIndex = (noteIndex + (Math.random() > 0.4 ? 1 : 2)) % scale.length;

        const noteOsc = this.ctx.createOscillator();
        const noteGain = this.ctx.createGain();

        noteOsc.type = 'sine';
        noteOsc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        noteGain.gain.setValueAtTime(0.06, this.ctx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 1.2);

        noteOsc.connect(noteGain);
        noteGain.connect(this.radioGain);

        noteOsc.start();
        noteOsc.stop(this.ctx.currentTime + 1.25);
      } catch {
        // Audio note catch
      }

      this.radioMelodyTimer = window.setTimeout(playNextNote, 320 + Math.random() * 80);
    };

    this.radioMelodyTimer = window.setTimeout(playNextNote, 500);
  }

  public updateCarSpeed(speedMph: number): void {
    if (!this.ctx || !this.engineOsc) return;
    const targetFreq = 40 + (speedMph / 60) * 110;
    this.engineOsc.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.1);
  }

  public setSilentRockSilence(inSilence: boolean): void {
    this.inSilentRock = inSilence;
    if (this.ctx && this.windGain) {
      // Pacific surf roar rises while the radio goes quiet at 1000 Steps Beach
      this.windGain.gain.setTargetAtTime(inSilence ? 0.08 : 0.04, this.ctx.currentTime, 0.5);
    }
    // Fade radio out smoothly to complete sacred silence (KROQ included)
    this.applyRadioLevels(inSilence ? 0.4 : 0.6);
  }

  public toggleRadio(): boolean {
    this.radioPlaying = !this.radioPlaying;
    this.applyRadioLevels(0.2);
    this.emitRadioStatus();
    return this.radioPlaying;
  }

  /** Flip the dial between KROQ 106.7 and the built-in Pacific Surf Synth. */
  public cycleRadioStation(): RadioStation {
    this.tuneStation(this.radioStation === 'x96' ? 'wasatch' : 'x96');
    return this.radioStation;
  }

  public tuneStation(station: RadioStation): void {
    this.radioStation = station;
    if (station === 'x96') {
      this.playX96Live();
    } else {
      this.stopExternalAudio();
      this.radioSource = 'wasatch-synth';
      this.applyRadioLevels(0.3);
      this.emitRadioStatus();
    }
  }

  public getRadioStatus(): RadioStatus {
    const labels: Record<RadioSource, string> = {
      'x96-live': `${X96_STATION.name} ${X96_STATION.frequency} LIVE`,
      'rfh-podcast': RFH_FALLBACK_EPISODE.shortLabel,
      'wasatch-synth': 'PACIFIC SURF RADIO 90.1',
      'custom-track': 'SURF TAPE DECK'
    };
    const nowPlaying =
      this.radioSource === 'x96-live' ? this.nowPlaying || formatX96NowPlaying()
      : this.radioSource === 'rfh-podcast' ? RFH_FALLBACK_EPISODE.title
      : this.radioSource === 'wasatch-synth' ? 'Sunny PCH surf-guitar arpeggios'
      : '';
    return {
      station: this.radioStation,
      source: this.radioSource,
      label: labels[this.radioSource],
      nowPlaying,
      playing: this.radioPlaying
    };
  }

  /** Listener is called immediately with the current status, then on every change. */
  public subscribeRadio(listener: (status: RadioStatus) => void): () => void {
    this.radioListeners.add(listener);
    listener(this.getRadioStatus());
    return () => {
      this.radioListeners.delete(listener);
    };
  }

  private emitRadioStatus(): void {
    const status = this.getRadioStatus();
    this.radioListeners.forEach(listener => listener(status));
  }

  private playX96Live(): void {
    this.playExternalAudio(X96_STATION.streamUrl, 'x96-live', true, () => this.playRfhPodcast());
    this.startNowPlayingPolling();
  }

  private playRfhPodcast(): void {
    this.playExternalAudio(RFH_FALLBACK_EPISODE.mp3Url, 'rfh-podcast', false, () => this.tuneStation('wasatch'));
  }

  private playExternalAudio(url: string, source: RadioSource, isLive: boolean, onFail?: () => void): void {
    this.stopExternalAudio();
    const audio = new Audio();
    audio.preload = 'none';
    audio.volume = STREAM_RADIO_VOLUME;
    audio.loop = !isLive;
    let failed = false;
    const fail = () => {
      if (failed || this.customAudio !== audio) return;
      failed = true;
      onFail?.();
    };
    audio.addEventListener('error', fail);
    // A live stream "ending" means the connection dropped
    if (isLive) audio.addEventListener('ended', fail);
    audio.src = url;

    this.customAudio = audio;
    this.customAudioIsLive = isLive;
    this.radioSource = source;
    this.applyRadioLevels(0.3);
    this.emitRadioStatus();
  }

  private stopExternalAudio(): void {
    this.nowPlayingGeneration++;
    if (this.nowPlayingTimer) clearTimeout(this.nowPlayingTimer);
    this.nowPlayingTimer = null;
    if (!this.customAudio) return;
    const audio = this.customAudio;
    this.customAudio = null;
    audio.pause();
    // Drop the network connection so a live stream stops downloading
    audio.removeAttribute('src');
    audio.load();
  }

  private resumeExternalAudio(): void {
    const audio = this.customAudio;
    if (!audio || !audio.paused) return;
    // Reload a paused live stream so it picks up at the live edge, not where Silent Rock cut it off
    if (this.customAudioIsLive && audio.readyState > 0) audio.load();
    audio.play().catch(() => {});
  }

  private applyRadioLevels(timeConstant: number): void {
    const audible = this.radioPlaying && !this.inSilentRock;
    if (this.ctx && this.radioGain) {
      const synthOn = audible && this.radioSource === 'wasatch-synth';
      this.radioGain.gain.setTargetAtTime(synthOn ? SYNTH_RADIO_GAIN : 0.0001, this.ctx.currentTime, timeConstant);
    }
    if (this.customAudio) {
      if (audible) this.resumeExternalAudio();
      else this.customAudio.pause();
    }
  }

  private startNowPlayingPolling(): void {
    const generation = this.nowPlayingGeneration;
    const poll = async () => {
      if (generation !== this.nowPlayingGeneration || this.radioSource !== 'x96-live') return;
      if (this.radioPlaying && !this.inSilentRock) {
        try {
          const res = await fetch(X96_STATION.nowPlayingUrl, { cache: 'no-store' });
          const events = (await res.json()) as X96NowPlayingEvent[];
          const next = formatX96NowPlaying(events[0]);
          if (generation === this.nowPlayingGeneration && next !== this.nowPlaying) {
            this.nowPlaying = next;
            this.emitRadioStatus();
          }
        } catch {
          // Keep the last known title
        }
      }
      if (generation === this.nowPlayingGeneration) {
        this.nowPlayingTimer = window.setTimeout(poll, NOW_PLAYING_POLL_MS);
      }
    };
    poll();
  }

  public playShrineChime(): void {
    if (!this.ctx) return;
    const chimeOsc = this.ctx.createOscillator();
    const chimeGain = this.ctx.createGain();

    chimeOsc.type = 'triangle';
    chimeOsc.frequency.setValueAtTime(880, this.ctx.currentTime); // A5 chime
    chimeOsc.frequency.exponentialRampToValueAtTime(1760, this.ctx.currentTime + 0.1);

    chimeGain.gain.setValueAtTime(0.2, this.ctx.currentTime);
    chimeGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 2.0);

    chimeOsc.connect(chimeGain);
    chimeGain.connect(this.ctx.destination);

    chimeOsc.start();
    chimeOsc.stop(this.ctx.currentTime + 2.0);
  }

  public playPoliceSiren(): void {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, now);

      // Two-tone rising and falling UHP siren wail
      osc.frequency.setValueAtTime(650, now);
      osc.frequency.linearRampToValueAtTime(1150, now + 0.2);
      osc.frequency.linearRampToValueAtTime(650, now + 0.4);
      osc.frequency.linearRampToValueAtTime(1150, now + 0.6);
      osc.frequency.linearRampToValueAtTime(650, now + 0.8);
      osc.frequency.linearRampToValueAtTime(1250, now + 1.05);

      gain.gain.setValueAtTime(0.16, now);
      gain.gain.linearRampToValueAtTime(0.16, now + 1.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.6);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.65);
    } catch {
      // Audio fallback
    }
  }

  public playJailDoorSlam(): void {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;

      // Heavy metallic prison door impact
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, now);

      // Deep drop thud
      osc.frequency.setValueAtTime(160, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 0.45);

      gain.gain.setValueAtTime(0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.65);

      // Metallic high clang echo
      const metalOsc = this.ctx.createOscillator();
      const metalGain = this.ctx.createGain();
      metalOsc.type = 'square';
      metalOsc.frequency.setValueAtTime(540, now);
      metalOsc.frequency.exponentialRampToValueAtTime(220, now + 0.35);

      metalGain.gain.setValueAtTime(0.09, now);
      metalGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);

      metalOsc.connect(metalGain);
      metalGain.connect(this.ctx.destination);

      metalOsc.start(now);
      metalOsc.stop(now + 0.42);
    } catch {
      // Audio fallback
    }
  }

  public playBailBuzzer(): void {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Electric jail door latch release buzzer
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(110, now); // 110Hz AC hum buzzer
      gain.gain.setValueAtTime(0.18, now);
      gain.gain.setValueAtTime(0.18, now + 0.38);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.5);
    } catch {
      // Audio fallback
    }
  }

  public playCarHorn(): void {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Classic dual-tone car horn (F4 + A4)
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sawtooth';
      osc2.type = 'sawtooth';
      osc1.frequency.setValueAtTime(349.23, now); // F4
      osc2.frequency.setValueAtTime(440.0, now);   // A4

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.setValueAtTime(0.2, now + 0.28);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.38);
      osc2.stop(now + 0.38);
    } catch {
      // Audio fallback
    }
  }

  public playSodaSlurp(): void {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      // Fizzy carbonated soda slurp
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, now);
      osc.frequency.linearRampToValueAtTime(880, now + 0.15);
      osc.frequency.linearRampToValueAtTime(620, now + 0.3);

      gain.gain.setValueAtTime(0.14, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.38);
    } catch {
      // Audio fallback
    }
  }

  public playGasPumpClick(): void {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.045);

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.055);
    } catch {
      // Audio fallback
    }
  }

  public playCashRegister(): void {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc1 = this.ctx.createOscillator();
      const osc2 = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc1.type = 'sine';
      osc2.type = 'triangle';
      osc1.frequency.setValueAtTime(987.77, now); // B5
      osc2.frequency.setValueAtTime(1318.51, now + 0.08); // E6

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(this.ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.08);
      osc1.stop(now + 0.45);
      osc2.stop(now + 0.45);
    } catch {
      // Audio fallback
    }
  }

  public playTireScreech(): void {
    if (!this.ctx) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.Q.setValueAtTime(4, now);

      osc.frequency.setValueAtTime(800, now);
      osc.frequency.linearRampToValueAtTime(1600, now + 0.2);
      osc.frequency.linearRampToValueAtTime(1100, now + 0.45);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.52);
    } catch {
      // Audio fallback
    }
  }

  /**
   * Slot for external MP3 / MP4 voiceover or soundtrack playback.
   */
  public setCustomAudioTrack(url: string): void {
    this.playExternalAudio(url, 'custom-track', false);
  }

  public dispose(): void {
    if (this.radioMelodyTimer) clearTimeout(this.radioMelodyTimer);
    this.stopExternalAudio();
    if (this.ctx) {
      this.ctx.close().catch(() => {});
      this.ctx = null;
    }
  }
}
