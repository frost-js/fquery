import { distToTests, setup } from '#cases/attributes/position/dist-to.js';
import { test } from '#test';

test.describe('QuerySet #distTo', () => {
    test.beforeEach(setup);

    distToTests(([nodes, ...args]) => $(nodes).distTo(...args));
});
