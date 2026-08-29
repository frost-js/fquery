import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #triggerEvent', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1">' +
                '<a href="#" id="test1">Test</a>' +
                '<a href="#" id="test2">Test</a>' +
                '</div>';
        });
    });

    test('triggers an event for each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click', (_) => {
                result++;
            });
            $('a')
                    .triggerEvent('click');
            return result;
        })).toBe(2);
    });

    test('triggers events for each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click hover', (_) => {
                result++;
            });
            $('a')
                    .triggerEvent('click hover');
            return result;
        })).toBe(4);
    });

    test('triggers a namespaced event for each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click.test', (_) => {
                result++;
            });
            $('a')
                    .triggerEvent('click');
            return result;
        })).toBe(2);
    });

    test('triggers namespaced events for each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click.test hover.test', (_) => {
                result++;
            });
            $('a')
                    .triggerEvent('click hover');
            return result;
        })).toBe(4);
    });

    test('triggers a deep namespaced event for each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click.test.deep', (_) => {
                result++;
            });
            $('a')
                    .triggerEvent('click');
            return result;
        })).toBe(2);
    });

    test('triggers deep namespaced events for each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click.test.deep hover.test.deep', (_) => {
                result++;
            });
            $('a')
                    .triggerEvent('click hover');
            return result;
        })).toBe(4);
    });

    test('triggers a namespaced event with namespacing for each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click.test', (_) => {
                result++;
            });
            $('a')
                    .triggerEvent('click.test');
            return result;
        })).toBe(2);
    });

    test('triggers namespaced events with namespacing for each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click.test hover.test', (_) => {
                result++;
            });
            $('a')
                    .triggerEvent('click.test hover.test');
            return result;
        })).toBe(4);
    });

    test('triggers a deep namespaced event with namespacing for each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click.test.deep', (_) => {
                result++;
            });
            $('a')
                    .triggerEvent('click.test');
            return result;
        })).toBe(2);
    });

    test('triggers deep namespaced events with namespacing for each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click.test.deep hover.test.deep', (_) => {
                result++;
            });
            $('a')
                    .triggerEvent('click.test hover.test');
            return result;
        })).toBe(4);
    });

    test('triggers a deep namespaced event with deep namespacing for each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click.test.deep', (_) => {
                result++;
            });
            $('a')
                    .triggerEvent('click.test.deep');
            return result;
        })).toBe(2);
    });

    test('triggers deep namespaced events with deep namespacing for each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click.test.deep hover.test.deep', (_) => {
                result++;
            });
            $('a')
                    .triggerEvent('click.test.deep hover.test.deep');
            return result;
        })).toBe(4);
    });

    test('does not trigger an event without namespacing for each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click', (_) => {
                result++;
            });
            $('a')
                    .triggerEvent('click.test');
            return result;
        })).toBe(0);
    });

    test('does not trigger events without namespacing for each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click hover', (_) => {
                result++;
            });
            $('a')
                    .triggerEvent('click.test hover.test');
            return result;
        })).toBe(0);
    });

    test('does not trigger a namespaced event with deep namespacing for each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click.test', (_) => {
                result++;
            });
            $('a')
                    .triggerEvent('click.test.deep');
            return result;
        })).toBe(0);
    });

    test('does not trigger namespaced events with deep namespacing for each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click.test hover.test', (_) => {
                result++;
            });
            $('a')
                    .triggerEvent('click.test.deep hover.test.deep');
            return result;
        })).toBe(0);
    });

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

    test('bubbles to other event listeners', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('#div1', 'click', (_) => {
                result++;
            });
            $('a')
                    .triggerEvent('click');
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

    test('can be cancelled', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result;
            $.addEvent('#test1', 'click', (e) => {
                result = e.cancelable;
            });
            $('#test1')
                    .triggerEvent('click');
            return result;
        })).toBe(true);
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

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('a');
            return query === query.triggerEvent('click');
        })).toBe(true);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            $.addEvent(shadow, 'click', (_) => {
                result++;
            });
            $(shadow)
                    .triggerEvent('click');
            return result;
        })).toBe(1);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent(document, 'click', (_) => {
                result++;
            });
            $(document)
                    .triggerEvent('click');
            return result;
        })).toBe(1);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent(window, 'click', (_) => {
                result++;
            });
            $(window)
                    .triggerEvent('click');
            return result;
        })).toBe(1);
    });
});
