import { hasShadowTests, setup } from '#cases/utility/tests/has-shadow.js';
import { test } from '#test';

test.describe('QuerySet #hasShadow', () => {
    test.beforeEach(setup);

    hasShadowTests((nodes) => $(nodes).hasShadow());
});
