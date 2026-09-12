import { setup, slideInTests } from '#cases/animation/animations/slide-in.js';
import { expect, test } from '#test';
import { advanceClock } from '../../../../setup/browser.js';
import { expectAnimationState } from '../../../../support/assertions/animation.js';

test.use({ mockClock: true });

test.describe('#slideIn', () => {
    test.beforeEach(setup);

    slideInTests((args) => {
        $.slideIn(...args);
    });

    test.describe('style locks and restoration', () => {
        test('restores existing inline transform without changing overflow', async ({ page }) => {
            await page.evaluate((_) => {
                for (const node of document.querySelectorAll('.animate')) {
                    node.style.setProperty('overflow', 'scroll');
                    node.style.setProperty('transform', 'scale(2)');
                }

                $.slideIn('.animate', { duration: 100 });
            });
            await advanceClock(page, 100);
            await expectAnimationState(page, [
                {
                    selectors: ['#test2', '#test4'],
                    styles: { overflow: 'scroll', transform: 'scale(2)' },
                },
            ]);
        });

        test('preserves margins supplied by a variable-based shorthand', async ({ page }) => {
            await page.evaluate((_) => {
                document.getElementById('test2').style.cssText = '--spacing: 20px; margin: var(--spacing);';
                $.slideIn('#test2', { duration: 100 });
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#test2'],
                    styles: { margin: 'var(--spacing)', transform: 'translateY(50px)' },
                },
            ]);
            await advanceClock(page, 100);

            await expect(page.locator('#test2')).toHaveAttribute('style', '--spacing: 20px; margin: var(--spacing);');
        });

        test('restores and releases styles when the direction callback throws', async ({ page }) => {
            await page.evaluate((_) => {
                const node = document.getElementById('test2');
                node.style.transform = 'scale(2)';
                let calls = 0;
                $.slideIn(node, {
                    direction: () => {
                        if (calls++) {
                            throw new Error('Invalid direction');
                        }
                        return 'bottom';
                    },
                }).catch((error) => {
                    node.dataset.error = error.message;
                });
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const release = $.setStyleLock('#test2', 'transform', 'scale(3)');
                release();
            });

            await expect(page.locator('#test2')).toHaveAttribute('data-error', 'Invalid direction');
            await expectAnimationState(page, [
                {
                    selectors: ['#test2'],
                    styles: { transform: 'scale(2)' },
                },
            ]);
        });

        test('preserves important transforms during the animation', async ({ page }) => {
            await page.addStyleTag({ content: '.animate { transform: translateY(200px) !important; }' });
            await page.evaluate((_) => {
                document.getElementById('test2').style.setProperty('transform', 'none', 'important');
                $.slideIn('#test2', { duration: 100 });
            });
            await advanceClock(page, 50);

            await expect(page.locator('#test2')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 50)');
        });
    });

    test.describe('completion and stopping', () => {
        test('can be stopped', async ({ page }) => {
            const animationHandle = await page.evaluateHandle((_) => ({
                animation: $.slideIn('.animate', {
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
                const animation = $.slideIn('.animate', {
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
                    styles: { transform: 'translateY(50px)' },
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
                    styles: { transform: 'translateY(50px)' },
                },
            ]);
        });

        test('resolves when the animation is stopped', async ({ page }) => {
            await page.evaluate(async (_) => {
                const animation = $.slideIn('.animate', {
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
                    const animation = $.slideIn('.animate', {
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
                const animation = $.slideIn('.animate', {
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
                animation: $.slideIn('.animate', {
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
                    const animation = $.slideIn('.animate', {
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
                $.slideIn(
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
                    styles: { transform: 'translateY(50px)' },
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
                $.slideIn(
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
                    styles: { transform: 'translateY(50px)' },
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
                $.slideIn(
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
                    styles: { transform: 'translateY(50px)' },
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
                $.slideIn([
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
                    styles: { transform: 'translateY(50px)' },
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
