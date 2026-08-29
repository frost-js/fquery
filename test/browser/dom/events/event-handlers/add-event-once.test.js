import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#addEventOnce', () => {
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
            $.addEventOnce('a', 'click', (_) => {
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
            $.addEventOnce('a', 'click hover', (_) => {
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
            $.addEventOnce('a', 'click.test', (_) => {
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
            $.addEventOnce('a', 'click.test hover.test', (_) => {
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
            $.addEventOnce('a', 'click.test.deep', (_) => {
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
            $.addEventOnce('a', 'click.test.deep hover.test.deep', (_) => {
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

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('click');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEventOnce(element1, 'click', (_) => {
                result++;
            });
            element1.dispatchEvent(event);
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(1);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('click');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEventOnce(
                document.querySelectorAll('a'),
                'click',
                (_) => {
                    result++;
                },
            );
            element1.dispatchEvent(event);
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(2);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('click');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEventOnce(
                document.body.children,
                'click',
                (_) => {
                    result++;
                },
            );
            element1.dispatchEvent(event);
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(2);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('click');
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            $.addEventOnce(shadow, 'click', (_) => {
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
            $.addEventOnce(document, 'click', (_) => {
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
            $.addEventOnce(window, 'click', (_) => {
                result++;
            });
            window.dispatchEvent(event);
            window.dispatchEvent(event);
            return result;
        })).toBe(1);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('click');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEventOnce(
                [
                    element1,
                    element2,
                ],
                'click',
                (_) => {
                    result++;
                },
            );
            element1.dispatchEvent(event);
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(2);
    });

    test('does not capture events', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('click');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEventOnce(document, 'click', (_) => {
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
            $.addEventOnce(document, 'click', (_) => {
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
