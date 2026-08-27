/** @import { SizeOptions } from '../../attributes/size.js'; */

import { height as _height, width as _width } from './../../attributes/size.js';
import { PADDING_BOX } from './../../vars.js';

/**
 * Gets the computed height of the first node.
 * @param {SizeOptions} [options] The sizing options.
 * @returns {number|undefined} The height, or `undefined` if no node matches.
 */
export function height({ boxSize = PADDING_BOX, outer = false } = {}) {
    return _height(this, { boxSize, outer });
};

/**
 * Gets the computed width of the first node.
 * @param {SizeOptions} [options] The sizing options.
 * @returns {number|undefined} The width, or `undefined` if no node matches.
 */
export function width({ boxSize = PADDING_BOX, outer = false } = {}) {
    return _width(this, { boxSize, outer });
};
