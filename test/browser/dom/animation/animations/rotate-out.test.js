import { rotateOutTests, setup } from '#cases/animation/animations/rotate-out.js';
import { expect, test } from '#test';
import { advanceClock } from '../../../../setup/browser.js';
import { expectAnimationState } from '../../../../support/assertions/animation.js';

test.use({ mockClock: true });

test.describe('#rotateOut', () => {
    test.beforeEach(setup);

    rotateOutTests((args) => {
        $.rotateOut(...args);
    });

    test.describe('style locks and restoration', () => {
        test('restores existing inline transform', async ({ page }) => {
            await page.evaluate((_) => {
                for (const node of document.querySelectorAll('.animate')) {
                    node.style.setProperty('transform', 'scale(2)');
                }

                $.rotateOut('.animate', { duration: 100 });
            });
            await advanceClock(page, 100);
            await expectAnimationState(page, [
                {
                    selectors: ['#test2', '#test4'],
                    styles: { transform: 'scale(2)' },
                },
            ]);
        });
    });

    test.describe('completion and stopping', () => {
        test('can be stopped', async ({ page }) => {
            const animationHandle = await page.evaluateHandle((_) => ({
                animation: $.rotateOut('.animate', {
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
                    styles: { transform: '' },
                },
            ]);
        });

        test('can be stopped (without finishing)', async ({ page }) => {
            const animationHandle = await page.evaluateHandle((_) => {
                const animation = $.rotateOut('.animate', {
                    duration: 100,
                    debug: true,
                });

                animation.catch((_) => { });

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
                    styles: { transform: '' },
                },
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0.5,
                    styles: { transform: 'rotate3d(0, 1, 0, 45deg)' },
                },
            ]);
            await advanceClock(page, 100);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test3'],
                    styles: { transform: '' },
                },
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0.5,
                    styles: { transform: 'rotate3d(0, 1, 0, 45deg)' },
                },
            ]);
        });

        test('resolves when the animation is stopped', async ({ page }) => {
            await page.evaluate(async (_) => {
                const animation = $.rotateOut('.animate', {
                    duration: 100,
                    debug: true,
                });
                animation.stop();
                await animation;
            });
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                    styles: { transform: '' },
                },
            ]);
        });

        test('throws when the animation is stopped (without finishing)', async ({ page }) => {
            expect(await page.evaluate(async (_) => {
                try {
                    const animation = $.rotateOut('.animate', {
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
            const animationHandle = await page.evaluateHandle((_) => {
                const animation = $.rotateOut('.animate', {
                    duration: 100,
                });
                $.animate(
                    '.animate',
                    (_) => { },
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
                    styles: { transform: '' },
                },
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0.5,
                    styles: { transform: '' },
                },
            ]);
        });

        test('resolves when the animation is completed', async ({ page }) => {
            const animationHandle = await page.evaluateHandle((_) => ({
                animation: $.rotateOut('.animate', {
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
                    styles: { transform: '' },
                },
            ]);
        });

        test('throws when all animations are stopped (without finishing)', async ({ page }) => {
            expect(await page.evaluate(async (_) => {
                try {
                    const animation = $.rotateOut('.animate', {
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
            await page.evaluate((_) => {
                $.rotateOut(
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
                    styles: { transform: '' },
                },
                {
                    selectors: ['#test2'],
                    progress: 0.5,
                    styles: { transform: 'rotate3d(0, 1, 0, 45deg)' },
                },
            ]);
            await advanceClock(page, 100);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                    styles: { transform: '' },
                },
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            await page.evaluate((_) => {
                $.rotateOut(
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
                    styles: { transform: '' },
                },
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0.5,
                    styles: { transform: 'rotate3d(0, 1, 0, 45deg)' },
                },
            ]);
            await advanceClock(page, 100);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                    styles: { transform: '' },
                },
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            await page.evaluate((_) => {
                $.rotateOut(
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
                    styles: { transform: 'rotate3d(0, 1, 0, 45deg)' },
                },
            ]);
            await advanceClock(page, 100);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                    styles: { transform: '' },
                },
            ]);
        });

        test('works with array nodes', async ({ page }) => {
            await page.evaluate((_) => {
                $.rotateOut([
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
                    styles: { transform: '' },
                },
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0.5,
                    styles: { transform: 'rotate3d(0, 1, 0, 45deg)' },
                },
            ]);
            await advanceClock(page, 100);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                    styles: { transform: '' },
                },
            ]);
        });
    });
});
