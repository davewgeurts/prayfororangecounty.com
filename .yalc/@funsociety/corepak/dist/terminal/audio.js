// Web Audio API Synthesizer for Retro Sound Effects
let userInteracted = false;
if (typeof window !== 'undefined') {
    const markInteracted = () => {
        userInteracted = true;
    };
    const events = ['pointerdown', 'keydown', 'touchstart', 'mousedown', 'click'];
    for (const evt of events) {
        window.addEventListener(evt, markInteracted, { once: true, capture: true, passive: true });
    }
}
export function hasUserInteracted() {
    if (typeof window === 'undefined')
        return false;
    if (userInteracted)
        return true;
    const ua = navigator.userActivation;
    if (ua && ua.hasBeenActive) {
        userInteracted = true;
        return true;
    }
    return false;
}
export class SoundEffects {
    ctx = null;
    isMuted = false;
    constructor() {
        // AudioContext is lazily initialized only after a user gesture
    }
    init() {
        if (!hasUserInteracted())
            return false;
        if (!this.ctx && typeof window !== 'undefined') {
            const AudioCtx = window.AudioContext ||
                window.webkitAudioContext;
            if (AudioCtx) {
                this.ctx = new AudioCtx();
            }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            void this.ctx.resume();
        }
        return Boolean(this.ctx);
    }
    playKey() {
        if (this.isMuted || !this.init() || !this.ctx)
            return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600 + Math.random() * 200, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.05);
        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
    }
    playSuccess() {
        if (this.isMuted || !this.init() || !this.ctx)
            return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.setValueAtTime(554.37, now + 0.1);
        osc.frequency.setValueAtTime(659.25, now + 0.2);
        osc.frequency.setValueAtTime(880, now + 0.3);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.linearRampToValueAtTime(0.1, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.8);
    }
    playWin() {
        if (this.isMuted || !this.init() || !this.ctx)
            return;
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5];
        const times = [0, 0.1, 0.2, 0.3, 0.4, 0.55];
        const durations = [0.08, 0.08, 0.08, 0.08, 0.1, 0.4];
        notes.forEach((freq, i) => {
            if (!this.ctx)
                return;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'square';
            osc.frequency.setValueAtTime(freq, now + times[i]);
            gain.gain.setValueAtTime(0.1, now + times[i]);
            gain.gain.exponentialRampToValueAtTime(0.001, now + times[i] + durations[i]);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now + times[i]);
            osc.stop(now + times[i] + durations[i]);
        });
    }
    playError() {
        if (this.isMuted || !this.init() || !this.ctx)
            return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.3);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
    }
    playCoin() {
        if (this.isMuted || !this.init() || !this.ctx)
            return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(987.77, now);
        osc.frequency.setValueAtTime(1318.51, now + 0.08);
        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
    }
    get enabled() {
        return !this.isMuted;
    }
    set enabled(value) {
        this.isMuted = !value;
    }
    toggleMute() {
        this.isMuted = !this.isMuted;
        return this.isMuted;
    }
}
export { SoundEffects as SoundSystem };
export const sounds = new SoundEffects();
