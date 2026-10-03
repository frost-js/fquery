import { getWindow, setContext, setWindow } from './config.js';

let _$;
let fQuery;

/**
 * Resets the global $ variable.
 */
export function noConflict() {
    const window = getWindow();

    if (fQuery && window.$ === fQuery) {
        window.$ = _$;
    }
}

/**
 * Registers the global variables.
 * @param {Window} window The window.
 * @param {Document} [document] The document.
 * @param {Function} query The fQuery function.
 * @returns {Function} The fQuery function.
 */
export function registerGlobals(window, document, query) {
    fQuery = query;

    setWindow(window);
    setContext(document || window.document);

    _$ = window.$;
    window.$ = fQuery;

    return fQuery;
}
