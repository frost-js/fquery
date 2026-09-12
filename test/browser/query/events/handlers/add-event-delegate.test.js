import { addEventDelegateTests, setup } from '#cases/events/event-handlers/add-event-delegate.js';
import { expect, test } from '#test';

test.describe('QuerySet #addEventDelegate', () => {
    test.beforeEach(setup);

    addEventDelegateTests(() => (nodes, ...args) => {
        $(nodes).addEventDelegate(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return query === query.addEventDelegate('click', 'a', (_) => null);
        })).toBe(true);
    });

    test.describe('scoped selectors', () => {
        test('works with Window nodes and scoped selectors', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event = new Event('click', {
                    bubbles: true,
                });
                const element = document.getElementById('test1');
                $(window).addEventDelegate('click', ':scope > body > div > a', (_) => {
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
            expect(await page.evaluate((_) => {
                document.body.innerHTML = '<form><input name="matches"></form>';
                let result = 0;
                const callback = (_) => {
                    result++;
                };
                $('body').addEventDelegate('click', 'form', callback);
                document.querySelector('form').dispatchEvent(new Event('click', {
                    bubbles: true,
                }));
                return result;
            })).toBe(1);
        });

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
                        .addEventDelegate('click', 'a', (_) => {
                            result++;
                        });
                a.dispatchEvent(event);
                a.dispatchEvent(event);
                return result;
            })).toBe(2);
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
                        .addEventDelegate('click', 'a', (_) => {
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
            expect(await page.evaluate((_) => {
                let result = 0;
                const event = new Event('click', {
                    bubbles: true,
                });
                const element = document.getElementById('test2');
                $(window).addEventDelegate('click', 'span', (_) => {
                    result++;
                });
                element.dispatchEvent(event);
                element.dispatchEvent(event);
                return result;
            })).toBe(2);
        });
    });
});
