import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#mouseDragFactory', () => {
    test('creates a mouse drag event', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const downEvent = new Event('mousedown');
            $.addEvent(
                document.body,
                'mousedown',
                $.mouseDragFactory((_) => {
                    result++;
                }),
            );
            document.body.dispatchEvent(downEvent);
            return result;
        })).toBe(1);
    });

    test('creates a mouse drag event with move event', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const downEvent = new Event('mousedown');
            const moveEvent = new Event('mousemove', {
                bubbles: true,
            });
            const upEvent = new Event('mouseup', {
                bubbles: true,
            });
            $.addEvent(
                document.body,
                'mousedown',
                $.mouseDragFactory(
                    null,
                    (_) => {
                        result++;
                    },
                    null,
                    { debounce: false },
                ),
            );
            document.body.dispatchEvent(downEvent);
            document.body.dispatchEvent(moveEvent);
            document.body.dispatchEvent(moveEvent);
            document.body.dispatchEvent(upEvent);
            return result;
        })).toBe(2);
    });

    test('uses the configured window', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const iframe = document.createElement('iframe');
            document.body.appendChild(iframe);

            const configuredWindow = iframe.contentWindow;
            const downEvent = new Event('mousedown');
            const moveEvent = new configuredWindow.Event('mousemove');
            const upEvent = new configuredWindow.Event('mouseup');
            let result = 0;

            $.setWindow(configuredWindow);
            $.addEvent(
                document.body,
                'mousedown',
                $.mouseDragFactory(
                    null,
                    (_) => {
                        result++;
                    },
                    null,
                    { debounce: false },
                ),
            );
            document.body.dispatchEvent(downEvent);
            configuredWindow.dispatchEvent(moveEvent);
            configuredWindow.dispatchEvent(upEvent);
            configuredWindow.dispatchEvent(moveEvent);

            return result;
        })).toBe(1);
    });

    test('creates a mouse drag event with up event', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const downEvent = new Event('mousedown');
            const moveEvent = new Event('mousemove', {
                bubbles: true,
            });
            const upEvent = new Event('mouseup', {
                bubbles: true,
            });
            $.addEvent(
                document.body,
                'mousedown',
                $.mouseDragFactory(
                    null,
                    null,
                    (_) => {
                        result++;
                    },
                    { debounce: false },
                ),
            );
            document.body.dispatchEvent(downEvent);
            document.body.dispatchEvent(moveEvent);
            document.body.dispatchEvent(upEvent);
            return result;
        })).toBe(1);
    });

    test('does not run callbacks if down callback returns false', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const downEvent = new Event('mousedown');
            const moveEvent = new Event('mousemove', {
                bubbles: true,
            });
            const upEvent = new Event('mouseup', {
                bubbles: true,
            });
            $.addEvent(
                document.body,
                'mousedown',
                $.mouseDragFactory(
                    (_) => false,
                    (_) => {
                        result++;
                    },
                    (_) => {
                        result++;
                    },
                    { debounce: false },
                ),
            );
            document.body.dispatchEvent(downEvent);
            document.body.dispatchEvent(moveEvent);
            document.body.dispatchEvent(moveEvent);
            document.body.dispatchEvent(upEvent);
            return result;
        })).toBe(0);
    });

    test('removes move event on mouseup', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const downEvent = new Event('mousedown');
            const moveEvent = new Event('mousemove', {
                bubbles: true,
            });
            const upEvent = new Event('mouseup', {
                bubbles: true,
            });
            $.addEvent(
                document.body,
                'mousedown',
                $.mouseDragFactory(
                    null,
                    (_) => {
                        result++;
                    },
                    null,
                    { debounce: false },
                ),
            );
            document.body.dispatchEvent(downEvent);
            document.body.dispatchEvent(upEvent);
            document.body.dispatchEvent(moveEvent);
            document.body.dispatchEvent(moveEvent);
            return result;
        })).toBe(0);
    });

    test('does not remove callbacks if up callback returns false', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const downEvent = new Event('mousedown');
            const moveEvent = new Event('mousemove', {
                bubbles: true,
            });
            const upEvent = new Event('mouseup', {
                bubbles: true,
            });
            $.addEvent(
                document.body,
                'mousedown',
                $.mouseDragFactory(
                    (_) => { },
                    (_) => {
                        result++;
                    },
                    (_) => {
                        return result > 1;
                    },
                    { debounce: false },
                ),
            );
            document.body.dispatchEvent(downEvent);
            document.body.dispatchEvent(moveEvent);
            document.body.dispatchEvent(upEvent);
            document.body.dispatchEvent(moveEvent);
            document.body.dispatchEvent(moveEvent);
            document.body.dispatchEvent(upEvent);
            return result;
        })).toBe(3);
    });

    test('removes up event on mouseup', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const downEvent = new Event('mousedown');
            const upEvent = new Event('mouseup', {
                bubbles: true,
            });
            $.addEvent(
                document.body,
                'mousedown',
                $.mouseDragFactory(
                    null,
                    null,
                    (_) => {
                        result++;
                    },
                    { debounce: false },
                ),
            );
            document.body.dispatchEvent(downEvent);
            document.body.dispatchEvent(upEvent);
            document.body.dispatchEvent(upEvent);
            return result;
        })).toBe(1);
    });

    test('works with touch events', async ({ page }) => {
        const hasTouch = await page.evaluate((_) => {
            if (typeof Touch !== 'function' || typeof TouchEvent !== 'function') {
                return false;
            }

            try {
                const touch = new Touch({
                    identifier: 1,
                    target: document.body,
                });

                new TouchEvent('touchstart', {
                    touches: [touch],
                });

                return true;
            } catch {
                return false;
            }
        });

        test.skip(!hasTouch, 'Touch constructors are not usable in this browser.');

        expect(await page.evaluate((_) => {
            const touch = new Touch({
                identifier: 1,
                target: document.body,
            });

            let result = 0;
            const downEvent = new TouchEvent('touchstart', {
                touches: [touch],
            });
            const moveEvent = new TouchEvent('touchmove', {
                touches: [touch],
                bubbles: true,
            });
            const upEvent = new TouchEvent('touchend', {
                touches: [],
                bubbles: true,
            });
            $.addEvent(
                document.body,
                'touchstart',
                $.mouseDragFactory(
                    (_) => {
                        result++;
                    },
                    (_) => {
                        result++;
                    },
                    (_) => {
                        result++;
                    },
                    { debounce: false },
                ),
            );
            document.body.dispatchEvent(downEvent);
            document.body.dispatchEvent(moveEvent);
            document.body.dispatchEvent(upEvent);
            return result;
        })).toBe(3);
    });
});
