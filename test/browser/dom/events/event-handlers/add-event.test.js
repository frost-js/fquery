import { addEventTests, setup } from '#cases/events/event-handlers/add-event.js';
import { expect, test } from '#test';

test.describe('#addEvent', () => {
    test.beforeEach(setup);

    addEventTests(() => $.addEvent);

    test.describe('node inputs', () => {
        test('adds listeners on forms with a control named addEventListener', async ({ page }) => {
            expect(await page.evaluate((_) => {
                document.body.innerHTML = '<form><input name="addEventListener"></form>';
                let result = 0;
                const callback = (_) => {
                    result++;
                };
                $.addEvent('form', 'click', callback);
                document.querySelector('form').dispatchEvent(new Event('click'));
                return result;
            })).toBe(1);
        });

        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event = new Event('click');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                $.addEvent(element1, 'click', (_) => {
                    result++;
                });
                element1.dispatchEvent(event);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element2.dispatchEvent(event);
                return result;
            })).toBe(2);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event = new Event('click');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                $.addEvent(
                    document.querySelectorAll('a'),
                    'click',
                    (_) => {
                        result++;
                    },
                );
                element1.dispatchEvent(event);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element2.dispatchEvent(event);
                return result;
            })).toBe(4);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event = new Event('click');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                $.addEvent(
                    document.body.children,
                    'click',
                    (_) => {
                        result++;
                    },
                );
                element1.dispatchEvent(event);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element2.dispatchEvent(event);
                return result;
            })).toBe(4);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                const event = new Event('click');
                $.addEvent(shadow, 'click', (_) => {
                    result++;
                });
                shadow.dispatchEvent(event);
                shadow.dispatchEvent(event);
                return result;
            })).toBe(2);
        });

        test('works with Document nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event = new Event('click');
                $.addEvent(document, 'click', (_) => {
                    result++;
                });
                document.dispatchEvent(event);
                document.dispatchEvent(event);
                return result;
            })).toBe(2);
        });

        test('works with Window nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event = new Event('click');
                $.addEvent(window, 'click', (_) => {
                    result++;
                });
                window.dispatchEvent(event);
                window.dispatchEvent(event);
                return result;
            })).toBe(2);
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event = new Event('click');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                $.addEvent(
                    [
                        element1,
                        element2,
                    ],
                    'click',
                    (_) => {
                        result++;
                    },
                );
                element1.dispatchEvent(event);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element2.dispatchEvent(event);
                return result;
            })).toBe(4);
        });
    });
});
