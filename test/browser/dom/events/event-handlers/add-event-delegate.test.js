import { addEventDelegateTests, setup } from '#cases/events/event-handlers/add-event-delegate.js';
import { expect, test } from '#test';

test.describe('#addEventDelegate', () => {
    test.beforeEach(setup);

    addEventDelegateTests((args) => {
        $.addEventDelegate(...args);
    });

    test.describe('scoped selectors', () => {
        test('matches compound scoped selectors', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event = new Event('click', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegate('div', 'click', 'div:scope > a', (_) => {
                    result++;
                });
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element3.dispatchEvent(event);
                element4.dispatchEvent(event);
                return result;
            })).toBe(2);
        });

        test('matches nested scoped selectors', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event = new Event('click', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegate('div', 'click', ':is(:scope > a)', (_) => {
                    result++;
                });
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element3.dispatchEvent(event);
                element4.dispatchEvent(event);
                return result;
            })).toBe(2);
        });

        test('works with Window nodes and scoped selectors', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event = new Event('click', {
                    bubbles: true,
                });
                const element = document.getElementById('test1');
                $.addEventDelegate(window, 'click', ':scope > body > div > a', (_) => {
                    result++;
                });
                element.dispatchEvent(event);
                element.dispatchEvent(event);
                return result;
            })).toBe(2);
        });
    });

    test.describe('event property restoration', () => {
        test('restores currentTarget for later native listeners', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = false;
                const event = new Event('click', {
                    bubbles: true,
                });
                const parent = document.getElementById('parent1');
                const element = document.getElementById('test1');
                $.addEventDelegate(parent, 'click', 'a', (_) => null);
                parent.addEventListener('click', (e) => {
                    result = e.currentTarget === parent;
                });
                element.dispatchEvent(event);
                return result;
            })).toBe(true);
        });

        test('removes delegateTarget for later native listeners', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = false;
                const event = new Event('click', {
                    bubbles: true,
                });
                const parent = document.getElementById('parent1');
                const element = document.getElementById('test1');
                $.addEventDelegate(parent, 'click', 'a', (_) => null);
                parent.addEventListener('click', (e) => {
                    result = e.delegateTarget === undefined;
                });
                element.dispatchEvent(event);
                return result;
            })).toBe(true);
        });

        test('restores currentTarget as the event bubbles', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = false;
                const event = new Event('click', {
                    bubbles: true,
                });
                const parent = document.getElementById('parent1');
                const element = document.getElementById('test1');
                $.addEventDelegate(parent, 'click', 'a', (_) => null);
                $.addEvent(parent, 'click', (_) => null);
                document.body.addEventListener('click', (e) => {
                    result = e.currentTarget === document.body;
                });
                element.dispatchEvent(event);
                return result;
            })).toBe(true);
        });

        test('restores currentTarget when a delegated callback throws', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = false;
                const event = new Event('click', {
                    bubbles: true,
                });
                const parent = document.getElementById('parent1');
                const element = document.getElementById('test1');
                window.addEventListener('error', (e) => {
                    e.preventDefault();
                }, { once: true });
                $.addEventDelegate(parent, 'click', 'a', (_) => {
                    throw new Error('Test error');
                });
                parent.addEventListener('click', (e) => {
                    result = e.currentTarget === parent;
                });
                element.dispatchEvent(event);
                return result;
            })).toBe(true);
        });

        test('removes delegateTarget when a delegated callback throws', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = false;
                const event = new Event('click', {
                    bubbles: true,
                });
                const parent = document.getElementById('parent1');
                const element = document.getElementById('test1');
                window.addEventListener('error', (e) => {
                    e.preventDefault();
                }, { once: true });
                $.addEventDelegate(parent, 'click', 'a', (_) => {
                    throw new Error('Test error');
                });
                parent.addEventListener('click', (e) => {
                    result = e.delegateTarget === undefined;
                });
                element.dispatchEvent(event);
                return result;
            })).toBe(true);
        });
    });

    test.describe('capture', () => {
        test('does not capture events', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event = new Event('click');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegate('div', 'click', 'a', (_) => {
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
            })).toBe(0);
        });

        test('works with capture', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event = new Event('click');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegate('div', 'click', 'a', (_) => {
                    result++;
                }, { capture: true });
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
    });

    test.describe('node inputs', () => {
        test('matches form targets with a control named matches', async ({ page }) => {
            expect(await page.evaluate((_) => {
                document.body.innerHTML = '<form><input name="matches"></form>';
                let result = 0;
                const callback = (_) => {
                    result++;
                };
                $.addEventDelegate('body', 'click', 'form', callback);
                document.querySelector('form').dispatchEvent(new Event('click', {
                    bubbles: true,
                }));
                return result;
            })).toBe(1);
        });

        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event = new Event('click', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegate(
                    document.getElementById('parent1'),
                    'click',
                    'a',
                    (_) => {
                        result++;
                    },
                );
                element1.dispatchEvent(event);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                element2.dispatchEvent(event);
                element3.dispatchEvent(event);
                element3.dispatchEvent(event);
                element4.dispatchEvent(event);
                element4.dispatchEvent(event);
                return result;
            })).toBe(4);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event = new Event('click', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegate(
                    document.querySelectorAll('div'),
                    'click',
                    'a',
                    (_) => {
                        result++;
                    },
                );
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

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event = new Event('click', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegate(
                    document.body.children,
                    'click',
                    'a',
                    (_) => {
                        result++;
                    },
                );
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
                $.addEventDelegate(shadow, 'click', 'a', (_) => {
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
                $.addEventDelegate(document, 'click', 'a', (_) => {
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
                $.addEventDelegate(window, 'click', 'span', (_) => {
                    result++;
                });
                element.dispatchEvent(event);
                element.dispatchEvent(event);
                return result;
            })).toBe(2);
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event = new Event('click', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $.addEventDelegate(
                    [
                        document.getElementById('parent1'),
                        document.getElementById('parent2'),
                    ],
                    'click',
                    'a',
                    (_) => {
                        result++;
                    },
                );
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
    });
});
