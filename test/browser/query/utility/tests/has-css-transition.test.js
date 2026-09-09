import { hasCSSTransitionTests, setup } from '#cases/utility/tests/has-css-transition.js';
import { test } from '#test';

test.describe('QuerySet #hasCSSTransition', () => {
    test.beforeEach(setup);

    hasCSSTransitionTests((nodes) => $(nodes).hasCSSTransition());
});
