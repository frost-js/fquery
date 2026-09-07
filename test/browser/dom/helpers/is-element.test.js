import { expect, test } from '#test';
import { resetPage } from '../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#_isElement', () => {
    test('recognizes forms with a control named nodeType', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<form><input name="nodeType"></form>';
            return $._isElement(document.querySelector('form'));
        })).toBe(true);
    });

    test('recognizes iframe forms with a control whose id is nodeType', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<iframe></iframe>';
            const doc = document.querySelector('iframe').contentDocument;
            doc.body.innerHTML = '<form><input id="nodeType"></form>';
            return $._isElement(doc.querySelector('form'));
        })).toBe(true);
    });

    test('returns false for non-element values', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $._isElement(document))).toBe(false);
        expect(await page.evaluate((_) =>
            $._isElement(null))).toBe(false);
        expect(await page.evaluate((_) =>
            $._isElement('div'))).toBe(false);
        expect(await page.evaluate((_) =>
            $._isElement(Object.create(null)))).toBe(false);
    });
});
