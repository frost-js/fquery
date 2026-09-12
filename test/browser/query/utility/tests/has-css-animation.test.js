import { hasCssAnimationTests, setup } from '#cases/utility/tests/has-css-animation.js';
import { test } from '#test';

test.describe('QuerySet #hasCssAnimation', () => {
    test.beforeEach(setup);

    hasCssAnimationTests((nodes) => $(nodes).hasCssAnimation());
});
