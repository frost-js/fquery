import { getAttributeTests, setup } from '#cases/attributes/attributes/get-attribute.js';
import { test } from '#test';

test.describe('QuerySet #getAttribute', () => {
    test.beforeEach(setup);

    getAttributeTests(([nodes, ...args]) => $(nodes).getAttribute(...args));
});
