import { hasFragmentTests, setup } from '#cases/utility/tests/has-fragment.js';
import { test } from '#test';

test.describe('QuerySet #hasFragment', () => {
    test.beforeEach(setup);

    hasFragmentTests((nodes) => $(nodes).hasFragment());
});
