import { getScrollXTests, setup } from '#cases/attributes/scroll/get-scroll-x.js';
import { test } from '#test';

test.describe('QuerySet #getScrollX', () => {
    test.beforeEach(setup);

    getScrollXTests((nodes) => $(nodes).getScrollX());
});
