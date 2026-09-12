import { setup, triggerEventTests } from '#cases/events/event-handlers/trigger-event.js';
import { expect, test } from '#test';

test.describe('QuerySet #triggerEvent', () => {
    test.beforeEach(setup);

    triggerEventTests(([nodes, ...args]) => {
        $(nodes).triggerEvent(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('a');
            return query === query.triggerEvent('click');
        })).toBe(true);
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
                $('form').triggerEvent('click');
                return result;
            })).toBe(1);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                $.addEvent(shadow, 'click', (_) => {
                    result++;
                });
                $(shadow).triggerEvent('click');
                return result;
            })).toBe(1);
        });

        test('works with Document nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                $.addEvent(document, 'click', (_) => {
                    result++;
                });
                $(document).triggerEvent('click');
                return result;
            })).toBe(1);
        });

        test('works with Window nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                $.addEvent(window, 'click', (_) => {
                    result++;
                });
                $(window).triggerEvent('click');
                return result;
            })).toBe(1);
        });
    });
});
