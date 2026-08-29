import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#normalize', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="parent1" class="test">' +
                '<div id="child1"></div>' +
                '</div>' +
                '<div id="parent2" class="test">' +
                '<div id="child2"></div>' +
                '</div>';
            const child1 = document.getElementById('child1');
            const child2 = document.getElementById('child2');
            const text1 = document.createTextNode('Test 1');
            const text2 = document.createTextNode('Test 2');
            const text3 = document.createTextNode('Test 3');
            const text4 = document.createTextNode('Test 4');
            const text5 = document.createTextNode('Test 5');
            const text6 = document.createTextNode('Test 6');
            const text7 = document.createTextNode('Test 7');
            const text8 = document.createTextNode('Test 8');
            const span1 = document.createElement('span');
            const span2 = document.createElement('span');

            child1.appendChild(text1);
            child1.appendChild(text2);
            child1.appendChild(span1);
            child1.appendChild(text3);
            child1.appendChild(text4);

            child2.appendChild(text5);
            child2.appendChild(text6);
            child2.appendChild(span2);
            child2.appendChild(text7);
            child2.appendChild(text8);
        });
    });

    test('normalizes all text nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.normalize('.test');
            return [
                document.getElementById('child1').childNodes.length,
                document.getElementById('child2').childNodes.length,
            ];
        })).toEqual([
            3,
            3,
        ]);
    });

    test('retains HTML contents', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.normalize('.test');
            return document.body.innerHTML;
        })).toBe('<div id="parent1" class="test">' +
            '<div id="child1">' +
            'Test 1Test 2<span></span>Test 3Test 4' +
            '</div>' +
            '</div>' +
            '<div id="parent2" class="test">' +
            '<div id="child2">' +
            'Test 5Test 6<span></span>Test 7Test 8' +
            '</div>' +
            '</div>');
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.normalize(
                document.getElementById('parent1'),
            );
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
        expect(await page.evaluate((_) => {
            $.normalize(
                document.querySelectorAll('.test'),
            );
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
        expect(await page.evaluate((_) => {
            $.normalize(
                document.body.children,
            );
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

            $.normalize(fragment);

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

            $.normalize(shadow);

            return shadow.childNodes.length;
        })).toBe(3);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
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
