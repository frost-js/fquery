import { hasCssTransitionTests, setup } from '#cases/utility/tests/has-css-transition.js';
import { test } from '#test';

test.describe('QuerySet #hasCssTransition', () => {
    test.beforeEach(setup);

    hasCssTransitionTests((nodes) => $(nodes).hasCssTransition());
});
