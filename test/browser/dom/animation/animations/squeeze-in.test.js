import { setup, squeezeInTests } from '#cases/animation/animations/squeeze-in.js';
import { expect, test } from '#test';
import { advanceClock } from '../../../../setup/browser.js';
import { expectAnimationState } from '../../../../support/assertions/animation.js';

test.use({ mockClock: true });

test.describe('#squeezeIn', () => {
    test.beforeEach(setup);

    squeezeInTests(() => $.squeezeIn);

    test.describe('style locks and restoration', () => {
        test('restores existing inline dimensions, overflow and transform', async ({ page }) => {
            await page.evaluate(() => {
                for (const node of document.querySelectorAll('.animate')) {
                    node.style.setProperty('height', '80px');
                    node.style.setProperty('overflow', 'scroll');
                    node.style.setProperty('transform', 'scale(2)');
                    node.style.setProperty('width', '90px');
                }

                $.squeezeIn('.animate', {
                    direction: 'top',
                    duration: 100,
                });
            });
            await advanceClock(page, 100);
            await expectAnimationState(page, [
                {
                    selectors: ['#test2', '#test4'],
                    styles: { height: '80px', overflow: 'scroll', transform: 'scale(2)', width: '90px' },
                },
            ]);
        });

        test('rejects overflow supplied by a variable-based shorthand', async ({ page }) => {
            expect(await page.evaluate(async () => {
                document.getElementById('test2').style.cssText = '--overflow: scroll; overflow: var(--overflow);';
                try {
                    await $.squeezeIn('#test2');
                } catch (error) {
                    return error.message;
                }
            })).toBe('Cannot lock CSS property "overflow-x" because its original value cannot be restored.');

            await expect(page.locator('#test2')).toHaveAttribute('style', '--overflow: scroll; overflow: var(--overflow);');
        });

        test('releases earlier properties when a later property is locked', async ({ page }) => {
            expect(await page.evaluate(async () => {
                document.getElementById('test2').style.height = '50px';
                $.setStyleLock('#test2', 'overflow-x', 'scroll');
                try {
                    await $.squeezeIn('#test2');
                } catch (error) {
                    const release = $.setStyleLock('#test2', 'height', '75px');
                    release();
                    return error.message;
                }
            })).toBe('CSS property "overflow-x" is already locked.');

            await expectAnimationState(page, [
                {
                    selectors: ['#test2'],
                    styles: { height: '50px', overflowX: 'scroll' },
                },
            ]);
        });

        test('rejects dimensions that would change declaration precedence', async ({ page }) => {
            expect(await page.evaluate(async () => {
                document.getElementById('test2').style.cssText = 'width: 100px; inline-size: 200px;';
                try {
                    await $.squeezeIn('#test2');
                } catch (error) {
                    return error.message;
                }
            })).toBe('Cannot lock CSS property "width" because its original value cannot be restored.');

            await expect(page.locator('#test2')).toHaveAttribute('style', 'width: 100px; inline-size: 200px;');
        });

        test('releases earlier properties when a dimension cannot be restored', async ({ page }) => {
            expect(await page.evaluate(async () => {
                document.getElementById('test2').style.cssText = 'width: 100px; inline-size: 200px;';
                try {
                    await $.squeezeIn('#test2');
                } catch {
                    const release = $.setStyleLock('#test2', 'height', '50px');
                    release();
                    return true;
                }
            })).toBe(true);
        });

        test('restores separate overflow declarations', async ({ page }) => {
            await page.evaluate(() => {
                const style = document.getElementById('test2').style;
                style.setProperty('overflow-x', 'scroll', 'important');
                style.setProperty('overflow-y', 'auto');
                $.squeezeIn('#test2', { duration: 100 });
            });
            await advanceClock(page, 100);

            await expectAnimationState(page, [
                {
                    selectors: ['#test2'],
                    styles: { overflowX: 'scroll', overflowY: 'auto' },
                },
            ]);
            expect(await page.evaluate(() =>
                document.getElementById('test2').style.getPropertyPriority('overflow-x'))).toBe('important');
        });
    });

    test.describe('completion and stopping', () => {
        test('can be stopped', async ({ page }) => {
            const animationHandle = await page.evaluateHandle(() => ({
                animation: $.squeezeIn('.animate', {
                    duration: 100,
                    debug: true,
                }),
            }));
            await advanceClock(page, 50);
            await animationHandle.evaluate(({ animation }) => {
                animation.stop();
            });
            await animationHandle.dispose();
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                    styles: { overflow: '', height: '' },
                },
            ]);
        });

        test('can be stopped (without finishing)', async ({ page }) => {
            const animationHandle = await page.evaluateHandle(() => {
                const animation = $.squeezeIn('.animate', {
                    duration: 100,
                    debug: true,
                });

                animation.catch(() => { });

                return { animation };
            });
            await advanceClock(page, 50);
            await animationHandle.evaluate(({ animation }) => {
                animation.stop({ finish: false });
            });
            await animationHandle.dispose();
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test3'],
                    styles: { overflow: '', height: '' },
                },
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0.5,
                    styles: { overflow: 'hidden', height: '50px' },
                },
            ]);
            await advanceClock(page, 100);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test3'],
                    styles: { overflow: '', height: '' },
                },
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0.5,
                    styles: { overflow: 'hidden', height: '50px' },
                },
            ]);
        });

        test('resolves when the animation is stopped', async ({ page }) => {
            await page.evaluate(async () => {
                const animation = $.squeezeIn('.animate', {
                    duration: 100,
                    debug: true,
                });
                animation.stop();
                await animation;
            });
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                    styles: { overflow: '', height: '' },
                },
            ]);
        });

        test('throws when the animation is stopped (without finishing)', async ({ page }) => {
            expect(await page.evaluate(async () => {
                try {
                    const animation = $.squeezeIn('.animate', {
                        duration: 100,
                        debug: true,
                    });
                    animation.stop({ finish: false });
                    await animation;
                    return false;
                } catch {
                    return true;
                }
            })).toBe(true);
        });

        test('does not stop all animations', async ({ page }) => {
            const animationHandle = await page.evaluateHandle(() => {
                const animation = $.squeezeIn('.animate', {
                    duration: 100,
                });
                $.animate(
                    '.animate',
                    () => { },
                    {
                        duration: 100,
                        debug: true,
                    },
                );

                return { animation };
            });
            await advanceClock(page, 50);
            await animationHandle.evaluate(({ animation }) => {
                animation.stop();
            });
            await animationHandle.dispose();
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test3'],
                    styles: { overflow: '', height: '' },
                },
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0.5,
                    styles: { overflow: '', height: '' },
                },
            ]);
        });

        test('resolves when the animation is completed', async ({ page }) => {
            const animationHandle = await page.evaluateHandle(() => ({
                animation: $.squeezeIn('.animate', {
                    duration: 100,
                    debug: true,
                }),
            }));
            await advanceClock(page, 100);
            await animationHandle.evaluate(async ({ animation }) => {
                await animation;
            });
            await animationHandle.dispose();
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                    styles: { overflow: '', height: '' },
                },
            ]);
        });

        test('throws when all animations are stopped (without finishing)', async ({ page }) => {
            expect(await page.evaluate(async () => {
                try {
                    const animation = $.squeezeIn('.animate', {
                        duration: 1000,
                        debug: true,
                    });
                    $.stop('.animate', { finish: false });
                    await animation;
                    return false;
                } catch {
                    return true;
                }
            })).toBe(true);
        });
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.squeezeIn(
                    document.getElementById('test2'),
                    {
                        duration: 100,
                        debug: true,
                    },
                );
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test3', '#test4'],
                    styles: { overflow: '', height: '' },
                },
                {
                    selectors: ['#test2'],
                    progress: 0.5,
                    styles: { overflow: 'hidden', height: '50px' },
                },
            ]);
            await advanceClock(page, 100);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                    styles: { overflow: '', height: '' },
                },
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.squeezeIn(
                    document.querySelectorAll('.animate'),
                    {
                        duration: 100,
                        debug: true,
                    },
                );
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test3'],
                    styles: { overflow: '', height: '' },
                },
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0.5,
                    styles: { overflow: 'hidden', height: '50px' },
                },
            ]);
            await advanceClock(page, 100);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                    styles: { overflow: '', height: '' },
                },
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.squeezeIn(
                    document.body.children,
                    {
                        duration: 100,
                        debug: true,
                    },
                );
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                    progress: 0.5,
                    styles: { overflow: 'hidden', height: '50px' },
                },
            ]);
            await advanceClock(page, 100);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                    styles: { overflow: '', height: '' },
                },
            ]);
        });

        test('works with array nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.squeezeIn([
                    document.getElementById('test2'),
                    document.getElementById('test4'),
                ], {
                    duration: 100,
                    debug: true,
                });
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test3'],
                    styles: { overflow: '', height: '' },
                },
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0.5,
                    styles: { overflow: 'hidden', height: '50px' },
                },
            ]);
            await advanceClock(page, 100);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                    styles: { overflow: '', height: '' },
                },
            ]);
        });
    });
});
