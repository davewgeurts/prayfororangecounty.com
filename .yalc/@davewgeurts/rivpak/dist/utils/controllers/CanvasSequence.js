/* eslint-disable @typescript-eslint/no-explicit-any */
import { animate, linear, easeIn, easeOut, easeInOut, circIn, circOut, circInOut, backIn, backOut, backInOut, anticipate, bounceIn, bounceOut, bounceInOut } from "popmotion";
export var EASING_TYPE;
(function (EASING_TYPE) {
    EASING_TYPE["LINEAR"] = "linear";
    EASING_TYPE["EASE_IN"] = "easeIn";
    EASING_TYPE["EASE_OUT"] = "easeOut";
    EASING_TYPE["EASE_IN_OUT"] = "easeInOut";
    EASING_TYPE["BOUNCE_IN"] = "bounceIn";
    EASING_TYPE["BOUNCE_OUT"] = "bounceOut";
    EASING_TYPE["BOUNCE_IN_OUT"] = "bounceInOut";
    EASING_TYPE["BACK_IN"] = "backIn";
    EASING_TYPE["BACK_OUT"] = "backOut";
    EASING_TYPE["BACK_IN_OUT"] = "backInOut";
    EASING_TYPE["CIRC_IN"] = "circIn";
    EASING_TYPE["CIRC_OUT"] = "circOut";
    EASING_TYPE["CIRC_IN_OUT"] = "circInOut";
    EASING_TYPE["ANTICIPATE"] = "anticipate";
    EASING_TYPE["SPRING"] = "spring";
    EASING_TYPE["DECAY"] = "decay";
})(EASING_TYPE || (EASING_TYPE = {}));
export var ANIMATION_TYPE;
(function (ANIMATION_TYPE) {
    ANIMATION_TYPE["TWEEN"] = "tween";
    ANIMATION_TYPE["SPRING"] = "spring";
    ANIMATION_TYPE["DECAY"] = "decay";
})(ANIMATION_TYPE || (ANIMATION_TYPE = {}));
export class CanvasSequence {
    constructor(target) {
        this._sequence = [];
        this._currentIndex = 0;
        this._activeAnimations = [];
        this._isPlaying = false;
        this._isPaused = false;
        this._onSequenceComplete = null;
        this._currentTime = 0;
        this._looping = false;
        this._debug = false;
        this._lastDebugTime = 0;
        this._debugTimerName = "DebugTimer";
        this._target = target;
    }
    Add(item) {
        this._sequence.push(item);
        return this;
    }
    AddMove(x, y, duration = 1000, easing = EASING_TYPE.EASE_IN_OUT) {
        const actions = [];
        if (x !== undefined)
            actions.push({ property: "x", targetValue: x, duration, easing, animationType: ANIMATION_TYPE.TWEEN });
        if (y !== undefined)
            actions.push({ property: "y", targetValue: y, duration, easing, animationType: ANIMATION_TYPE.TWEEN });
        if (actions.length === 1) {
            this.Add(actions[0]);
        }
        else if (actions.length > 1) {
            this.Add({ actions });
        }
        return this;
    }
    AddScale(xScale, yScale, duration = 1000, easing = EASING_TYPE.EASE_IN_OUT) {
        const actions = [];
        if (xScale !== undefined)
            actions.push({ property: "xScale", targetValue: xScale, duration, easing, animationType: ANIMATION_TYPE.TWEEN });
        if (yScale !== undefined)
            actions.push({ property: "yScale", targetValue: yScale, duration, easing, animationType: ANIMATION_TYPE.TWEEN });
        if (actions.length === 1) {
            this.Add(actions[0]);
        }
        else if (actions.length > 1) {
            this.Add({ actions });
        }
        return this;
    }
    AddDelay(duration) {
        if (this._debug)
            console.log("%c AddDelay duration=" + duration, 'color:#C586C0; font-weight:bold;');
        this.Add({
            property: "x",
            targetValue: this._target.x,
            duration: duration,
            easing: EASING_TYPE.LINEAR,
            animationType: ANIMATION_TYPE.TWEEN
        });
        return this;
    }
    AddCallback(callback) {
        if (this._debug)
            console.log("%c AddCallback", 'color:#C586C0; font-weight:bold;');
        this.Add({
            property: "x",
            targetValue: this._target.x,
            duration: 0,
            easing: EASING_TYPE.LINEAR,
            animationType: ANIMATION_TYPE.TWEEN,
            onComplete: callback
        });
        return this;
    }
    AddSpring(property, targetValue, stiffness = 700, damping = 50, mass = 1) {
        this.Add({
            property,
            targetValue,
            animationType: ANIMATION_TYPE.SPRING,
            stiffness,
            damping,
            mass
        });
        return this;
    }
    AddDecay(property, velocity = 1000, power = 0.8, timeConstant = 350, modifyTarget) {
        this.Add({
            property,
            targetValue: 0,
            animationType: ANIMATION_TYPE.DECAY,
            velocity,
            power,
            timeConstant,
            modifyTarget
        });
        return this;
    }
    Play(onComplete) {
        if (this._debug)
            console.log("%c {" + this.getTimeSinceLastCall() + "} CanvasSequencer Play called", 'color:#C586C0; font-weight:bold;');
        if (this._sequence.length === 0) {
            if (this._debug)
                console.log("%c {" + this.getTimeSinceLastCall() + "} CanvasSequencer Play cock block", 'color:#C586C0; font-weight:bold;');
            return;
        }
        this._onSequenceComplete = onComplete || null;
        this._isPlaying = true;
        this._isPaused = false;
        this._currentIndex = 0;
        this._activeAnimations = [];
        if (this._debug)
            console.log("%c {" + this.getTimeSinceLastCall() + "} _______ CanvasSequencer PLAY PLAY PLAY " + this._sequence.length, 'color:#C586C0; font-weight:bold;', this._sequence);
        this._startNextItem();
    }
    Pause() {
        this._isPaused = true;
    }
    Resume() {
        if (this._isPlaying && this._isPaused) {
            this._isPaused = false;
        }
    }
    Stop() {
        // Stop all active animations
        for (const anim of this._activeAnimations) {
            if (anim.animation && anim.animation.stop) {
                anim.animation.stop();
            }
        }
        this._isPlaying = false;
        this._isPaused = false;
        this._currentIndex = 0;
        this._activeAnimations = [];
    }
    SetLooping(loop) {
        this._looping = loop;
        return this;
    }
    Clear() {
        this.Stop();
        this._sequence = [];
        return this;
    }
    Update(time, deltaTime, frameCount, oncePerSecond) {
        if (!this._isPlaying || this._isPaused) {
            if (!this._isPlaying)
                if (this._debug && oncePerSecond)
                    console.log("%c <" + this._currentIndex + ">{" + this.getTimeSinceLastCall() + "} Update called but not playing", 'color:#FF0000;');
            if (this._isPaused)
                if (this._debug && oncePerSecond)
                    console.log("%c <" + this._currentIndex + ">{" + this.getTimeSinceLastCall() + "} Update called but paused", 'color:#FF0000;');
            return;
        }
        this._currentTime += deltaTime;
        if (this._activeAnimations.length > 0) {
            if (this._debug && oncePerSecond)
                console.log(`%c <${this._currentIndex}> {${this.getTimeSinceLastCall()}} Update: ${this._activeAnimations.length} active animations, deltaTime: ${deltaTime}, currentTime: ${this._currentTime}`, 'color:#00FF00;');
        }
        // Check for animations ready to start
        for (const anim of this._activeAnimations) {
            if (!anim.animation && this._currentTime >= anim.delayedStartTime) {
                if (this._debug)
                    console.log(`%c <${this._currentIndex}> {${this.getTimeSinceLastCall()}} Starting animation for property: ${anim.action.property}`, 'color:#66CCFF; font-weight:bold;');
                this._startPopmotionAnimation(anim);
            }
        }
        // Check if all animations are complete
        const allComplete = this._activeAnimations.every(anim => anim.isComplete);
        if (allComplete && this._activeAnimations.length > 0) {
            if (this._debug)
                console.log(`%c <${this._currentIndex}> {${this.getTimeSinceLastCall()}} All animations complete, moving to next item`, 'color:#66CCFF; font-weight:bold;');
            this._activeAnimations = [];
            this._onItemComplete();
        }
        // If no active animations and we're playing, move to next item immediately
        if (this._activeAnimations.length === 0 && this._isPlaying) {
            if (this._debug)
                console.log(`%c <${this._currentIndex}> {${this.getTimeSinceLastCall()}} No active animations, checking for next item`, 'color:#66CCFF; font-weight:bold;');
            this._onItemComplete();
        }
    }
    _startNextItem() {
        var _a;
        if (this._debug)
            console.log("%c <" + this._currentIndex + ">{" + this.getTimeSinceLastCall() + "} CanvasSequencer _startNextItem called", 'color:#C586C0; font-weight:bold;');
        if (this._currentIndex >= this._sequence.length) {
            if (this._debug)
                console.log("%c <" + this._currentIndex + ">{" + this.getTimeSinceLastCall() + "} CanvasSequencer _startNextItem 1 - End of sequence", 'color:#C586C0; font-weight:bold;');
            // Don't stop playing yet if we have active animations
            if (this._activeAnimations.length > 0) {
                if (this._debug)
                    console.log(`%c <"+this._currentIndex+">{${this.getTimeSinceLastCall()}} Still have ${this._activeAnimations.length} active animations, waiting for them to complete`, 'color:#FFFF00;');
                return;
            }
            if (this._looping) {
                if (this._debug)
                    console.log("%c <" + this._currentIndex + ">{" + this.getTimeSinceLastCall() + "} CanvasSequencer _startNextItem 2", 'color:#C586C0; font-weight:bold;');
                this._currentIndex = 0;
                this._startNextItem();
            }
            else {
                if (this._debug)
                    console.log("%c <" + this._currentIndex + ">{" + this.getTimeSinceLastCall() + "} CanvasSequencer _startNextItem 3 - Sequence complete", 'color:#C586C0; font-weight:bold;');
                (_a = this._onSequenceComplete) === null || _a === void 0 ? void 0 : _a.call(this);
                this._isPlaying = false;
            }
            if (this._debug)
                console.log("%c <" + this._currentIndex + ">{" + this.getTimeSinceLastCall() + "} CanvasSequencer _startNextItem 4", 'color:#C586C0; font-weight:bold;');
            return;
        }
        const item = this._sequence[this._currentIndex];
        if (this._debug)
            console.log("%c <" + this._currentIndex + ">{" + this.getTimeSinceLastCall() + "} CanvasSequencer _startNextItem 5", 'color:#C586C0; font-weight:bold;', item);
        if (this._isParallelActions(item)) {
            if (this._debug)
                console.log("%c <" + this._currentIndex + ">{" + this.getTimeSinceLastCall() + "} CanvasSequencer _startNextItem 6", 'color:#C586C0; font-weight:bold;');
            for (const action of item.actions) {
                if (this._debug)
                    console.log("%c <" + this._currentIndex + ">{" + this.getTimeSinceLastCall() + "} CanvasSequencer _startNextItem 7", 'color:#C586C0; font-weight:bold;');
                this._startAction(action);
            }
        }
        else {
            if (this._debug)
                console.log("%c <" + this._currentIndex + ">{" + this.getTimeSinceLastCall() + "} CanvasSequencer _startNextItem 8", 'color:#C586C0; font-weight:bold;');
            this._startAction(item);
        }
        // After starting actions, check if we actually have animations to wait for
        if (this._debug)
            console.log(`%c <${this._currentIndex}> {${this.getTimeSinceLastCall()}} After starting actions, activeAnimations.length: ${this._activeAnimations.length}`, 'color:#00FF00;');
        // If no animations were added (all were instant), move to next item
        if (this._activeAnimations.length === 0 && this._isPlaying) {
            if (this._debug)
                console.log(`%c <${this._currentIndex}> {${this.getTimeSinceLastCall()}} All actions were instant, moving to next item`, 'color:#FF00FF;');
            this._onItemComplete();
        }
    }
    _startAction(action) {
        if (this._debug)
            console.log(`%c <${this._currentIndex}>{${this.getTimeSinceLastCall()}} CanvasSequencer _startAction called for property: ${action.property}, from: ${this._target[action.property]} to: ${action.targetValue} duration:${action.duration}`, 'color:#C586C0; font-weight:bold;');
        const startValue = this._target[action.property];
        // For instant animations (duration = 0), apply immediately
        if (action.duration === 0) {
            if (this._debug)
                console.log(`%c <${this._currentIndex}>{${this.getTimeSinceLastCall()}} Instant action - applying immediately`, 'color:#00FFFF;');
            this._target[action.property] = action.targetValue;
            // For all transform properties, mark as needs update
            if (['x', 'y', 'xScale', 'yScale'].includes(action.property)) {
                const target = this._target;
                if (this._debug)
                    console.log(`%c <${this._currentIndex}>{${this.getTimeSinceLastCall()}} Instant update - ${action.property} to ${action.targetValue}`, 'color:#FF00FF;');
                // Mark as needing update
                if (target.needsUpdate !== undefined)
                    target.needsUpdate = true;
                if (target.needsRedraw !== undefined)
                    target.needsRedraw = true;
                if (target.dirty !== undefined)
                    target.dirty = true;
                // Call any update methods
                if (target.updateTransform)
                    target.updateTransform();
                if (target.invalidate)
                    target.invalidate();
                if (target.update)
                    target.update();
            }
            if (action.onStart) {
                action.onStart();
            }
            if (action.onComplete) {
                action.onComplete();
            }
            // Don't complete here - let _startNextItem handle completion
            return;
        }
        const activeAnim = {
            action,
            startValue,
            endValue: action.targetValue,
            startTime: this._currentTime,
            delayedStartTime: this._currentTime + (action.delay || 0),
            progress: 0,
            isComplete: false
        };
        if (this._debug)
            console.log(`%c <${this._currentIndex}>{${this.getTimeSinceLastCall()}}`, 'color:#66CCFF; font-weight:bold;', activeAnim);
        this._activeAnimations.push(activeAnim);
        if (this._debug)
            console.log(`%c <${this._currentIndex}>{${this.getTimeSinceLastCall()}} Added animation to queue. Current time: ${this._currentTime}, will start at: ${activeAnim.delayedStartTime}`, 'color:#66CCFF; font-weight:bold;');
    }
    _startPopmotionAnimation(anim) {
        const { action, startValue, endValue } = anim;
        if (action.onStart) {
            action.onStart();
        }
        const animationType = action.animationType || ANIMATION_TYPE.TWEEN;
        switch (animationType) {
            case ANIMATION_TYPE.SPRING:
                anim.animation = animate({
                    from: startValue,
                    to: endValue,
                    type: "spring",
                    stiffness: action.stiffness || 700,
                    damping: action.damping || 50,
                    mass: action.mass || 1,
                    velocity: action.velocity || 0,
                    onUpdate: (value) => {
                        this._target[action.property] = value;
                        // For all transform properties, mark as needs update
                        if (['x', 'y', 'xScale', 'yScale'].includes(action.property)) {
                            const target = this._target;
                            // Mark as needing update - RivePak might check this flag
                            if (target.needsUpdate !== undefined)
                                target.needsUpdate = true;
                            if (target.needsRedraw !== undefined)
                                target.needsRedraw = true;
                            if (target.dirty !== undefined)
                                target.dirty = true;
                            // Call any update methods
                            if (target.updateTransform)
                                target.updateTransform();
                            if (target.invalidate)
                                target.invalidate();
                            if (target.update)
                                target.update();
                        }
                        if (action.onUpdate) {
                            const progress = (value - startValue) / (endValue - startValue);
                            action.onUpdate(Math.max(0, Math.min(1, progress)));
                        }
                    },
                    onComplete: () => {
                        anim.isComplete = true;
                        if (action.onComplete) {
                            action.onComplete();
                        }
                    }
                });
                break;
            case ANIMATION_TYPE.DECAY:
                anim.animation = animate({
                    from: startValue,
                    type: "decay",
                    velocity: action.velocity || 1000,
                    power: action.power || 0.8,
                    timeConstant: action.timeConstant || 350,
                    modifyTarget: action.modifyTarget,
                    onUpdate: (value) => {
                        this._target[action.property] = value;
                        // For all transform properties, mark as needs update
                        if (['x', 'y', 'xScale', 'yScale'].includes(action.property)) {
                            const target = this._target;
                            // Mark as needing update - RivePak might check this flag
                            if (target.needsUpdate !== undefined)
                                target.needsUpdate = true;
                            if (target.needsRedraw !== undefined)
                                target.needsRedraw = true;
                            if (target.dirty !== undefined)
                                target.dirty = true;
                            // Call any update methods
                            if (target.updateTransform)
                                target.updateTransform();
                            if (target.invalidate)
                                target.invalidate();
                            if (target.update)
                                target.update();
                        }
                        if (action.onUpdate) {
                            action.onUpdate(0); // Decay doesn't have traditional progress
                        }
                    },
                    onComplete: () => {
                        anim.isComplete = true;
                        if (action.onComplete) {
                            action.onComplete();
                        }
                    }
                });
                break;
            case ANIMATION_TYPE.TWEEN:
            default:
                const easing = this._getEasingFunction(action.easing || EASING_TYPE.LINEAR);
                anim.animation = animate({
                    from: startValue,
                    to: endValue,
                    duration: action.duration || 1000,
                    ease: easing,
                    onUpdate: (value) => {
                        this._target[action.property] = value;
                        // For all transform properties, mark as needs update
                        if (['x', 'y', 'xScale', 'yScale'].includes(action.property)) {
                            const target = this._target;
                            // Mark as needing update - RivePak might check this flag
                            if (target.needsUpdate !== undefined)
                                target.needsUpdate = true;
                            if (target.needsRedraw !== undefined)
                                target.needsRedraw = true;
                            if (target.dirty !== undefined)
                                target.dirty = true;
                            // Call any update methods
                            if (target.updateTransform)
                                target.updateTransform();
                            if (target.invalidate)
                                target.invalidate();
                            if (target.update)
                                target.update();
                        }
                        if (action.onUpdate) {
                            const progress = (value - startValue) / (endValue - startValue);
                            action.onUpdate(progress);
                        }
                    },
                    onComplete: () => {
                        anim.isComplete = true;
                        if (action.onComplete) {
                            action.onComplete();
                        }
                    }
                });
                break;
        }
    }
    _onItemComplete() {
        if (this._debug)
            console.log(`%c <${this._currentIndex}>{${this.getTimeSinceLastCall()}} Item complete, moving from index ${this._currentIndex} to ${this._currentIndex + 1}`, 'color:#66CCFF; font-weight:bold;');
        this._currentIndex++;
        if (this._isPlaying) {
            this._startNextItem();
        }
    }
    getTimeSinceLastCall(timerName) {
        const now = performance.now();
        const elapsed = (now - this._lastDebugTime) / 1000;
        if (timerName) {
            this._debugTimerName = timerName;
        }
        // Log the elapsed time if debugging is enabled
        //if (this._debug) { console.log(`%c ${this._debugTimerName}: ${elapsed.toFixed(3)} seconds since last call`, 'color:#FFA500; font-weight:bold;'); }
        // Update the last debug time
        this._lastDebugTime = now;
        return elapsed.toFixed(2) + " - " + now.toFixed(2);
    }
    _isParallelActions(item) {
        return "actions" in item;
    }
    _getEasingFunction(easing) {
        switch (easing) {
            case EASING_TYPE.LINEAR: return linear;
            case EASING_TYPE.EASE_IN: return easeIn;
            case EASING_TYPE.EASE_OUT: return easeOut;
            case EASING_TYPE.EASE_IN_OUT: return easeInOut;
            case EASING_TYPE.BOUNCE_IN: return bounceIn;
            case EASING_TYPE.BOUNCE_OUT: return bounceOut;
            case EASING_TYPE.BOUNCE_IN_OUT: return bounceInOut;
            case EASING_TYPE.BACK_IN: return backIn;
            case EASING_TYPE.BACK_OUT: return backOut;
            case EASING_TYPE.BACK_IN_OUT: return backInOut;
            case EASING_TYPE.CIRC_IN: return circIn;
            case EASING_TYPE.CIRC_OUT: return circOut;
            case EASING_TYPE.CIRC_IN_OUT: return circInOut;
            case EASING_TYPE.ANTICIPATE: return anticipate;
            default: return linear;
        }
    }
}
