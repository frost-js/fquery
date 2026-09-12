import { expect, test } from '#test';

test.describe('QuerySet #addEventDelegate', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="parent1">' +
                '<a href="#" id="test1">Test</a>' +
                '<span>' +
                '<a href="#" id="test2">Test</a>' +
                '</span>' +
                '</div>' +
                '<div id="parent2">' +
                '<a href="#" id="test3">Test</a>' +
                '<span>' +
                '<a href="#" id="test4">Test</a>' +
                '</span>' +
                '</div>';
        });
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return query === query.addEventDelegate('click', 'a', (_) => null);
        })).toBe(true);
    });

    test.describe('registration', () => {
        test('adds a delegated event to each node', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event = new Event('click', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $('div')
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

        test('adds delegated events to each node', async ({ page }) => {
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
                $('div')
                        .addEventDelegate('click hover', 'a', (_) => {
                            result++;
                        });
                element1.dispatchEvent(event1);
                element1.dispatchEvent(event1);
                element1.dispatchEvent(event2);
                element1.dispatchEvent(event2);
                element2.dispatchEvent(event1);
                element2.dispatchEvent(event1);
                element2.dispatchEvent(event2);
                element2.dispatchEvent(event2);
                element3.dispatchEvent(event1);
                element3.dispatchEvent(event1);
                element3.dispatchEvent(event2);
                element3.dispatchEvent(event2);
                element4.dispatchEvent(event1);
                element4.dispatchEvent(event1);
                element4.dispatchEvent(event2);
                element4.dispatchEvent(event2);
                return result;
            })).toBe(16);
        });
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
                $('div').addEventDelegate('click', 'div:scope > a', (_) => {
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
                $('div').addEventDelegate('click', ':is(:scope > a)', (_) => {
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
                $(window).addEventDelegate('click', ':scope > body > div > a', (_) => {
                    result++;
                });
                element.dispatchEvent(event);
                element.dispatchEvent(event);
                return result;
            })).toBe(2);
        });
    });

    test.describe('namespaces', () => {
        test('adds a namespaced delegated event to each node', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event = new Event('click', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $('div')
                        .addEventDelegate('click.test', 'a', (_) => {
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

        test('adds namespaced delegated events to each node', async ({ page }) => {
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
                $('div')
                        .addEventDelegate('click.test hover.test', 'a', (_) => {
                            result++;
                        });
                element1.dispatchEvent(event1);
                element1.dispatchEvent(event1);
                element1.dispatchEvent(event2);
                element1.dispatchEvent(event2);
                element2.dispatchEvent(event1);
                element2.dispatchEvent(event1);
                element2.dispatchEvent(event2);
                element2.dispatchEvent(event2);
                element3.dispatchEvent(event1);
                element3.dispatchEvent(event1);
                element3.dispatchEvent(event2);
                element3.dispatchEvent(event2);
                element4.dispatchEvent(event1);
                element4.dispatchEvent(event1);
                element4.dispatchEvent(event2);
                element4.dispatchEvent(event2);
                return result;
            })).toBe(16);
        });

        test('adds a deep namespaced delegated event to each node', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const event = new Event('click', {
                    bubbles: true,
                });
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                const element3 = document.getElementById('test3');
                const element4 = document.getElementById('test4');
                $('div')
                        .addEventDelegate('click.test.deep', 'a', (_) => {
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

        test('adds deep namespaced delegated events to each node', async ({ page }) => {
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
                $('div')
                        .addEventDelegate('click.test.deep hover.test.deep', 'a', (_) => {
                            result++;
                        });
                element1.dispatchEvent(event1);
                element1.dispatchEvent(event1);
                element1.dispatchEvent(event2);
                element1.dispatchEvent(event2);
                element2.dispatchEvent(event1);
                element2.dispatchEvent(event1);
                element2.dispatchEvent(event2);
                element2.dispatchEvent(event2);
                element3.dispatchEvent(event1);
                element3.dispatchEvent(event1);
                element3.dispatchEvent(event2);
                element3.dispatchEvent(event2);
                element4.dispatchEvent(event1);
                element4.dispatchEvent(event1);
                element4.dispatchEvent(event2);
                element4.dispatchEvent(event2);
                return result;
            })).toBe(16);
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
                $(parent).addEventDelegate('click', 'a', (_) => null);
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
                $(parent).addEventDelegate('click', 'a', (_) => null);
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
                $(parent)
                        .addEventDelegate('click', 'a', (_) => null)
                        .addEvent('click', (_) => null);
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
                $(parent)
                        .addEventDelegate('click', 'a', (_) => {
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
                $(parent)
                        .addEventDelegate('click', 'a', (_) => {
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
                $('div')
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
                $('div')
                        .addEventDelegate('click', 'a', (_) => {
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
