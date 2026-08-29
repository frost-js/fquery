import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #addEventDelegateOnce', () => {
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

    test('adds a self-destructing delegated event to each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('click', {
                bubbles: true,
            });
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            const element3 = document.getElementById('test3');
            const element4 = document.getElementById('test4');
            $('div').addEventDelegateOnce('click', 'a', (_) => {
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
        })).toBe(2);
    });

    test('adds self-destructing delegated events to each node', async ({ page }) => {
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
                    .addEventDelegateOnce('click hover', 'a', (_) => {
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
        })).toBe(4);
    });

    test('adds a namespaced self-destructing delegated event to each node', async ({ page }) => {
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
                    .addEventDelegateOnce('click.test', 'a', (_) => {
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
        })).toBe(2);
    });

    test('adds namespaced self-destructing delegated events to each node', async ({ page }) => {
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
                    .addEventDelegateOnce('click.test hover.test', 'a', (_) => {
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
        })).toBe(4);
    });

    test('adds a deep namespaced self-destructing delegated event to each node', async ({ page }) => {
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
                    .addEventDelegateOnce('click.test.deep', 'a', (_) => {
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
        })).toBe(2);
    });

    test('adds deep namespaced self-destructing delegated events to each node', async ({ page }) => {
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
                    .addEventDelegateOnce('click.test.deep hover.test.deep', 'a', (_) => {
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
        })).toBe(4);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return query === query.addEventDelegateOnce('click', 'a', (_) => null);
        })).toBe(true);
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

    test('does not capture events', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('click');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            const element3 = document.getElementById('test3');
            const element4 = document.getElementById('test4');
            $('div')
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
                    .addEventDelegateOnce('click', 'a', (_) => {
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
        })).toBe(2);
    });
});
