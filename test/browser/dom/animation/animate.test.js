import { animateTests, setup } from '#cases/animation/animate.js';
import { expect, test } from '#test';
import { advanceClock } from '../../../setup/browser.js';
import { expectAnimationState } from '../../../support/assertions/animation.js';

test.use({ mockClock: true });

test.describe('#animate', () => {
    test.beforeEach(setup);

    animateTests(() => $.animate);

    test.describe('start times and zero duration', () => {
        test('resolves zero-duration animations with full progress', async ({ page }) => {
            await page.evaluate(async () => {
                await $.animate(
                    '.animate',
                    (node, progress) => {
                        node.dataset.test = progress;
                    },
                    {
                        duration: 0,
                    },
                );
            });
            await expect(page.locator('#test2')).toHaveAttribute('data-test', '1');
            await expect(page.locator('#test4')).toHaveAttribute('data-test', '1');
        });

        test('completes zero-duration animations with infinite enabled', async ({ page }) => {
            await page.evaluate(async () => {
                await $.animate(
                    '.animate',
                    (node, progress) => {
                        node.dataset.test = progress;
                    },
                    {
                        duration: 0,
                        infinite: true,
                    },
                );
            });
            await expect(page.locator('#test2')).toHaveAttribute('data-test', '1');
            await expect(page.locator('#test4')).toHaveAttribute('data-test', '1');
        });
    });

    test.describe('completion and stopping', () => {
        test('can be stopped', async ({ page }) => {
            const animationHandle = await page.evaluateHandle(() => {
                const animation = $.animate(
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
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                },
            ]);
        });

        test('can be stopped (without finishing)', async ({ page }) => {
            const animationHandle = await page.evaluateHandle(() => {
                const animation = $.animate(
                    '.animate',
                    () => { },
                    {
                        duration: 100,
                        debug: true,
                    },
                );

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
                },
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0.5,
                },
            ]);
            await advanceClock(page, 100);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test3'],
                },
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0.5,
                },
            ]);
        });

        test('resolves when the animation is stopped', async ({ page }) => {
            await page.evaluate(async () => {
                const animation = $.animate(
                    '.animate',
                    () => { },
                    {
                        duration: 100,
                        debug: true,
                    },
                );
                animation.stop();
                await animation;
            });
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                },
            ]);
        });

        test('resolves when the animation is stopped from its callback', async ({ page }) => {
            const animationHandle = await page.evaluateHandle(() => {
                const animation = $.animate(
                    '#test2',
                    (node, progress) => {
                        node.dataset.test = progress;

                        if (progress >= 0.5) {
                            animation.stop();
                        }
                    },
                    {
                        duration: 100,
                        type: 'linear',
                        debug: true,
                    },
                );

                return { animation };
            });
            await advanceClock(page, 50);
            await animationHandle.evaluate(async ({ animation }) => {
                await animation;
            });
            await animationHandle.dispose();
            await expect(page.locator('#test2')).toHaveAttribute('data-test', '1');
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                },
            ]);
        });

        test('throws when the animation is stopped (without finishing)', async ({ page }) => {
            expect(await page.evaluate(async () => {
                try {
                    const animation = $.animate(
                        '.animate',
                        () => { },
                        {
                            duration: 1000,
                            debug: true,
                        },
                    );
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
                const animation = $.animate(
                    '.animate',
                    () => { },
                    {
                        duration: 100,
                    },
                );
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
                },
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0.5,
                },
            ]);
        });

        test('resolves when the animation is completed', async ({ page }) => {
            const animationHandle = await page.evaluateHandle(() => ({
                animation: $.animate(
                    '.animate',
                    () => { },
                    {
                        duration: 100,
                        debug: true,
                    },
                ),
            }));
            await advanceClock(page, 100);
            await animationHandle.evaluate(async ({ animation }) => {
                await animation;
            });
            await animationHandle.dispose();
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                },
            ]);
        });

        test('completes animations started on the same node inside a callback', async ({ page }) => {
            await page.evaluate(() => {
                $.animate(
                    '#test2',
                    (node, progress) => {
                        if (progress !== 1) {
                            return;
                        }

                        $.animate(
                            node,
                            (node, progress) => {
                                node.dataset.test = progress;
                            },
                            {
                                duration: 100,
                                type: 'linear',
                            },
                        ).then(() => {
                            node.dataset.completed = 'true';
                        });
                    },
                    {
                        duration: 100,
                    },
                );
            });
            await advanceClock(page, 250);
            await expect(page.locator('#test2')).toHaveAttribute('data-test', '1');
            await expect(page.locator('#test2')).toHaveAttribute('data-completed', 'true');
        });

        test('rejects callback errors without freezing later animations', async ({ page }) => {
            await page.evaluate(() => {
                window.animationError = null;

                $.animate(
                    '#test2',
                    () => {
                        throw new Error('Test error');
                    },
                    {
                        duration: 100,
                        debug: true,
                    },
                ).catch((error) => {
                    window.animationError = error.message;
                });

                $.animate(
                    '#test4',
                    (node, progress) => {
                        node.dataset.test = progress;
                    },
                    {
                        duration: 100,
                        type: 'linear',
                        debug: true,
                    },
                );
            });

            await expect.poll(async () => await page.evaluate(() => window.animationError)).toBe('Test error');
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3'],
                },
                {
                    selectors: ['#test4'],
                    progress: 0.5,
                },
            ]);
            await advanceClock(page, 100);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                },
            ]);
            await expect(page.locator('#test4')).toHaveAttribute('data-test', '1');
        });

        test('throws when all animations are stopped (without finishing)', async ({ page }) => {
            expect(await page.evaluate(async () => {
                try {
                    const animation = $.animate(
                        '.animate',
                        () => { },
                        {
                            duration: 1000,
                            debug: true,
                        },
                    );
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
                $.animate(
                    document.getElementById('test2'),
                    () => { },
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
                },
                {
                    selectors: ['#test2'],
                    progress: 0.5,
                },
            ]);
            await advanceClock(page, 100);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                },
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.animate(
                    document.querySelectorAll('.animate'),
                    () => { },
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
                },
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0.5,
                },
            ]);
            await advanceClock(page, 100);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                },
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.animate(
                    document.body.children,
                    () => { },
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
                },
            ]);
            await advanceClock(page, 100);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                },
            ]);
        });

        test('works with array nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.animate(
                    [
                        document.getElementById('test2'),
                        document.getElementById('test4'),
                    ],
                    () => { },
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
                },
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0.5,
                },
            ]);
            await advanceClock(page, 100);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                },
            ]);
        });
    });
});
