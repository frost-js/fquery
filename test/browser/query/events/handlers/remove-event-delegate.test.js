import { removeEventDelegateTests, setup } from '#cases/events/event-handlers/remove-event-delegate.js';
import { expect, test } from '#test';

test.describe('QuerySet #removeEventDelegate', () => {
    test.beforeEach(setup);

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('a');
            return query === query.removeEventDelegate(null, 'a');
        })).toBe(true);
    });

    test.describe('event types and handlers', () => {
        test('removes all delegated events from each node', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event1 = new Event('click', {
                    bubbles: true,
                });
                const event2 = new Event('hover', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegate('div', 'click', 'a', (_) => {
                    result++;
                });
                $.addEventDelegate('div', 'click hover', 'a', (_) => {
                    result++;
                });
                $('div').removeEventDelegate(null, 'a');
                element1.dispatchEvent(event1);
                element1.dispatchEvent(event2);
                element2.dispatchEvent(event1);
                element2.dispatchEvent(event2);
                element3.dispatchEvent(event1);
                element3.dispatchEvent(event2);
                element4.dispatchEvent(event1);
                element4.dispatchEvent(event2);
                return result;
            })).toBe(0);
        });

        test('removes all delegated events of a type from each node', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event1 = new Event('click', {
                    bubbles: true,
                });
                const event2 = new Event('hover', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegate('div', 'click', 'a', (_) => {
                    result++;
                });
                $.addEventDelegate('div', 'click hover', 'a', (_) => {
                    result++;
                });
                $('div').removeEventDelegate('click', 'a');
                element1.dispatchEvent(event1);
                element1.dispatchEvent(event2);
                element2.dispatchEvent(event1);
                element2.dispatchEvent(event2);
                element3.dispatchEvent(event1);
                element3.dispatchEvent(event2);
                element4.dispatchEvent(event1);
                element4.dispatchEvent(event2);
                return result;
            })).toBe(4);
        });

        test('removes all delegated events of types from each node', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event1 = new Event('click', {
                    bubbles: true,
                });
                const event2 = new Event('hover', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegate('div', 'click', 'a', (_) => {
                    result++;
                });
                $.addEventDelegate('div', 'click hover', 'a', (_) => {
                    result++;
                });
                $('div').removeEventDelegate('click hover', 'a');
                element1.dispatchEvent(event1);
                element1.dispatchEvent(event2);
                element2.dispatchEvent(event1);
                element2.dispatchEvent(event2);
                element3.dispatchEvent(event1);
                element3.dispatchEvent(event2);
                element4.dispatchEvent(event1);
                element4.dispatchEvent(event2);
                return result;
            })).toBe(0);
        });

        test('removes a specific delegated event from each node', async ({ page }) => {
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
                $.addEventDelegate('div', 'click', 'a', callback);
                $.addEventDelegate('div', 'click', 'a', (_) => {
                    result++;
                });
                $('div').removeEventDelegate('click', 'a', callback);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element3.dispatchEvent(event);
                element4.dispatchEvent(event);
                return result;
            })).toBe(4);
        });

        test('does not remove a specific delegated event of the wrong type from each node', async ({ page }) => {
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
                $.addEventDelegate('div', 'click', 'a', callback);
                $.addEventDelegate('div', 'click', 'a', (_) => {
                    result++;
                });
                $('div').removeEventDelegate('hover', 'a', callback);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element3.dispatchEvent(event);
                element4.dispatchEvent(event);
                return result;
            })).toBe(8);
        });
    });

    removeEventDelegateTests(([nodes, ...args]) => {
        $(nodes).removeEventDelegate(...args);
    });

    test.describe('capture', () => {
        test('removes capture events', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event1 = new Event('click');
                const event2 = new Event('hover');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegate('div', 'click hover', 'a', (_) => {
                    result++;
                }, true);
                $('div').removeEventDelegate(null, 'a');
                element1.dispatchEvent(event1);
                element1.dispatchEvent(event2);
                element2.dispatchEvent(event1);
                element2.dispatchEvent(event2);
                element3.dispatchEvent(event1);
                element3.dispatchEvent(event2);
                element4.dispatchEvent(event1);
                element4.dispatchEvent(event2);
                return result;
            })).toBe(0);
        });

        test('works with capture', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event1 = new Event('click', {
                    bubbles: true,
                });
                const event2 = new Event('hover');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegate('div', 'click', 'a', (_) => {
                    result++;
                });
                $.addEventDelegate('div', 'hover', 'a', (_) => {
                    result++;
                }, { capture: true });
                $('div').removeEventDelegate(null, 'a', null, { capture: true });
                element1.dispatchEvent(event1);
                element1.dispatchEvent(event2);
                element2.dispatchEvent(event1);
                element2.dispatchEvent(event2);
                element3.dispatchEvent(event1);
                element3.dispatchEvent(event2);
                element4.dispatchEvent(event1);
                element4.dispatchEvent(event2);
                return result;
            })).toBe(4);
        });
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
