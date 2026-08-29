import { expect, test } from '#test';
import register from '../../../dist/fquery.esm.js';
import QuerySet from '../../../src/query/query-set.js';

test('defines QuerySet methods as non-enumerable', () => {
    expect(Object.keys(QuerySet.prototype)).toEqual([]);
    expect(Object.getOwnPropertyDescriptor(QuerySet.prototype, 'add')).toEqual({
        configurable: true,
        enumerable: false,
        value: QuerySet.prototype.add,
        writable: true,
    });
});

test('imports without browser globals', () => {
    expect(globalThis.window).toBeUndefined();
    expect(globalThis.document).toBeUndefined();
    expect(register).toBeInstanceOf(Function);
});
