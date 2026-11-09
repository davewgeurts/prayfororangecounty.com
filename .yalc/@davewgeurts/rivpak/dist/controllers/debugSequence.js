import { CanvasSequenceManager } from "./canvasSequenceManager";
import { EASING_TYPE } from "./CanvasSequence";
export function DebugSequenceTest(target) {
    console.log("%c ===== DEBUG SEQUENCE TEST START =====", 'color:#FF0000; font-weight:bold; font-size:16px;');
    console.log(`%c Target initial state - x:${target.x}, y:${target.y}, xScale:${target.xScale}, yScale:${target.yScale}`, 'color:#FFFF00;');
    const sequenceManager = CanvasSequenceManager.get();
    const seq = sequenceManager.CreateSequence(target, "debugTest");
    // Test both movement and scaling
    seq
        .AddCallback(() => console.log("%c Step 1: About to scale to 0.1 and move to x:100", 'color:#00FF00;'))
        .AddScale(0.1, 0.1, 0, EASING_TYPE.LINEAR) // Instant scale down
        .AddMove(100, target.y, 0, EASING_TYPE.LINEAR) // Instant move x
        .AddCallback(() => console.log(`%c Step 2: After instant changes - x:${target.x}, y:${target.y}, xScale:${target.xScale}, yScale:${target.yScale}`, 'color:#00FF00;'))
        .AddMove(200, 150, 2000, EASING_TYPE.EASE_OUT) // 2 second move animation
        .AddScale(1.5, 1.5, 2000, EASING_TYPE.EASE_OUT) // 2 second scale animation
        .AddCallback(() => console.log(`%c Step 3: Animations should be complete - x:${target.x}, y:${target.y}, xScale:${target.xScale}, yScale:${target.yScale}`, 'color:#00FF00;'))
        .Play(() => {
        console.log("%c ===== SEQUENCE COMPLETE =====", 'color:#FF0000; font-weight:bold; font-size:16px;');
        console.log(`%c Final state - x:${target.x}, y:${target.y}, xScale:${target.xScale}, yScale:${target.yScale}`, 'color:#FFFF00;');
    });
    // Also let's manually check the object after a delay
    setTimeout(() => {
        console.log(`%c After 1 second - xScale:${target.xScale}, yScale:${target.yScale}`, 'color:#FF00FF;');
    }, 1000);
    setTimeout(() => {
        console.log(`%c After 3 seconds - xScale:${target.xScale}, yScale:${target.yScale}`, 'color:#FF00FF;');
    }, 3000);
}
