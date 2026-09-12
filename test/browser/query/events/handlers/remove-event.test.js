import { removeEventTests, setup } from '#cases/events/event-handlers/remove-event.js';
import { expect, test } from '#test';

test.describe('QuerySet #removeEvent', () => {
    test.beforeEach(setup);

    removeEventTests(() => (nodes, ...args) => {
        $(nodes).removeEvent(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('a');
            return query === query.removeEvent();
        })).toBe(true);
    });

    test.describe('node inputs', () => {
        test('removes listeners from forms with a control named removeEventListener', async ({ page }) => {
            expect(await page.evaluate((_) => {
                document.body.innerHTML = '<form><input name="removeEventListener"></form>';
                let result = 0;
                const callback = (_) => {
                    result++;
                };
                $('form').addEvent('click', callback);
                $('form').triggerEvent('click');
                $('form').removeEvent('click', callback);
                $('form').triggerEvent('click');
                return result;
            })).toBe(1);
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
                $(shadow).removeEvent('click', callback);
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
                $(document).removeEvent('click', callback);
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
                $(window).removeEvent('click', callback);
                window.dispatchEvent(event);
                return result;
            })).toBe(1);
        });
    });
});
