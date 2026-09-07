import { expect, test } from '#test';
import { resetPage } from '../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#_isNode', () => {
    test('recognizes forms with a control named nodeType', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<form><input name="nodeType"></form>';
            return $._isNode(document.querySelector('form'));
        })).toBe(true);
    });

    test('recognizes text and comment nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $._isNode(document.createTextNode('Test')))).toBe(true);
        expect(await page.evaluate((_) =>
            $._isNode(document.createComment('Test')))).toBe(true);
    });

    test('returns false for documents and fragments', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $._isNode(document))).toBe(false);
        expect(await page.evaluate((_) =>
            $._isNode(document.createDocumentFragment()))).toBe(false);
        expect(await page.evaluate((_) =>
            $._isNode(document.createElement('div').attachShadow({ mode: 'open' })))).toBe(false);
    });
});
