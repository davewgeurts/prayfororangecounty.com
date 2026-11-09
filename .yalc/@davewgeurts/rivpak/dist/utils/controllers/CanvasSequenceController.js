import { CanvasSequence, EASING_TYPE } from "./CanvasSequence";
export class CanvasSequenceController {
    static get() { if (!this._instance)
        this._instance = new CanvasSequenceController(); return this._instance; }
    constructor() {
        this._sequencers = new Map();
        this._activeSequencers = new Set();
    }
    CreateSequence(target, id) {
        const sequenceId = id || target.uuid;
        if (this._sequencers.has(sequenceId)) {
            this.StopSequence(sequenceId);
        }
        const sequencer = new CanvasSequence(target);
        this._sequencers.set(sequenceId, sequencer);
        // Override the Play method to ensure it's tracked
        const originalPlay = sequencer.Play.bind(sequencer);
        sequencer.Play = (onComplete) => {
            this._activeSequencers.add(sequencer);
            originalPlay(() => {
                this._activeSequencers.delete(sequencer);
                onComplete === null || onComplete === void 0 ? void 0 : onComplete();
            });
        };
        return sequencer;
    }
    GetSequence(id) {
        return this._sequencers.get(id);
    }
    PlaySequence(id, onComplete) {
        const sequencer = this._sequencers.get(id);
        if (sequencer) {
            this._activeSequencers.add(sequencer);
            sequencer.Play(() => {
                this._activeSequencers.delete(sequencer);
                onComplete === null || onComplete === void 0 ? void 0 : onComplete();
            });
        }
    }
    StopSequence(id) {
        const sequencer = this._sequencers.get(id);
        if (sequencer) {
            sequencer.Stop();
            this._activeSequencers.delete(sequencer);
        }
    }
    PauseSequence(id) {
        const sequencer = this._sequencers.get(id);
        if (sequencer) {
            sequencer.Pause();
        }
    }
    ResumeSequence(id) {
        const sequencer = this._sequencers.get(id);
        if (sequencer) {
            sequencer.Resume();
        }
    }
    RemoveSequence(id) {
        const sequencer = this._sequencers.get(id);
        if (sequencer) {
            sequencer.Stop();
            this._activeSequencers.delete(sequencer);
            this._sequencers.delete(id);
        }
    }
    Update(time, deltaTime, frameCount, oncePerSecond) {
        for (const sequencer of this._activeSequencers) {
            sequencer.Update(time, deltaTime, frameCount, oncePerSecond);
        }
    }
    StopAll() {
        for (const sequencer of this._sequencers.values()) {
            sequencer.Stop();
        }
        this._activeSequencers.clear();
    }
    Clear() {
        this.StopAll();
        this._sequencers.clear();
    }
    QuickMove(target, x, y, duration = 1000, easing = EASING_TYPE.EASE_IN_OUT, onComplete) {
        const id = `quick_${target.uuid}_${Date.now()}`;
        const seq = this.CreateSequence(target, id);
        seq.AddMove(x, y, duration, easing);
        seq.Play(() => {
            this.RemoveSequence(id);
            onComplete === null || onComplete === void 0 ? void 0 : onComplete();
        });
    }
    QuickScale(target, xScale, yScale, duration = 1000, easing = EASING_TYPE.EASE_IN_OUT, onComplete) {
        const id = `quick_${target.uuid}_${Date.now()}`;
        const seq = this.CreateSequence(target, id);
        seq.AddScale(xScale, yScale, duration, easing);
        seq.Play(() => {
            this.RemoveSequence(id);
            onComplete === null || onComplete === void 0 ? void 0 : onComplete();
        });
    }
    QuickSequence(target, items, onComplete) {
        const id = `quick_${target.uuid}_${Date.now()}`;
        const seq = this.CreateSequence(target, id);
        for (const item of items) {
            seq.Add(item);
        }
        seq.Play(() => {
            this.RemoveSequence(id);
            onComplete === null || onComplete === void 0 ? void 0 : onComplete();
        });
    }
    QuickSpring(target, property, targetValue, stiffness = 700, damping = 50, onComplete) {
        const id = `spring_${target.uuid}_${Date.now()}`;
        const seq = this.CreateSequence(target, id);
        seq.AddSpring(property, targetValue, stiffness, damping);
        seq.Play(() => {
            this.RemoveSequence(id);
            onComplete === null || onComplete === void 0 ? void 0 : onComplete();
        });
    }
    QuickBounce(target, x, y, duration = 1000, onComplete) {
        const id = `bounce_${target.uuid}_${Date.now()}`;
        const seq = this.CreateSequence(target, id);
        seq.AddMove(x, y, duration, EASING_TYPE.BOUNCE_OUT);
        seq.Play(() => {
            this.RemoveSequence(id);
            onComplete === null || onComplete === void 0 ? void 0 : onComplete();
        });
    }
    QuickElastic(target, xScale, yScale, onComplete) {
        const id = `elastic_${target.uuid}_${Date.now()}`;
        const seq = this.CreateSequence(target, id);
        seq.AddSpring("xScale", xScale, 300, 10);
        seq.AddSpring("yScale", yScale, 300, 10);
        seq.Play(() => {
            this.RemoveSequence(id);
            onComplete === null || onComplete === void 0 ? void 0 : onComplete();
        });
    }
}
