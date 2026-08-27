/** @import { EventCallback } from './event-handlers.js'; */

import { getWindow } from './../config.js';
import { debounce as _debounce } from './../helpers.js';
import { eventLookup } from './../vars.js';
import { addEvent, removeEvent } from './event-handlers.js';

/**
 * Returns a wrapped mouse drag event (optionally debounced).
 * @param {EventCallback} down The callback to execute on mousedown.
 * @param {EventCallback} move The callback to execute on mousemove.
 * @param {EventCallback} up The callback to execute on mouseup.
 * @param {{debounce?: boolean, passive?: boolean, preventDefault?: boolean, touches?: number}} [options] The mouse drag options.
 * @returns {EventCallback} The mouse drag event callback.
 */
export function mouseDragFactory(down, move, up, { debounce = true, passive = true, preventDefault = true, touches = 1 } = {}) {
    if (move && debounce) {
        move = _debounce(move);

        // needed to make sure up callback executes after final move callback
        if (up) {
            up = _debounce(up);
        }
    }

    return (event) => {
        const isTouch = event.type === 'touchstart';

        if (isTouch && event.touches.length !== touches) {
            return;
        }

        if (down && down(event) === false) {
            return;
        }

        if (preventDefault) {
            event.preventDefault();
        }

        if (!move && !up) {
            return;
        }

        const window = getWindow();

        const [moveEvent, upEvent] = event.type in eventLookup ?
            eventLookup[event.type] :
            eventLookup.mousedown;

        const realMove = (event) => {
            if (isTouch && event.touches.length !== touches) {
                return;
            }

            if (preventDefault && !passive) {
                event.preventDefault();
            }

            if (!move) {
                return;
            }

            move(event);
        };

        const realUp = (event) => {
            if (isTouch && event.touches.length !== touches - 1) {
                return;
            }

            if (up && up(event) === false) {
                return;
            }

            if (preventDefault) {
                event.preventDefault();
            }

            removeEvent(window, moveEvent, realMove);
            removeEvent(window, upEvent, realUp);
        };

        addEvent(window, moveEvent, realMove, { passive });
        addEvent(window, upEvent, realUp);
    };
};
