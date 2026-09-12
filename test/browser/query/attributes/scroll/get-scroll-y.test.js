import { getScrollYTests, setup } from '#cases/attributes/scroll/get-scroll-y.js';
import { test } from '#test';

test.describe('QuerySet #getScrollY', () => {
    test.beforeEach(setup);

    getScrollYTests((nodes) => $(nodes).getScrollY());
});
