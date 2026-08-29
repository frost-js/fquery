import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #addEventOnce', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<a href="#" id="test1">Test</a>' +
                '<a href="#" id="test2">Test</a>';
        });
    });

    test('adds a self-destructing event to each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('click');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $('a')
                    .addEventOnce('click', (_) => {
                        result++;
                    });
            element1.dispatchEvent(event);
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(2);
    });

    test('adds self-destructing events to each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event1 = new Event('click');
            const event2 = new Event('hover');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $('a')
                    .addEventOnce('click hover', (_) => {
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
            return result;
        })).toBe(4);
    });

    test('adds a namespaced self-destructing event to each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('click');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $('a')
                    .addEventOnce('click.test', (_) => {
                        result++;
                    });
            element1.dispatchEvent(event);
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(2);
    });

    test('adds namespaced self-destructing events to each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event1 = new Event('click');
            const event2 = new Event('hover');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $('a')
                    .addEventOnce('click.test hover.test', (_) => {
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
            return result;
        })).toBe(4);
    });

    test('adds a deep namespaced self-destructing event to each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('click');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $('a')
                    .addEventOnce('click.test.deep', (_) => {
                        result++;
                    });
            element1.dispatchEvent(event);
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(2);
    });

    test('adds deep namespaced self-destructing events to each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event1 = new Event('click');
            const event2 = new Event('hover');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $('a')
                    .addEventOnce('click.test.deep hover.test.deep', (_) => {
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
            return result;
        })).toBe(4);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('a');
            return query === query.addEventOnce('click', (_) => null);
        })).toBe(true);
    });

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
