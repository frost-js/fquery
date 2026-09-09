import { isFixedTests, setup } from '#cases/utility/tests/is-fixed.js';
import { test } from '#test';

test.describe('QuerySet #isFixed', () => {
    test.beforeEach(setup);

    isFixedTests((nodes) => $(nodes).isFixed());
});
