import { addEventOnceTests, setup } from '#cases/events/event-handlers/add-event-once.js';
import { expect, test } from '#test';

test.describe('#addEventOnce', () => {
    test.beforeEach(setup);

    addEventOnceTests(() => $.addEventOnce);

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result = 0;
                const event = new Event('click');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                $.addEventOnce(element1, 'click', () => {
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
            expect(await page.evaluate(() => {
                let result = 0;
                const event = new Event('click');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                $.addEventOnce(
                    document.querySelectorAll('a'),
                    'click',
                    () => {
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
            expect(await page.evaluate(() => {
                let result = 0;
                const event = new Event('click');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                $.addEventOnce(
                    document.body.children,
                    'click',
                    () => {
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
            expect(await page.evaluate(() => {
                let result = 0;
                const event = new Event('click');
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                $.addEventOnce(shadow, 'click', () => {
                    result++;
                });
                shadow.dispatchEvent(event);
                shadow.dispatchEvent(event);
                return result;
            })).toBe(1);
        });

        test('works with Document nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result = 0;
                const event = new Event('click');
                $.addEventOnce(document, 'click', () => {
                    result++;
                });
                document.dispatchEvent(event);
                document.dispatchEvent(event);
                return result;
            })).toBe(1);
        });

        test('works with Window nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result = 0;
                const event = new Event('click');
                $.addEventOnce(window, 'click', () => {
                    result++;
                });
                window.dispatchEvent(event);
                window.dispatchEvent(event);
                return result;
            })).toBe(1);
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
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
                    () => {
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
    });
});
