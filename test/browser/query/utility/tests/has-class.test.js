import { hasClassTests, setup } from '#cases/utility/tests/has-class.js';
import { test } from '#test';

test.describe('QuerySet #hasClass', () => {
    test.beforeEach(setup);

    hasClassTests(([nodes, ...args]) => $(nodes).hasClass(...args));
});
