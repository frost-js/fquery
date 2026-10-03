import { expect, test } from '#test';

test.describe('#mouseDragFactory', () => {
    test('uses the configured window', async ({ page }) => {
        expect(await page.evaluate(() => {
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
                    () => {
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

    test.describe('mouse callbacks', () => {
        test('creates a mouse drag event', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result = 0;
                const downEvent = new Event('mousedown');
                $.addEvent(
                    document.body,
                    'mousedown',
                    $.mouseDragFactory(() => {
                        result++;
                    }),
                );
                document.body.dispatchEvent(downEvent);
                return result;
            })).toBe(1);
        });

        test('creates a mouse drag event with move event', async ({ page }) => {
            expect(await page.evaluate(() => {
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
                        () => {
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

        test('creates a mouse drag event with up event', async ({ page }) => {
            expect(await page.evaluate(() => {
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
                        () => {
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
    });

    test.describe('callback return values', () => {
        test('does not run callbacks if down callback returns false', async ({ page }) => {
            expect(await page.evaluate(() => {
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
                        () => false,
                        () => {
                            result++;
                        },
                        () => {
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

        test('does not remove callbacks if up callback returns false', async ({ page }) => {
            expect(await page.evaluate(() => {
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
                        () => { },
                        () => {
                            result++;
                        },
                        () => {
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
    });

    test.describe('mouse cleanup', () => {
        test('removes move event on mouseup', async ({ page }) => {
            expect(await page.evaluate(() => {
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
                        () => {
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

        test('removes up event on mouseup', async ({ page }) => {
            expect(await page.evaluate(() => {
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
                        () => {
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
    });

    test.describe('touch dragging', () => {
        test('works with touch events', async ({ page }) => {
            const hasTouch = await page.evaluate(() => {
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

            expect(await page.evaluate(() => {
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
                        () => {
                            result++;
                        },
                        () => {
                            result++;
                        },
                        () => {
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

        test('removes callbacks when multiple touches end together', async ({ page }) => {
            const hasTouch = await page.evaluate(() => {
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

            expect(await page.evaluate(() => {
                const touch1 = new Touch({
                    identifier: 1,
                    target: document.body,
                });
                const touch2 = new Touch({
                    identifier: 2,
                    target: document.body,
                });

                let result = 0;
                const downEvent = new TouchEvent('touchstart', {
                    touches: [touch1, touch2],
                });
                const moveEvent = new TouchEvent('touchmove', {
                    touches: [touch1, touch2],
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
                        null,
                        () => {
                            result++;
                        },
                        null,
                        { debounce: false, touches: 2 },
                    ),
                );
                document.body.dispatchEvent(downEvent);
                document.body.dispatchEvent(upEvent);
                document.body.dispatchEvent(moveEvent);
                return result;
            })).toBe(0);
        });
    });

    test.describe('touch cancellation', () => {
        test('removes callbacks on touchcancel', async ({ page }) => {
            const hasTouch = await page.evaluate(() => {
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

            expect(await page.evaluate(() => {
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
                const cancelEvent = new TouchEvent('touchcancel', {
                    touches: [],
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
                        null,
                        () => {
                            result++;
                        },
                        () => {
                            result++;
                        },
                        { debounce: false },
                    ),
                );
                document.body.dispatchEvent(downEvent);
                document.body.dispatchEvent(cancelEvent);
                document.body.dispatchEvent(moveEvent);
                document.body.dispatchEvent(upEvent);
                document.body.dispatchEvent(cancelEvent);
                return result;
            })).toBe(1);
        });

        test('removes callbacks when multiple touches are cancelled', async ({ page }) => {
            const hasTouch = await page.evaluate(() => {
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

            expect(await page.evaluate(() => {
                const touch1 = new Touch({
                    identifier: 1,
                    target: document.body,
                });
                const touch2 = new Touch({
                    identifier: 2,
                    target: document.body,
                });

                let result = 0;
                const downEvent = new TouchEvent('touchstart', {
                    touches: [touch1, touch2],
                });
                const moveEvent = new TouchEvent('touchmove', {
                    touches: [touch1, touch2],
                    bubbles: true,
                });
                const cancelEvent = new TouchEvent('touchcancel', {
                    touches: [],
                    bubbles: true,
                });
                $.addEvent(
                    document.body,
                    'touchstart',
                    $.mouseDragFactory(
                        null,
                        () => {
                            result++;
                        },
                        null,
                        { debounce: false, touches: 2 },
                    ),
                );
                document.body.dispatchEvent(downEvent);
                document.body.dispatchEvent(cancelEvent);
                document.body.dispatchEvent(moveEvent);
                return result;
            })).toBe(0);
        });

        test('removes callbacks on touchcancel if up callback returns false', async ({ page }) => {
            const hasTouch = await page.evaluate(() => {
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

            expect(await page.evaluate(() => {
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
                const cancelEvent = new TouchEvent('touchcancel', {
                    touches: [],
                    bubbles: true,
                });
                $.addEvent(
                    document.body,
                    'touchstart',
                    $.mouseDragFactory(
                        null,
                        () => {
                            result++;
                        },
                        () => false,
                        { debounce: false },
                    ),
                );
                document.body.dispatchEvent(downEvent);
                document.body.dispatchEvent(cancelEvent);
                document.body.dispatchEvent(moveEvent);
                return result;
            })).toBe(0);
        });
    });
});
