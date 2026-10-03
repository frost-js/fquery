import { serializeTests, setup } from '#cases/utility/utility/serialize.js';
import { expect, test } from '#test';

test.describe('#serialize', () => {
    test.beforeEach(setup);

    serializeTests((nodes) => $.serialize(nodes));

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.serialize(
                    document.getElementById('form'),
                ))).toBe('test1=Test%201&test2=2&test3=Test%203&test4=42&test5%5B%5D=51&test5%5B%5D=52&test6=Test%206&test8=Test%208b&test9%5B%5D=Test%209a&test9%5B%5D=Test%209b');
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.serialize(
                    document.querySelectorAll('input, textarea, select'),
                ))).toBe('test1=Test%201&test2=2&test3=Test%203&test4=42&test5%5B%5D=51&test5%5B%5D=52&test6=Test%206&test8=Test%208b&test9%5B%5D=Test%209a&test9%5B%5D=Test%209b');
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.serialize(
                    document.body.children,
                ))).toBe('test1=Test%201&test2=2&test3=Test%203&test4=42&test5%5B%5D=51&test5%5B%5D=52&test6=Test%206&test8=Test%208b&test9%5B%5D=Test%209a&test9%5B%5D=Test%209b');
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const range = document.createRange();
                const fragment = range.createContextualFragment(
                    document.body.innerHTML,
                );
                return $.serialize(fragment);
            })).toBe('test1=Test%201&test2=2&test3=Test%203&test4=42&test5%5B%5D=51&test5%5B%5D=52&test6=Test%206&test8=Test%208b&test9%5B%5D=Test%209a&test9%5B%5D=Test%209b');
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                const range = document.createRange();
                const fragment = range.createContextualFragment(
                    document.body.innerHTML,
                );
                shadow.appendChild(fragment);
                return $.serialize(shadow);
            })).toBe('test1=Test%201&test2=2&test3=Test%203&test4=42&test5%5B%5D=51&test5%5B%5D=52&test6=Test%206&test8=Test%208b&test9%5B%5D=Test%209a&test9%5B%5D=Test%209b');
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate(() =>
                $.serialize([
                    document.getElementById('test1'),
                    document.getElementById('test2'),
                    document.getElementById('test3'),
                    document.getElementById('test4'),
                    document.getElementById('test5'),
                    document.getElementById('test6'),
                    document.getElementById('test7'),
                    document.getElementById('test8a'),
                    document.getElementById('test8b'),
                    document.getElementById('test9a'),
                    document.getElementById('test9b'),
                ]))).toBe('test1=Test%201&test2=2&test3=Test%203&test4=42&test5%5B%5D=51&test5%5B%5D=52&test6=Test%206&test8=Test%208b&test9%5B%5D=Test%209a&test9%5B%5D=Test%209b');
        });
    });
});
