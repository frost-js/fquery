/** @import QuerySet from '../query/query-set.js'; */

import { isArray, isDocument, isElement, isFragment, isShadow, merge, unique } from '@fr0st/core';
import { getContext } from './../config.js';
import { escapeCSS, resolveNodes } from './../helpers.js';

/**
 * @typedef {Element|Document|DocumentFragment|ShadowRoot} QueryContext
 */

/**
 * @typedef {string|QueryContext|Array<string|QueryContext>|NodeList|HTMLCollection|QuerySet} QueryContextInput
 * A query context, collection of query contexts, QuerySet, or selector string.
 */

/**
 * Resolves one or more find contexts without using the higher-level node parser.
 * @param {QueryContextInput} context The input context.
 * @returns {QueryContext[]} The resolved contexts.
 */
function resolveContexts(context) {
    const nodeFilter = (node) => isDocument(node) || isElement(node) || isFragment(node) || isShadow(node);

    if (!isArray(context)) {
        return resolveNodes(context, find, nodeFilter);
    }

    const results = context.flatMap((node) => resolveNodes(node, find, nodeFilter));

    return context.length > 1 && results.length > 1 ?
        unique(results) :
        results;
};

/**
 * Returns all nodes matching a selector.
 * @param {string} selector The query selector.
 * @param {QueryContextInput} [context=getContext()] The query context.
 * @returns {Element[]} The matching nodes.
 */
export function find(selector, context = getContext()) {
    if (!selector) {
        return [];
    }

    // fast selector
    const match = selector.match(/^([#.]?)([\w-]+)$/);

    if (match) {
        if (match[1] === '#') {
            return findById(match[2], context);
        }

        if (match[1] === '.') {
            return findByClass(match[2], context);
        }

        return findByTag(match[2], context);
    }

    if (isDocument(context) || isElement(context) || isFragment(context) || isShadow(context)) {
        return merge([], context.querySelectorAll(selector));
    }

    const nodes = resolveContexts(context);

    const results = [];

    for (const node of nodes) {
        const newNodes = node.querySelectorAll(selector);

        results.push(...newNodes);
    }

    return nodes.length > 1 && results.length > 1 ?
        unique(results) :
        results;
};

/**
 * Returns all nodes with a specific class.
 * @param {string} className The class name.
 * @param {QueryContextInput} [context=getContext()] The query context.
 * @returns {Element[]} The matching nodes.
 */
export function findByClass(className, context = getContext()) {
    if (isDocument(context) || isElement(context)) {
        return merge([], context.getElementsByClassName(className));
    }

    const selector = `.${escapeCSS(className)}`;

    if (isFragment(context) || isShadow(context)) {
        return merge([], context.querySelectorAll(selector));
    }

    const nodes = resolveContexts(context);

    const results = [];

    for (const node of nodes) {
        const newNodes = isFragment(node) || isShadow(node) ?
            node.querySelectorAll(selector) :
            node.getElementsByClassName(className);

        results.push(...newNodes);
    }

    return nodes.length > 1 && results.length > 1 ?
        unique(results) :
        results;
};

/**
 * Returns all nodes with a specific ID.
 * @param {string} id The id.
 * @param {QueryContextInput} [context=getContext()] The query context.
 * @returns {Element[]} The matching nodes.
 */
export function findById(id, context = getContext()) {
    const selector = `#${escapeCSS(id)}`;

    if (isDocument(context) || isElement(context) || isFragment(context) || isShadow(context)) {
        return merge([], context.querySelectorAll(selector));
    }

    const nodes = resolveContexts(context);

    const results = [];

    for (const node of nodes) {
        const newNodes = node.querySelectorAll(selector);

        results.push(...newNodes);
    }

    return nodes.length > 1 && results.length > 1 ?
        unique(results) :
        results;
};

/**
 * Returns all nodes with a specific tag.
 * @param {string} tagName The tag name.
 * @param {QueryContextInput} [context=getContext()] The query context.
 * @returns {Element[]} The matching nodes.
 */
export function findByTag(tagName, context = getContext()) {
    if (isDocument(context) || isElement(context)) {
        return merge([], context.getElementsByTagName(tagName));
    }

    if (isFragment(context) || isShadow(context)) {
        return merge([], context.querySelectorAll(tagName));
    }

    const nodes = resolveContexts(context);

    const results = [];

    for (const node of nodes) {
        const newNodes = isFragment(node) || isShadow(node) ?
            node.querySelectorAll(tagName) :
            node.getElementsByTagName(tagName);

        results.push(...newNodes);
    }

    return nodes.length > 1 && results.length > 1 ?
        unique(results) :
        results;
};

/**
 * Returns a single node matching a selector.
 * @param {string} selector The query selector.
 * @param {QueryContextInput} [context=getContext()] The query context.
 * @returns {Element|null|undefined} The matching element, or `undefined` if none matches.
 */
export function findOne(selector, context = getContext()) {
    if (!selector) {
        return null;
    }

    // fast selector
    const match = selector.match(/^([#.]?)([\w-]+)$/);

    if (match) {
        if (match[1] === '#') {
            return findOneById(match[2], context);
        }

        if (match[1] === '.') {
            return findOneByClass(match[2], context);
        }

        return findOneByTag(match[2], context);
    }

    if (isDocument(context) || isElement(context) || isFragment(context) || isShadow(context)) {
        return context.querySelector(selector);
    }

    const nodes = resolveContexts(context);

    if (!nodes.length) {
        return;
    }

    for (const node of nodes) {
        const result = node.querySelector(selector);

        if (result) {
            return result;
        }
    }

    return null;
};

/**
 * Returns a single node with a specific class.
 * @param {string} className The class name.
 * @param {QueryContextInput} [context=getContext()] The query context.
 * @returns {Element|null|undefined} The matching element, or `undefined` if none matches.
 */
export function findOneByClass(className, context = getContext()) {
    if (isDocument(context) || isElement(context)) {
        return context.getElementsByClassName(className).item(0);
    }

    const selector = `.${escapeCSS(className)}`;

    if (isFragment(context) || isShadow(context)) {
        return context.querySelector(selector);
    }

    const nodes = resolveContexts(context);

    if (!nodes.length) {
        return;
    }

    for (const node of nodes) {
        const result = isFragment(node) || isShadow(node) ?
            node.querySelector(selector) :
            node.getElementsByClassName(className).item(0);

        if (result) {
            return result;
        }
    }

    return null;
};

/**
 * Returns a single node with a specific ID.
 * @param {string} id The id.
 * @param {QueryContextInput} [context=getContext()] The query context.
 * @returns {Element|null|undefined} The matching element, or `undefined` if none matches.
 */
export function findOneById(id, context = getContext()) {
    if (isDocument(context)) {
        return context.getElementById(id);
    }

    const selector = `#${escapeCSS(id)}`;

    if (isElement(context) || isFragment(context) || isShadow(context)) {
        return context.querySelector(selector);
    }

    const nodes = resolveContexts(context);

    if (!nodes.length) {
        return;
    }

    for (const node of nodes) {
        const result = isDocument(node) ?
            node.getElementById(id) :
            node.querySelector(selector);

        if (result) {
            return result;
        }
    }

    return null;
};

/**
 * Returns a single node with a specific tag.
 * @param {string} tagName The tag name.
 * @param {QueryContextInput} [context=getContext()] The query context.
 * @returns {Element|null|undefined} The matching element, or `undefined` if none matches.
 */
export function findOneByTag(tagName, context = getContext()) {
    if (isDocument(context) || isElement(context)) {
        return context.getElementsByTagName(tagName).item(0);
    }

    if (isFragment(context) || isShadow(context)) {
        return context.querySelector(tagName);
    }

    const nodes = resolveContexts(context);

    if (!nodes.length) {
        return;
    }

    for (const node of nodes) {
        const result = isFragment(node) || isShadow(node) ?
            node.querySelector(tagName) :
            node.getElementsByTagName(tagName).item(0);

        if (result) {
            return result;
        }
    }

    return null;
};
