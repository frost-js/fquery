import { getValueTests } from '#cases/attributes/attributes/get-value.js';
import { test } from '#test';

test.describe('QuerySet #getValue', () => {
    getValueTests((nodes) => $(nodes).getValue());
});
