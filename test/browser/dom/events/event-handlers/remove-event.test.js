import { removeEventTests, setup } from '#cases/events/event-handlers/remove-event.js';
import { expect, test } from '#test';

test.describe('#removeEvent', () => {
    test.beforeEach(setup);

    removeEventTests(() => $.removeEvent);

    test.describe('node inputs', () => {
        test('removes listeners from forms with a control named removeEventListener', async ({ page }) => {
            expect(await page.evaluate((_) => {
                document.body.innerHTML = '<form><input name="removeEventListener"></form>';
                let result = 0;
                const callback = (_) => {
                    result++;
                };
                $.addEvent('form', 'click', callback);
                $.triggerEvent('form', 'click');
                $.removeEvent('form', 'click', callback);
                $.triggerEvent('form', 'click');
                return result;
            })).toBe(1);
        });

        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const callback = (_) => {
                    result++;
                };
                const event = new Event('click');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                $.addEvent('a', 'click', callback);
                $.addEvent('a', 'click', (_) => {
                    result++;
                });
                $.removeEvent(element1, 'click', callback);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                return result;
            })).toBe(3);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const callback = (_) => {
                    result++;
                };
                const event = new Event('click');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                $.addEvent('a', 'click', callback);
                $.addEvent('a', 'click', (_) => {
                    result++;
                });
                $.removeEvent(document.querySelectorAll('a'), 'click', callback);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                return result;
            })).toBe(2);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const callback = (_) => {
                    result++;
                };
                const event = new Event('click');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                $.addEvent('a', 'click', callback);
                $.addEvent('a', 'click', (_) => {
                    result++;
                });
                $.removeEvent(document.body.children, 'click', callback);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                return result;
            })).toBe(2);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const callback = (_) => {
                    result++;
                };
                const event = new Event('click');
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                $.addEvent(shadow, 'click', callback);
                $.addEvent(shadow, 'click', (_) => {
                    result++;
                });
                $.removeEvent(shadow, 'click', callback);
                shadow.dispatchEvent(event);
                return result;
            })).toBe(1);
        });

        test('works with Document nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const callback = (_) => {
                    result++;
                };
                const event = new Event('click');
                $.addEvent(document, 'click', callback);
                $.addEvent(document, 'click', (_) => {
                    result++;
                });
                $.removeEvent(document, 'click', callback);
                document.dispatchEvent(event);
                return result;
            })).toBe(1);
        });

        test('works with Window nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const callback = (_) => {
                    result++;
                };
                const event = new Event('click');
                $.addEvent(window, 'click', callback);
                $.addEvent(window, 'click', (_) => {
                    result++;
                });
                $.removeEvent(window, 'click', callback);
                window.dispatchEvent(event);
                return result;
            })).toBe(1);
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const callback = (_) => {
                    result++;
                };
                const event = new Event('click');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                $.addEvent('a', 'click', callback);
                $.addEvent('a', 'click', (_) => {
                    result++;
                });
                $.removeEvent([
                    element1,
                    element2,
                ], 'click', callback);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                return result;
            })).toBe(2);
        });
    });
});
