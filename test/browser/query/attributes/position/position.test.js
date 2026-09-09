import { positionTests, setup } from '#cases/attributes/position/position.js';
import { test } from '#test';

test.describe('QuerySet #position', () => {
    test.beforeEach(setup);

    positionTests(([nodes, ...args]) => $(nodes).position(...args));
});
