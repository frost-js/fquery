import { normalizeTests, setup } from '#cases/utility/utility/normalize.js';
import { expect, test } from '#test';

test.describe('QuerySet #normalize', () => {
    test.beforeEach(setup);

    normalizeTests(([nodes]) => {
        $(nodes).normalize();
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('.test');
            return query === query.normalize();
        })).toBe(true);
    });

    test.describe('node inputs', () => {
        test('works with DocumentFragment nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
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

                $(fragment).normalize();

                return fragment.childNodes.length;
            })).toBe(3);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
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

                $(shadow).normalize();

                return shadow.childNodes.length;
            })).toBe(3);
        });
    });
});
