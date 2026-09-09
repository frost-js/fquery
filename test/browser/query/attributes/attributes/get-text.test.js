import { getTextTests, setup } from '#cases/attributes/attributes/get-text.js';
import { test } from '#test';

test.describe('QuerySet #getText', () => {
    test.beforeEach(setup);

    getTextTests((nodes) => $(nodes).getText());
});
