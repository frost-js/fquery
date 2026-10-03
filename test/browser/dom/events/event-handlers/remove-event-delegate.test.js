import { removeEventDelegateTests, setup } from '#cases/events/event-handlers/remove-event-delegate.js';
import { expect, test } from '#test';

test.describe('#removeEventDelegate', () => {
    test.beforeEach(setup);

    removeEventDelegateTests(() => $.removeEventDelegate);

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result = 0;
                const callback = () => {
                    result++;
                };
                const event = new Event('click', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegate('div', 'click', 'a', callback);
                $.addEventDelegate('div', 'click', 'a', () => {
                    result++;
                });
                $.removeEventDelegate(document.getElementById('parent1'), 'click', 'a', callback);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element3.dispatchEvent(event);
                element4.dispatchEvent(event);
                return result;
            })).toBe(6);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result = 0;
                const callback = () => {
                    result++;
                };
                const event = new Event('click', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegate('div', 'click', 'a', callback);
                $.addEventDelegate('div', 'click', 'a', () => {
                    result++;
                });
                $.removeEventDelegate(document.querySelectorAll('div'), 'click', 'a', callback);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element3.dispatchEvent(event);
                element4.dispatchEvent(event);
                return result;
            })).toBe(4);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result = 0;
                const callback = () => {
                    result++;
                };
                const event = new Event('click', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegate('div', 'click', 'a', callback);
                $.addEventDelegate('div', 'click', 'a', () => {
                    result++;
                });
                $.removeEventDelegate(document.body.children, 'click', 'a', callback);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element3.dispatchEvent(event);
                element4.dispatchEvent(event);
                return result;
            })).toBe(4);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result = 0;
                const callback = () => {
                    result++;
                };
                const event = new Event('click', {
                    bubbles: true,
                });
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                const a = document.createElement('a');
                shadow.appendChild(a);
                $.addEventDelegate(shadow, 'click', 'a', callback);
                $.addEventDelegate(shadow, 'click', 'a', () => {
                    result++;
                });
                $.removeEventDelegate(shadow, 'click', 'a', callback);
                a.dispatchEvent(event);
                return result;
            })).toBe(1);
        });

        test('works with Document nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result = 0;
                const callback = () => {
                    result++;
                };
                const event = new Event('click', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegate(document, 'click', 'a', callback);
                $.addEventDelegate(document, 'click', 'a', () => {
                    result++;
                });
                $.removeEventDelegate(document, 'click', 'a', callback);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element3.dispatchEvent(event);
                element4.dispatchEvent(event);
                return result;
            })).toBe(4);
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result = 0;
                const callback = () => {
                    result++;
                };
                const event = new Event('click', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegate('div', 'click', 'a', callback);
                $.addEventDelegate('div', 'click', 'a', () => {
                    result++;
                });
                $.removeEventDelegate([
                    document.getElementById('parent1'),
                    document.getElementById('parent2'),
                ], 'click', 'a', callback);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element3.dispatchEvent(event);
                element4.dispatchEvent(event);
                return result;
            })).toBe(4);
        });
    });
});
