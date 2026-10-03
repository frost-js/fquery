import { addEventDelegateTests, setup } from '#cases/events/event-handlers/add-event-delegate.js';
import { expect, test } from '#test';

test.describe('#addEventDelegate', () => {
    test.beforeEach(setup);

    addEventDelegateTests(() => $.addEventDelegate);

    test.describe('scoped selectors', () => {
        test('works with Window nodes and scoped selectors', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result = 0;
                const event = new Event('click', {
                    bubbles: true,
                });
                const element = document.getElementById('test1');
                $.addEventDelegate(window, 'click', ':scope > body > div > a', () => {
                    result++;
                });
                element.dispatchEvent(event);
                element.dispatchEvent(event);
                return result;
            })).toBe(2);
        });
    });

    test.describe('node inputs', () => {
        test('matches form targets with a control named matches', async ({ page }) => {
            expect(await page.evaluate(() => {
                document.body.innerHTML = '<form><input name="matches"></form>';
                let result = 0;
                const callback = () => {
                    result++;
                };
                $.addEventDelegate('body', 'click', 'form', callback);
                document.querySelector('form').dispatchEvent(new Event('click', {
                    bubbles: true,
                }));
                return result;
            })).toBe(1);
        });

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
                $.addEventDelegate(
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
            })).toBe(4);
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
                $.addEventDelegate(
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
            })).toBe(8);
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
                $.addEventDelegate(
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
            })).toBe(8);
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
                $.addEventDelegate(shadow, 'click', 'a', () => {
                    result++;
                });
                a.dispatchEvent(event);
                a.dispatchEvent(event);
                return result;
            })).toBe(2);
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
                $.addEventDelegate(document, 'click', 'a', () => {
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
            })).toBe(8);
        });

        test('works with Window nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result = 0;
                const event = new Event('click', {
                    bubbles: true,
                });
                const element = document.getElementById('test2');
                $.addEventDelegate(window, 'click', 'span', () => {
                    result++;
                });
                element.dispatchEvent(event);
                element.dispatchEvent(event);
                return result;
            })).toBe(2);
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
                $.addEventDelegate(
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
            })).toBe(8);
        });
    });
});
