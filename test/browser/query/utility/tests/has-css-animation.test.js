import { hasCSSAnimationTests, setup } from '#cases/utility/tests/has-css-animation.js';
import { test } from '#test';

test.describe('QuerySet #hasCSSAnimation', () => {
    test.beforeEach(setup);

    hasCSSAnimationTests((nodes) => $(nodes).hasCSSAnimation());
});
