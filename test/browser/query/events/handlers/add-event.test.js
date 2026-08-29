import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #addEvent', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<a href="#" id="test1">Test</a>' +
                '<a href="#" id="test2">Test</a>';
        });
    });

    test('adds an event to each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('click');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $('a')
                    .addEvent('click', (_) => {
                        result++;
                    });
            element1.dispatchEvent(event);
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(4);
    });

    test('adds events to each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event1 = new Event('click');
            const event2 = new Event('hover');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $('a')
                    .addEvent('click hover', (_) => {
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
        })).toBe(8);
    });

    test('adds a namespaced event to each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('click');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $('a')
                    .addEvent('click.test', (_) => {
                        result++;
                    });
            element1.dispatchEvent(event);
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(4);
    });

    test('adds namespaced events to each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event1 = new Event('click');
            const event2 = new Event('hover');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $('a')
                    .addEvent('click.test hover.test', (_) => {
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
        })).toBe(8);
    });

    test('adds a deep namespaced event to each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('click');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $('a')
                    .addEvent('click.test.deep', (_) => {
                        result++;
                    });
            element1.dispatchEvent(event);
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(4);
    });

    test('adds deep namespaced events to each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event1 = new Event('click');
            const event2 = new Event('hover');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $('a')
                    .addEvent('click.test.deep hover.test.deep', (_) => {
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
        })).toBe(8);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('a');
            return query === query.addEvent('click', (_) => null);
        })).toBe(true);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            const event = new Event('click');
            $(shadow)
                    .addEvent('click', (_) => {
                        result++;
                    });
            shadow.dispatchEvent(event);
            shadow.dispatchEvent(event);
            return result;
        })).toBe(2);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('click');
            $(document)
                    .addEvent('click', (_) => {
                        result++;
                    });
            document.dispatchEvent(event);
            document.dispatchEvent(event);
            return result;
        })).toBe(2);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('click');
            $(window)
                    .addEvent('click', (_) => {
                        result++;
                    });
            window.dispatchEvent(event);
            window.dispatchEvent(event);
            return result;
        })).toBe(2);
    });

    test('does not capture events', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('click');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $(document)
                    .addEvent('click', (_) => {
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
                    .addEvent('click', (_) => {
                        result++;
                    }, { capture: true });
            element1.dispatchEvent(event);
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(4);
    });
});
