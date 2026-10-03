import { addEventDelegateOnceTests, setup } from '#cases/events/event-handlers/add-event-delegate-once.js';
import { expect, test } from '#test';

test.describe('#addEventDelegateOnce', () => {
    test.beforeEach(setup);

    addEventDelegateOnceTests(() => $.addEventDelegateOnce);

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result = 0;
                const event = new Event('click', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegateOnce(
                    document.getElementById('parent1'),
                    'click',
                    'a',
                    () => {
                        result++;
                    },
                );
                element1.dispatchEvent(event);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element2.dispatchEvent(event);
                element3.dispatchEvent(event);
                element3.dispatchEvent(event);
                element4.dispatchEvent(event);
                element4.dispatchEvent(event);
                return result;
            })).toBe(1);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result = 0;
                const event = new Event('click', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegateOnce(
                    document.querySelectorAll('div'),
                    'click',
                    'a',
                    () => {
                        result++;
                    },
                );
                element1.dispatchEvent(event);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element2.dispatchEvent(event);
                element3.dispatchEvent(event);
                element3.dispatchEvent(event);
                element4.dispatchEvent(event);
                element4.dispatchEvent(event);
                return result;
            })).toBe(2);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result = 0;
                const event = new Event('click', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegateOnce(
                    document.body.children,
                    'click',
                    'a',
                    () => {
                        result++;
                    },
                );
                element1.dispatchEvent(event);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element2.dispatchEvent(event);
                element3.dispatchEvent(event);
                element3.dispatchEvent(event);
                element4.dispatchEvent(event);
                element4.dispatchEvent(event);
                return result;
            })).toBe(2);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result = 0;
                const event = new Event('click', {
                    bubbles: true,
                });
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                const a = document.createElement('a');
                shadow.appendChild(a);
                $.addEventDelegateOnce(shadow, 'click', 'a', () => {
                    result++;
                });
                a.dispatchEvent(event);
                a.dispatchEvent(event);
                return result;
            })).toBe(1);
        });

        test('works with Document nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result = 0;
                const event = new Event('click', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegateOnce(document, 'click', 'a', () => {
                    result++;
                });
                element1.dispatchEvent(event);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element2.dispatchEvent(event);
                element3.dispatchEvent(event);
                element3.dispatchEvent(event);
                element4.dispatchEvent(event);
                element4.dispatchEvent(event);
                return result;
            })).toBe(1);
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result = 0;
                const event = new Event('click', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegateOnce(
                    [
                        document.getElementById('parent1'),
                        document.getElementById('parent2'),
                    ],
                    'click',
                    'a',
                    () => {
                        result++;
                    },
                );
                element1.dispatchEvent(event);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element2.dispatchEvent(event);
                element3.dispatchEvent(event);
                element3.dispatchEvent(event);
                element4.dispatchEvent(event);
                element4.dispatchEvent(event);
                return result;
            })).toBe(2);
        });
    });
});
