import { config, getWindow } from '../config.js';
import { animations } from '../vars.js';

let animating = false;

/**
 * Gets the current time.
 * @returns {number} The current time.
 */
export function getTime() {
    const { performance } = getWindow();

    return performance.now();
}

/**
 * Starts the animation loop (if not already started).
 */
export function start() {
    if (animating) {
        return;
    }

    animating = true;
    update();
}

/**
 * Runs a single frame of all animations, and then queue up the next frame.
 */
function update() {
    const { requestAnimationFrame, setTimeout } = getWindow();
    const time = getTime();

    // Callbacks can add or stop animations while the frame is being processed.
    for (const [node, currentAnimations] of [...animations]) {
        const finishedAnimations = currentAnimations.slice()
            .filter((animation) => animation.update(time));

        const otherAnimations = (animations.get(node) || [])
            .filter((animation) => !finishedAnimations.includes(animation));

        if (!otherAnimations.length) {
            animations.delete(node);
        } else {
            animations.set(node, otherAnimations);
        }
    }

    if (!animations.size) {
        animating = false;
    } else if (config.useTimeout) {
        setTimeout(update, 1000 / 60);
    } else {
        requestAnimationFrame(update);
    }
}
