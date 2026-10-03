import { normalizeTests, setup } from '#cases/utility/utility/normalize.js';
import { expect, test } from '#test';

test.describe('#normalize', () => {
    test.beforeEach(setup);

    normalizeTests((args) => {
        $.normalize(...args);
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.normalize(document.getElementById('parent1'));
                return [
                    document.getElementById('child1').childNodes.length,
                    document.getElementById('child2').childNodes.length,
                ];
            })).toEqual([
                3,
                5,
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.normalize(document.querySelectorAll('.test'));
                return [
                    document.getElementById('child1').childNodes.length,
                    document.getElementById('child2').childNodes.length,
                ];
            })).toEqual([
                3,
                3,
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.normalize(document.body.children);
                return [
                    document.getElementById('child1').childNodes.length,
                    document.getElementById('child2').childNodes.length,
                ];
            })).toEqual([
                3,
                3,
            ]);
        });

        test('works with DocumentFragment nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const fragment = document.createDocumentFragment();
                const text1 = document.createTextNode('Test 1');
                const text2 = document.createTextNode('Test 2');
                const text3 = document.createTextNode('Test 3');
                const text4 = document.createTextNode('Test 4');
                const span1 = document.createElement('span');

                fragment.appendChild(text1);
                fragment.appendChild(text2);
                fragment.appendChild(span1);
                fragment.appendChild(text3);
                fragment.appendChild(text4);

                $.normalize(fragment);

                return fragment.childNodes.length;
            })).toBe(3);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                const text1 = document.createTextNode('Test 1');
                const text2 = document.createTextNode('Test 2');
                const text3 = document.createTextNode('Test 3');
                const text4 = document.createTextNode('Test 4');
                const span1 = document.createElement('span');

                shadow.appendChild(text1);
                shadow.appendChild(text2);
                shadow.appendChild(span1);
                shadow.appendChild(text3);
                shadow.appendChild(text4);

                $.normalize(shadow);

                return shadow.childNodes.length;
            })).toBe(3);
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                $.normalize([
                    document.getElementById('parent1'),
                    document.getElementById('parent2'),
                ]);
                return [
                    document.getElementById('child1').childNodes.length,
                    document.getElementById('child2').childNodes.length,
                ];
            })).toEqual([
                3,
                3,
            ]);
        });
    });
});
