import { getHTMLTests, setup } from '#cases/attributes/attributes/get-html.js';
import { test } from '#test';

test.describe('QuerySet #getHTML', () => {
    test.beforeEach(setup);

    getHTMLTests((nodes) => $(nodes).getHTML());
});
