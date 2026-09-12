import { setup, triggerEventTests } from '#cases/events/event-handlers/trigger-event.js';
import { expect, test } from '#test';

test.describe('#triggerEvent', () => {
    test.beforeEach(setup);

    triggerEventTests((args) => {
        $.triggerEvent(...args);
    });

    test.describe('node inputs', () => {
        test('triggers listeners on forms with a control named dispatchEvent', async ({ page }) => {
            expect(await page.evaluate((_) => {
                document.body.innerHTML = '<form><input name="dispatchEvent"></form>';
                let result = 0;
                const callback = (_) => {
                    result++;
                };
                $.addEvent('form', 'click', callback);
                $.triggerEvent('form', 'click');
                return result;
            })).toBe(1);
        });

        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                $.addEvent('a', 'click', (_) => {
                    result++;
                });
                $.triggerEvent(document.getElementById('test1'), 'click');
                return result;
            })).toBe(1);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                $.addEvent('a', 'click', (_) => {
                    result++;
                });
                $.triggerEvent(document.querySelectorAll('a'), 'click');
                return result;
            })).toBe(2);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                $.addEvent('a', 'click', (_) => {
                    result++;
                });
                $.triggerEvent(document.getElementById('div1').children, 'click');
                return result;
            })).toBe(2);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                $.addEvent(shadow, 'click', (_) => {
                    result++;
                });
                $.triggerEvent(shadow, 'click');
                return result;
            })).toBe(1);
        });

        test('works with Document nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                $.addEvent(document, 'click', (_) => {
                    result++;
                });
                $.triggerEvent(document, 'click');
                return result;
            })).toBe(1);
        });

        test('works with Window nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                $.addEvent(window, 'click', (_) => {
                    result++;
                });
                $.triggerEvent(window, 'click');
                return result;
            })).toBe(1);
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                $.addEvent('a', 'click', (_) => {
                    result++;
                });
                $.triggerEvent([
                    document.getElementById('test1'),
                    document.getElementById('test2'),
                ], 'click');
                return result;
            })).toBe(2);
        });
    });
});
