import { hasAttributeTests, setup } from '#cases/utility/tests/has-attribute.js';
import { test } from '#test';

test.describe('QuerySet #hasAttribute', () => {
    test.beforeEach(setup);

    hasAttributeTests(([nodes, ...args]) => $(nodes).hasAttribute(...args));
});
