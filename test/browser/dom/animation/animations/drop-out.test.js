import { expect, test } from '#test';
import { advanceClock, resetPage, setupClock } from '../../../../setup/browser.js';
import { expectAnimationState } from '../../../../support/assertions/animation.js';

test.beforeEach(async ({ page }) => {
    await setupClock(page);
    await resetPage(page);
});

test.describe('#dropOut', () => {
    test.beforeEach(async ({ page }) => {
        await page.addStyleTag({ content: 'div { width: 100px; height: 100px; }' });
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1"></div>' +
                '<div id="test2" class="animate"></div>' +
                '<div id="test3"></div>' +
                '<div id="test4" class="animate"></div>';
        });
    });

    test('adds a drop-out animation to each node', async ({ page }) => {
        await page.evaluate((_) => {
            $.dropOut('.animate', {
                debug: true,
            });
        });
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { transform: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { transform: 'translateY(-50px)' },
            },
        ]);
        await advanceClock(page, 150);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { transform: '' },
            },
        ]);
    });

    test('adds a drop-out animation to each node with duration', async ({ page }) => {
        await page.evaluate((_) => {
            $.dropOut('.animate', {
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
                styles: { transform: 'translateY(-50px)' },
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

    test('adds a drop-out animation to each node (top)', async ({ page }) => {
        await page.evaluate((_) => {
            $.dropOut('.animate', {
                direction: 'top',
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
                styles: { transform: 'translateY(-50px)' },
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

    test('adds a drop-out animation to each node (right)', async ({ page }) => {
        await page.evaluate((_) => {
            $.dropOut('.animate', {
                direction: 'right',
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
                styles: { transform: 'translateX(50px)' },
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

    test('adds a drop-out animation to each node (bottom)', async ({ page }) => {
        await page.evaluate((_) => {
            $.dropOut('.animate', {
                direction: 'bottom',
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

    test('adds a drop-out animation to each node (left)', async ({ page }) => {
        await page.evaluate((_) => {
            $.dropOut('.animate', {
                direction: 'left',
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
                styles: { transform: 'translateX(-50px)' },
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

    test('adds a drop-out animation to each node (direction callback)', async ({ page }) => {
        await page.evaluate((_) => {
            $.dropOut('.animate', {
                direction: (_) => 'bottom',
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

    test('adds a drop-out animation to each node without gpu', async ({ page }) => {
        await page.evaluate((_) => {
            $.dropOut('.animate', {
                duration: 100,
                useGpu: false,
                debug: true,
            });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { marginTop: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { marginTop: '-50px' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { marginTop: '' },
            },
        ]);
    });

    test('adds a drop-out animation to each node without gpu (top)', async ({ page }) => {
        await page.evaluate((_) => {
            $.dropOut('.animate', {
                direction: 'top',
                duration: 100,
                useGpu: false,
                debug: true,
            });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { marginTop: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { marginTop: '-50px' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { marginTop: '' },
            },
        ]);
    });

    test('adds a drop-out animation to each node without gpu (right)', async ({ page }) => {
        await page.evaluate((_) => {
            $.dropOut('.animate', {
                direction: 'right',
                duration: 100,
                useGpu: false,
                debug: true,
            });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { marginLeft: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { marginLeft: '50px' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { marginLeft: '' },
            },
        ]);
    });

    test('adds a drop-out animation to each node without gpu (bottom)', async ({ page }) => {
        await page.evaluate((_) => {
            $.dropOut('.animate', {
                direction: 'bottom',
                duration: 100,
                useGpu: false,
                debug: true,
            });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { marginTop: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { marginTop: '50px' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { marginTop: '' },
            },
        ]);
    });

    test('adds a drop-out animation to each node without gpu (left)', async ({ page }) => {
        await page.evaluate((_) => {
            $.dropOut('.animate', {
                direction: 'left',
                duration: 100,
                useGpu: false,
                debug: true,
            });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { marginLeft: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { marginLeft: '-50px' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { marginLeft: '' },
            },
        ]);
    });

    test('adds a drop-out animation to each node (linear)', async ({ page }) => {
        await page.evaluate((_) => {
            $.dropOut('.animate', {
                duration: 100,
                type: 'linear',
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
                styles: { transform: 'translateY(-50px)' },
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

    test('adds a drop-out animation to each node (ease-in)', async ({ page }) => {
        await page.evaluate((_) => {
            $.dropOut('.animate', {
                duration: 100,
                type: 'ease-in',
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
                progress: 0.25,
                styles: { transform: 'translateY(-25px)' },
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

    test('adds a drop-out animation to each node (ease-out)', async ({ page }) => {
        await page.evaluate((_) => {
            $.dropOut('.animate', {
                duration: 100,
                type: 'ease-out',
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
                progress: 0.7071067812,
                styles: { transform: 'translateY(-70.71px)' },
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

    test('adds a drop-out animation to each node (infinite)', async ({ page }) => {
        await page.evaluate((_) => {
            $.dropOut('.animate', {
                duration: 100,
                type: 'linear',
                infinite: true,
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
                styles: { transform: 'translateY(-50px)' },
            },
        ]);
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { transform: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0,
                styles: { transform: 'translateY(0px)' },
            },
        ]);
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { transform: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { transform: 'translateY(-50px)' },
            },
        ]);
    });

    test('can be stopped', async ({ page }) => {
        const animationHandle = await page.evaluateHandle((_) => ({
            animation: $.dropOut('.animate', {
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
            const animation = $.dropOut('.animate', {
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
                styles: { transform: 'translateY(-50px)' },
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
                styles: { transform: 'translateY(-50px)' },
            },
        ]);
    });

    test('resolves when the animation is stopped', async ({ page }) => {
        await page.evaluate(async (_) => {
            const animation = $.dropOut('.animate', {
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
                const animation = $.dropOut('.animate', {
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
            const animation = $.dropOut('.animate', {
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
            animation: $.dropOut('.animate', {
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
                const animation = $.dropOut('.animate', {
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

    test('works with HTMLElement nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.dropOut(
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
                styles: { transform: 'translateY(-50px)' },
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
            $.dropOut(
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
                styles: { transform: 'translateY(-50px)' },
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
            $.dropOut(
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
                styles: { transform: 'translateY(-50px)' },
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
            $.dropOut([
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
                styles: { transform: 'translateY(-50px)' },
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
