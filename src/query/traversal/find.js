import { find as _find, findByClass as _findByClass, findById as _findById, findByTag as _findByTag, findOne as _findOne, findOneByClass as _findOneByClass, findOneById as _findOneById, findOneByTag as _findOneByTag } from '../../traversal/find.js';
import QuerySet from '../query-set-core.js';

/**
 * Returns all descendant nodes matching a selector.
 * @param {string} selector The query selector.
 * @returns {QuerySet} The QuerySet object.
 */
export function find(selector) {
    return new QuerySet(_find(selector, this));
}

/**
 * Returns all descendant nodes with a specific class.
 * @param {string} className The class name.
 * @returns {QuerySet} The QuerySet object.
 */
export function findByClass(className) {
    return new QuerySet(_findByClass(className, this));
}

/**
 * Returns all descendant nodes with a specific ID.
 * @param {string} id The id.
 * @returns {QuerySet} The QuerySet object.
 */
export function findById(id) {
    return new QuerySet(_findById(id, this));
}

/**
 * Returns all descendant nodes with a specific tag.
 * @param {string} tagName The tag name.
 * @returns {QuerySet} The QuerySet object.
 */
export function findByTag(tagName) {
    return new QuerySet(_findByTag(tagName, this));
}

/**
 * Returns a single descendant node matching a selector.
 * @param {string} selector The query selector.
 * @returns {QuerySet} The QuerySet object.
 */
export function findOne(selector) {
    const node = _findOne(selector, this);

    return new QuerySet(node ? [node] : []);
}

/**
 * Returns a single descendant node with a specific class.
 * @param {string} className The class name.
 * @returns {QuerySet} The QuerySet object.
 */
export function findOneByClass(className) {
    const node = _findOneByClass(className, this);

    return new QuerySet(node ? [node] : []);
}

/**
 * Returns a single descendant node with a specific ID.
 * @param {string} id The id.
 * @returns {QuerySet} The QuerySet object.
 */
export function findOneById(id) {
    const node = _findOneById(id, this);

    return new QuerySet(node ? [node] : []);
}

/**
 * Returns a single descendant node with a specific tag.
 * @param {string} tagName The tag name.
 * @returns {QuerySet} The QuerySet object.
 */
export function findOneByTag(tagName) {
    const node = _findOneByTag(tagName, this);

    return new QuerySet(node ? [node] : []);
}
