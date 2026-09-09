import { hasAnimationTests, setup } from '#cases/utility/tests/has-animation.js';
import { test } from '#test';

test.describe('QuerySet #hasAnimation', () => {
    test.beforeEach(setup);

    hasAnimationTests((nodes) => $(nodes).hasAnimation());
});
