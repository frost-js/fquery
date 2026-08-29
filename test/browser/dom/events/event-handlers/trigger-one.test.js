import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#triggerOne', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1">' +
                '<a href="#" id="test1">Test</a>' +
                '<a href="#" id="test2">Test</a>' +
                '</div>';
        });
    });

    test('triggers an event for the first node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click', (_) => {
                result++;
            });
            $.triggerOne('a', 'click');
            return result;
        })).toBe(1);
    });

    test('triggers a namespaced event for the first node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click.test', (_) => {
                result++;
            });
            $.triggerOne('a', 'click');
            return result;
        })).toBe(1);
    });

    test('triggers a deep namespaced event for the first node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click.test.deep', (_) => {
                result++;
            });
            $.triggerOne('a', 'click');
            return result;
        })).toBe(1);
    });

    test('triggers a namespaced event with namespacing for the first node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click.test', (_) => {
                result++;
            });
            $.triggerOne('a', 'click.test');
            return result;
        })).toBe(1);
    });

    test('triggers a deep namespaced event with namespacing for the first node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click.test.deep', (_) => {
                result++;
            });
            $.triggerOne('a', 'click.test');
            return result;
        })).toBe(1);
    });

    test('triggers a deep namespaced event with deep namespacing for the first node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click.test.deep', (_) => {
                result++;
            });
            $.triggerOne('a', 'click.test.deep');
            return result;
        })).toBe(1);
    });

    test('does not trigger an event without namespacing for the first node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click', (_) => {
                result++;
            });
            $.triggerOne('a', 'click.test');
            return result;
        })).toBe(0);
    });

    test('does not trigger a namespaced event with deep namespacing for the first node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click.test', (_) => {
                result++;
            });
            $.triggerOne('a', 'click.test.deep');
            return result;
        })).toBe(0);
    });

    test('triggers an event for the first node with custom data', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click', (e) => {
                if (e.test) {
                    result++;
                }
            });
            $.triggerOne('a', 'click');
            $.triggerOne('a', 'click', {
                data: {
                    test: true,
                },
            });
            return result;
        })).toBe(1);
    });

    test('triggers an event for the first node with custom details', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click', (e) => {
                if (e.detail === 'test') {
                    result++;
                }
            });
            $.triggerOne('a', 'click');
            $.triggerOne('a', 'click', {
                detail: 'test',
            });
            return result;
        })).toBe(1);
    });

    test('bubbles to other event listeners', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('#div1', 'click', (_) => {
                result++;
            });
            $.triggerOne('a', 'click');
            return result;
        })).toBe(1);
    });

    test('can be prevented from bubbling', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('#div1', 'click', (_) => {
                result++;
            });
            $.triggerOne('a', 'click', {
                bubbles: false,
            });
            return result;
        })).toBe(0);
    });

    test('returns false if the event is cancelled', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.addEvent('#test1', 'click', (e) => {
                e.preventDefault();
            });
            return $.triggerOne('#test1', 'click');
        })).toBe(false);
    });

    test('returns false if the event returns false', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.addEvent('#test1', 'click', (_) => false);
            return $.triggerOne('#test1', 'click');
        })).toBe(false);
    });

    test('returns false if a delegated event returns false', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.addEventDelegate('#div1', 'click', 'a', (_) => false);
            return $.triggerOne('#test1', 'click');
        })).toBe(false);
    });

    test('returns true if the event is not cancelled', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.addEvent('#test1', 'click', (_) => { });
            return $.triggerOne('#test1', 'click');
        })).toBe(true);
    });

    test('returns true if a delegated event is not cancelled', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.addEventDelegate('#div1', 'click', 'a', (_) => { });
            return $.triggerOne('#test1', 'click');
        })).toBe(true);
    });

    test('can be prevented from being cancelled', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.addEvent('#test1', 'click', (e) => {
                e.preventDefault();
            });
            return $.triggerOne('#test1', 'click', {
                cancelable: false,
            });
        })).toBe(true);
    });

    test('can be prevented from being cancelled with delegate', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.addEventDelegate('#div1', 'click', 'a', (e) => {
                e.preventDefault();
            });
            return $.triggerOne('#test1', 'click', {
                cancelable: false,
            });
        })).toBe(true);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click', (_) => {
                result++;
            });
            $.triggerOne(
                document.getElementById('test1'),
                'click',
            );
            return result;
        })).toBe(1);
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click', (_) => {
                result++;
            });
            $.triggerOne(
                document.querySelectorAll('a'),
                'click',
            );
            return result;
        })).toBe(1);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click', (_) => {
                result++;
            });
            $.triggerOne(
                document.getElementById('div1').children,
                'click',
            );
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
            $.triggerOne(shadow, 'click');
            return result;
        })).toBe(1);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent(document, 'click', (_) => {
                result++;
            });
            $.triggerOne(document, 'click');
            return result;
        })).toBe(1);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent(window, 'click', (_) => {
                result++;
            });
            $.triggerOne(window, 'click');
            return result;
        })).toBe(1);
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            $.addEvent('a', 'click', (_) => {
                result++;
            });
            $.triggerOne([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], 'click');
            return result;
        })).toBe(1);
    });
});
