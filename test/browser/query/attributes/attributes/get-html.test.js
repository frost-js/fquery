import { getHtmlTests, setup } from '#cases/attributes/attributes/get-html.js';
import { test } from '#test';

test.describe('QuerySet #getHtml', () => {
    test.beforeEach(setup);

    getHtmlTests((nodes) => $(nodes).getHtml());
});
