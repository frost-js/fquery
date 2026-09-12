import { addEventOnceTests, setup } from '#cases/events/event-handlers/add-event-once.js';
import { expect, test } from '#test';

test.describe('QuerySet #addEventOnce', () => {
    test.beforeEach(setup);

    addEventOnceTests(([nodes, ...args]) => {
        $(nodes).addEventOnce(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('a');
            return query === query.addEventOnce('click', (_) => null);
        })).toBe(true);
    });

    test.describe('handler lifecycle', () => {
        test('preserves persistent handlers with the same callback', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event = new Event('click');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const callback = (_) => {
                    result++;
                };
                $('a').addEvent('click', callback);
                $('a').addEventOnce('click', callback);
                element1.dispatchEvent(event);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element2.dispatchEvent(event);
                return result;
            })).toBe(6);
        });
    });

    test.describe('capture', () => {
        test('does not capture events', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event = new Event('click');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                $(document)
                        .addEventOnce('click', (_) => {
                            result++;
                        });
                element1.dispatchEvent(event);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element2.dispatchEvent(event);
                return result;
            })).toBe(0);
        });

        test('works with capture', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event = new Event('click');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                $(document)
                        .addEventOnce('click', (_) => {
                            result++;
                        }, { capture: true });
                element1.dispatchEvent(event);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element2.dispatchEvent(event);
                return result;
            })).toBe(1);
        });
    });

    test.describe('node inputs', () => {
        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event = new Event('click');
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                $(shadow)
                        .addEventOnce('click', (_) => {
                            result++;
                        });
                shadow.dispatchEvent(event);
                shadow.dispatchEvent(event);
                return result;
            })).toBe(1);
        });

        test('works with Document nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event = new Event('click');
                $(document)
                        .addEventOnce('click', (_) => {
                            result++;
                        });
                document.dispatchEvent(event);
                document.dispatchEvent(event);
                return result;
            })).toBe(1);
        });

        test('works with Window nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event = new Event('click');
                $(window)
                        .addEventOnce('click', (_) => {
                            result++;
                        });
                window.dispatchEvent(event);
                window.dispatchEvent(event);
                return result;
            })).toBe(1);
        });
    });
});
