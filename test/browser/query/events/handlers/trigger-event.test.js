import { setup, triggerEventTests } from '#cases/events/event-handlers/trigger-event.js';
import { expect, test } from '#test';

test.describe('QuerySet #triggerEvent', () => {
    test.beforeEach(setup);

    triggerEventTests(([nodes, ...args]) => {
        $(nodes).triggerEvent(...args);
    });

    test('triggers an event for each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click', (_) => {
                result++;
            });
            $('a').triggerEvent('click');
            return result;
        })).toBe(2);
    });

    test('triggers events for each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click hover', (_) => {
                result++;
            });
            $('a').triggerEvent('click hover');
            return result;
        })).toBe(4);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('a');
            return query === query.triggerEvent('click');
        })).toBe(true);
    });

    test.describe('event properties', () => {
        test('triggers an event for each node with custom data', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                $.addEvent('a', 'click', (e) => {
                    if (e.test) {
                        result++;
                    }
                });
                $('a')
                        .triggerEvent('click')
                        .triggerEvent('click', {
                            data: {
                                test: true,
                            },
                        });
                return result;
            })).toBe(2);
        });

        test('triggers an event for each node with custom details', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                $.addEvent('a', 'click', (e) => {
                    if (e.detail === 'test') {
                        result++;
                    }
                });
                $('a')
                        .triggerEvent('click')
                        .triggerEvent('click', {
                            detail: 'test',
                        });
                return result;
            })).toBe(2);
        });
    });

    test.describe('propagation', () => {
        test('bubbles to other event listeners', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                $.addEvent('#div1', 'click', (_) => {
                    result++;
                });
                $('a').triggerEvent('click');
                return result;
            })).toBe(2);
        });

        test('can be prevented from bubbling', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                $.addEvent('#div1', 'click', (_) => {
                    result++;
                });
                $('a')
                        .triggerEvent('click', {
                            bubbles: false,
                        });
                return result;
            })).toBe(0);
        });
    });

    test.describe('cancellation', () => {
        test('can be cancelled', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result;
                $.addEvent('#test1', 'click', (e) => {
                    result = e.cancelable;
                });
                $('#test1').triggerEvent('click');
                return result;
            })).toBe(true);
        });

        test('does not carry cancellation between nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result;
                $.addEvent('#test1', 'click', (e) => {
                    e.preventDefault();
                });
                $.addEvent('#test2', 'click', (e) => {
                    result = e.defaultPrevented;
                });
                $('a').triggerEvent('click');
                return result;
            })).toBe(false);
        });

        test('can be prevented from being cancelled', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result;
                $.addEvent('#test1', 'click', (e) => {
                    result = e.cancelable;
                });
                $('#test1')
                        .triggerEvent('click', {
                            cancelable: false,
                        });
                return result;
            })).toBe(false);
        });
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
