import { attachShadow as _attachShadow } from '../../manipulation/create.js';
import QuerySet from '../query-set-core.js';

/**
 * Attaches a shadow DOM tree to the first node.
 * @param {{open?: boolean}} [options] The shadow DOM options.
 * @returns {QuerySet} A new QuerySet object.
 */
export function attachShadow({ open = true } = {}) {
    const shadow = _attachShadow(this, { open });

    return new QuerySet(shadow ? [shadow] : []);
}
