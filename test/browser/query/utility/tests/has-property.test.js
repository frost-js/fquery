import { hasPropertyTests, setup } from '#cases/utility/tests/has-property.js';
import { test } from '#test';

test.describe('QuerySet #hasProperty', () => {
    test.beforeEach(setup);

    hasPropertyTests(([nodes, ...args]) => $(nodes).hasProperty(...args));
});
