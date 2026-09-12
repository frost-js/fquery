import { setup, unwrapTests } from '#cases/manipulation/wrap/unwrap.js';
import { expect, test } from '#test';

test.describe('#unwrap', () => {
    test.beforeEach(setup);

    unwrapTests(() => $.unwrap);

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.unwrap(document.getElementById('test1'), '#parent1');

                return document.body.innerHTML;
            });

            expect(html).toBe('<a href="#" id="test1">Test</a>' +
                '<a href="#" id="test2">Test</a>' +
                '<div id="parent2">' +
                '<a href="#" id="test3">Test</a>' +
                '<a href="#" id="test4">Test</a>' +
                '</div>');
        });

        test('works with NodeList nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.unwrap(document.querySelectorAll('a'), '#parent1');

                return document.body.innerHTML;
            });

            expect(html).toBe('<a href="#" id="test1">Test</a>' +
                '<a href="#" id="test2">Test</a>' +
                '<div id="parent2">' +
                '<a href="#" id="test3">Test</a>' +
                '<a href="#" id="test4">Test</a>' +
                '</div>');
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.unwrap(document.getElementById('parent1').children, '#parent1');

                return document.body.innerHTML;
            });

            expect(html).toBe('<a href="#" id="test1">Test</a>' +
                '<a href="#" id="test2">Test</a>' +
                '<div id="parent2">' +
                '<a href="#" id="test3">Test</a>' +
                '<a href="#" id="test4">Test</a>' +
                '</div>');
        });

        test('works with array nodes', async ({ page }) => {
            const html = await page.evaluate(() => {
                $.unwrap([
                    document.getElementById('test1'),
                    document.getElementById('test2'),
                    document.getElementById('test3'),
                    document.getElementById('test4'),
                ], '#parent1');

                return document.body.innerHTML;
            });

            expect(html).toBe('<a href="#" id="test1">Test</a>' +
                '<a href="#" id="test2">Test</a>' +
                '<div id="parent2">' +
                '<a href="#" id="test3">Test</a>' +
                '<a href="#" id="test4">Test</a>' +
                '</div>');
        });
    });
});
