import { CanvasSequenceManager } from "./canvasSequenceManager";
import { EASING_TYPE, ANIMATION_TYPE } from "./CanvasSequence";
// Example sequences for common animations
export class ExampleSequences {
    // Bounce in from small to normal size
    static BounceIn(target, finalScale = 1, duration = 1000) {
        const seq = CanvasSequenceManager.get().CreateSequence(target, `bounceIn_${target.uuid}`);
        seq
            .AddScale(0.1, 0.1, 0) // Start tiny instantly
            .AddScale(finalScale, finalScale, duration, EASING_TYPE.BOUNCE_OUT)
            .Play();
    }
    // Spring in with both scales animating in parallel
    static SpringIn(target, finalScale = 1, stiffness = 400, damping = 20) {
        const seq = CanvasSequenceManager.get().CreateSequence(target, `springIn_${target.uuid}`);
        seq
            .AddScale(0.1, 0.1, 0) // Start tiny instantly
            .Add({
            actions: [
                {
                    property: "xScale",
                    targetValue: finalScale,
                    animationType: ANIMATION_TYPE.SPRING,
                    stiffness: stiffness,
                    damping: damping
                },
                {
                    property: "yScale",
                    targetValue: finalScale,
                    animationType: ANIMATION_TYPE.SPRING,
                    stiffness: stiffness,
                    damping: damping
                }
            ]
        })
            .Play();
    }
    // Elastic pop effect
    static ElasticPop(target, overshoot = 1.2, finalScale = 1) {
        const seq = CanvasSequenceManager.get().CreateSequence(target, `elasticPop_${target.uuid}`);
        seq
            .AddScale(0, 0, 0) // Start at zero
            .AddSpring("xScale", overshoot * finalScale, 200, 10) // Overshoot
            .AddSpring("yScale", overshoot * finalScale, 200, 10)
            .AddSpring("xScale", finalScale, 300, 20) // Settle back
            .AddSpring("yScale", finalScale, 300, 20)
            .Play();
    }
    // Staggered appearance for multiple objects
    static StaggeredAppear(targets, staggerDelay = 100, finalScale = 1) {
        targets.forEach((target, index) => {
            const seq = CanvasSequenceManager.get().CreateSequence(target, `stagger_${target.uuid}`);
            seq
                .AddScale(0, 0, 0) // Start invisible
                .AddDelay(index * staggerDelay) // Stagger delay
                .Add({
                actions: [
                    {
                        property: "xScale",
                        targetValue: finalScale,
                        animationType: ANIMATION_TYPE.SPRING,
                        stiffness: 400,
                        damping: 25
                    },
                    {
                        property: "yScale",
                        targetValue: finalScale,
                        animationType: ANIMATION_TYPE.SPRING,
                        stiffness: 400,
                        damping: 25
                    }
                ]
            })
                .Play();
        });
    }
}
