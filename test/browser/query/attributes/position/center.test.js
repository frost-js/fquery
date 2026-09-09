import { centerTests, setup } from '#cases/attributes/position/center.js';
import { test } from '#test';

test.describe('QuerySet #center', () => {
    test.beforeEach(setup);

    centerTests(([nodes, ...args]) => $(nodes).center(...args));
});
