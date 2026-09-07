import { expect, test } from '#test';
import { resetPage } from '../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#_isDocument', () => {
    test('recognizes documents containing a form named nodeType', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<form name="nodeType"></form>';
            return $._isDocument(document);
        })).toBe(true);
    });

    test('supports document stand-ins', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $._isDocument({ nodeType: Node.DOCUMENT_NODE }))).toBe(true);
        expect(await page.evaluate((_) => {
            const doc = Object.create(null);
            doc.nodeType = Node.DOCUMENT_NODE;
            return $._isDocument(doc);
        })).toBe(true);
    });

    test('returns false for non-document values', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $._isDocument(document.createElement('form')))).toBe(false);
        expect(await page.evaluate((_) =>
            $._isDocument(undefined))).toBe(false);
    });
});
