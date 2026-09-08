/** @import { ElementInput } from '../helpers.js'; */

import { callDOMMethod, getDOMProperty, unique } from '@fr0st/core';
import { getContext } from './../config.js';
import { parseNodes } from './../filters.js';
import { escapeCSS, normalizeCssProperty, normalizeCssValue } from './../helpers.js';

const styleLocks = new WeakMap();

/**
 * Checks that a node's property is available for a style lock.
 * @param {Element} node The input element.
 * @param {string} property The normalized CSS property name.
 * @throws {Error} When the property is already locked.
 */
export function assertStyleUnlocked(node, property) {
    if (styleLocks.get(node)?.has(property)) {
        throw new Error(`CSS property "${property}" is already locked.`);
    }
};

/**
 * Temporarily sets and locks one inline style property for each node.
 * @param {ElementInput} selector The input node(s), or a query selector string.
 * @param {string} property The longhand or custom property name. Shorthands and aliases are not supported.
 * @param {string|number} value The temporary style value.
 * @param {{important?: boolean}} [options] The style options.
 * @returns {() => void} A function that releases the locks and restores the original declarations. Repeated calls do nothing.
 * @throws {Error} When the property or value is unsupported, or any matching node already has a lock for the property.
 */
export function setStyleLock(selector, property, value, { important = false } = {}) {
    property = normalizeCssProperty(property);
    value = normalizeCssValue(property, value);

    validateStyleLock(property, value);

    const originals = unique(parseNodes(selector)).map((node) => {
        assertStyleUnlocked(node, property);

        const style = getDOMProperty(node, 'style');

        return {
            node,
            style,
            present: [...style].includes(property),
            value: style.getPropertyValue(property),
            priority: style.getPropertyPriority(property),
        };
    });

    for (const { node } of originals) {
        if (!styleLocks.has(node)) {
            styleLocks.set(node, new Set());
        }

        styleLocks.get(node).add(property);
    }

    for (const { style } of originals) {
        style.setProperty(property, value, important ? 'important' : '');
    }

    let released = false;

    return () => {
        if (released) {
            return;
        }

        released = true;

        for (const { style, value, priority, present } of originals) {
            style.setProperty(property, value, priority);

            // setProperty removes empty values, so restore empty custom declarations explicitly.
            if (present && value === '') {
                style.cssText += ` ${escapeCSS(property)}:${priority ? '!important' : ''};`;
            }
        }

        for (const { node } of originals) {
            const locks = styleLocks.get(node);

            locks.delete(property);

            if (!locks.size) {
                styleLocks.delete(node);
            }
        }
    };
};

/**
 * Validates a property and value before acquiring style locks.
 * @param {string} property The normalized CSS property name.
 * @param {string|number} value The normalized CSS value.
 * @throws {Error} When the property or value is unsupported.
 */
function validateStyleLock(property, value) {
    const node = callDOMMethod(getContext(), 'createElementNS', 'http://www.w3.org/1999/xhtml', 'div');
    const style = getDOMProperty(node, 'style');

    style.setProperty(property, 'initial');

    if (
        property === 'all' ||
        style.length !== 1 ||
        style.item(0) !== property
    ) {
        throw new Error(`Cannot lock CSS property "${property}". Use a supported longhand or custom property.`);
    }

    style.cssText = '';
    style.setProperty(property, value);

    if (value !== '' && !style.length) {
        throw new Error(`Invalid value for CSS property "${property}".`);
    }
};
