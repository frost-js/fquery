/** @import { AttributeValues } from '../../attributes/attributes.js'; */
/** @import QuerySet from '../query-set.js'; */

import { getAttribute as _getAttribute, getDataset as _getDataset, getHTML as _getHTML, getProperty as _getProperty, getText as _getText, getValue as _getValue, removeAttribute as _removeAttribute, removeDataset as _removeDataset, removeProperty as _removeProperty, setAttribute as _setAttribute, setDataset as _setDataset, setHTML as _setHTML, setProperty as _setProperty, setText as _setText, setValue as _setValue } from './../../attributes/attributes.js';

/**
 * Gets attribute value(s) for the first node.
 * @param {string} [attribute] The attribute name.
 * @returns {string|null|Record<string, string|null>|undefined} The attribute value, all attributes, or `undefined` if no element matches.
 */
export function getAttribute(attribute) {
    return _getAttribute(this, attribute);
};

/**
 * Gets dataset value(s) for the first node.
 * @param {string} [key] The dataset key.
 * @returns {*|undefined} The dataset value, all dataset values, or `undefined` if no element matches.
 */
export function getDataset(key) {
    return _getDataset(this, key);
};

/**
 * Gets the HTML contents of the first node.
 * @returns {string|undefined} The HTML contents, or `undefined` if no element matches.
 */
export function getHTML() {
    return _getHTML(this);
};

/**
 * Gets a property value for the first node.
 * @param {string} property The property name.
 * @returns {*|undefined} The property value, or `undefined` if no element matches.
 */
export function getProperty(property) {
    return _getProperty(this, property);
};

/**
 * Gets the text contents of the first node.
 * @returns {string|null|undefined} The text contents, or `undefined` if no element matches.
 */
export function getText() {
    return _getText(this);
};

/**
 * Gets the value property of the first node.
 * @returns {*|undefined} The value, or `undefined` if no element matches.
 */
export function getValue() {
    return _getValue(this);
};

/**
 * Removes an attribute from each node.
 * @param {string} attribute The attribute name.
 * @returns {QuerySet} The QuerySet object.
 */
export function removeAttribute(attribute) {
    _removeAttribute(this, attribute);

    return this;
};

/**
 * Removes a dataset value from each node.
 * @param {string} key The dataset key.
 * @returns {QuerySet} The QuerySet object.
 */
export function removeDataset(key) {
    _removeDataset(this, key);

    return this;
};

/**
 * Removes a property from each node.
 * @param {string} property The property name.
 * @returns {QuerySet} The QuerySet object.
 */
export function removeProperty(property) {
    _removeProperty(this, property);

    return this;
};

/**
 * Sets an attribute value for each node.
 * @param {string|AttributeValues} attribute The attribute name, or an object containing attributes.
 * @param {*} [value] The attribute value.
 * @returns {QuerySet} The QuerySet object.
 */
export function setAttribute(attribute, value) {
    _setAttribute(this, attribute, value);

    return this;
};

/**
 * Sets a dataset value for each node.
 * @param {string|Record<string, *>} key The dataset key, or an object containing dataset values.
 * @param {*} [value] The dataset value.
 * @returns {QuerySet} The QuerySet object.
 */
export function setDataset(key, value) {
    _setDataset(this, key, value);

    return this;
};

/**
 * Sets the HTML contents of each node.
 * @param {string} html The HTML contents.
 * @returns {QuerySet} The QuerySet object.
 */
export function setHTML(html) {
    _setHTML(this, html);

    return this;
};

/**
 * Sets a property value for each node.
 * @param {string|Record<string, *>} property The property name, or an object containing properties.
 * @param {*} [value] The property value.
 * @returns {QuerySet} The QuerySet object.
 */
export function setProperty(property, value) {
    _setProperty(this, property, value);

    return this;
};

/**
 * Sets the text contents of each node.
 * @param {string} text The text contents.
 * @returns {QuerySet} The QuerySet object.
 */
export function setText(text) {
    _setText(this, text);

    return this;
};

/**
 * Sets the value property of each node.
 * @param {string} value The value.
 * @returns {QuerySet} The QuerySet object.
 */
export function setValue(value) {
    _setValue(this, value);

    return this;
};
