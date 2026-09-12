import { addEventDelegateOnceTests, setup } from '#cases/events/event-handlers/add-event-delegate-once.js';
import { expect, test } from '#test';

test.describe('QuerySet #addEventDelegateOnce', () => {
    test.beforeEach(setup);

    addEventDelegateOnceTests(() => (nodes, ...args) => {
        $(nodes).addEventDelegateOnce(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return query === query.addEventDelegateOnce('click', 'a', (_) => null);
        })).toBe(true);
    });

    test.describe('node inputs', () => {
        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event = new Event('click', {
                    bubbles: true,
                });
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                const a = document.createElement('a');
                shadow.appendChild(a);
                $(shadow)
                        .addEventDelegateOnce('click', 'a', (_) => {
                            result++;
                        });
                a.dispatchEvent(event);
                a.dispatchEvent(event);
                return result;
            })).toBe(1);
        });

        test('works with Document nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event = new Event('click', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $(document)
                        .addEventDelegateOnce('click', 'a', (_) => {
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
    });
});
