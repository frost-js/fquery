import { removeEventDelegateTests, setup } from '#cases/events/event-handlers/remove-event-delegate.js';
import { expect, test } from '#test';

test.describe('QuerySet #removeEventDelegate', () => {
    test.beforeEach(setup);

    removeEventDelegateTests(() => (nodes, ...args) => {
        $(nodes).removeEventDelegate(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('a');
            return query === query.removeEventDelegate(null, 'a');
        })).toBe(true);
    });

    test.describe('node inputs', () => {
        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const callback = (_) => {
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
                $.addEventDelegate(shadow, 'click', 'a', (_) => {
                    result++;
                });
                $(shadow).removeEventDelegate('click', 'a', callback);
                a.dispatchEvent(event);
                return result;
            })).toBe(1);
        });

        test('works with Document nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const callback = (_) => {
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
                $.addEventDelegate(document, 'click', 'a', (_) => {
                    result++;
                });
                $(document).removeEventDelegate('click', 'a', callback);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element3.dispatchEvent(event);
                element4.dispatchEvent(event);
                return result;
            })).toBe(4);
        });
    });
});
