import { getValueTests, setup } from '#cases/attributes/attributes/get-value.js';
import { test } from '#test';

test.describe('QuerySet #getValue', () => {
    test.beforeEach(setup);

    getValueTests((nodes) => $(nodes).getValue());
});
