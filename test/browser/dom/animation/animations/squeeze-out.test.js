import { expect, test } from '#test';
import { advanceClock, resetPage, setupClock } from '../../../../setup/browser.js';
import { expectAnimationState } from '../../../../support/assertions/animation.js';

test.beforeEach(async ({ page }) => {
    await setupClock(page);
    await resetPage(page);
});

test.describe('#squeezeOut', () => {
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

    test('restores existing inline dimensions, margins and overflow', async ({ page }) => {
        await page.evaluate((_) => {
            for (const node of document.querySelectorAll('.animate')) {
                node.style.setProperty('height', '80px');
                node.style.setProperty('margin-left', '10px');
                node.style.setProperty('margin-top', '20px');
                node.style.setProperty('overflow', 'scroll');
                node.style.setProperty('width', '90px');
            }

            $.squeezeOut('.animate', {
                direction: 'left',
                duration: 100,
                useGpu: false,
            });
        });
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                styles: {
                    height: '80px',
                    marginLeft: '10px',
                    marginTop: '20px',
                    overflow: 'scroll',
                    width: '90px',
                },
            },
        ]);
    });

    test('adds a squeeze-out animation to each node', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeOut('.animate', {
                debug: true,
            });
        });
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
        await advanceClock(page, 150);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { overflow: '', height: '' },
            },
        ]);
    });

    test('adds a squeeze-out animation to each node with duration', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeOut('.animate', {
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

    test('adds a squeeze-out animation to each node (top)', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeOut('.animate', {
                direction: 'top',
                duration: 100,
                debug: true,
            });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '', transform: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', height: '50px', transform: 'translateY(50px)' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { overflow: '', height: '', transform: '' },
            },
        ]);
    });

    test('adds a squeeze-out animation to each node (right)', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeOut('.animate', {
                direction: 'right',
                duration: 100,
                debug: true,
            });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', width: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', width: '50px' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { overflow: '', width: '' },
            },
        ]);
    });

    test('adds a squeeze-out animation to each node (bottom)', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeOut('.animate', {
                direction: 'bottom',
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

    test('adds a squeeze-out animation to each node (left)', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeOut('.animate', {
                direction: 'left',
                duration: 100,
                debug: true,
            });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', width: '', transform: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', width: '50px', transform: 'translateX(50px)' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { overflow: '', width: '', transform: '' },
            },
        ]);
    });

    test('adds a squeeze-out animation to each node (direction callback)', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeOut('.animate', {
                direction: (_) => 'bottom',
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

    test('adds a squeeze-out animation to each node without gpu', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeOut('.animate', {
                duration: 100,
                useGpu: false,
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

    test('adds a squeeze-out animation to each node without gpu (top)', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeOut('.animate', {
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
                styles: { overflow: '', height: '', marginTop: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', height: '50px', marginTop: '50px' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { overflow: '', height: '', marginTop: '' },
            },
        ]);
    });

    test('adds a squeeze-out animation to each node without gpu (right)', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeOut('.animate', {
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
                styles: { overflow: '', width: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', width: '50px' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { overflow: '', width: '' },
            },
        ]);
    });

    test('adds a squeeze-out animation to each node without gpu (bottom)', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeOut('.animate', {
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

    test('adds a squeeze-out animation to each node without gpu (left)', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeOut('.animate', {
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
                styles: { overflow: '', width: '', marginLeft: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', width: '50px', marginLeft: '50px' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { overflow: '', width: '', marginLeft: '' },
            },
        ]);
    });

    test('adds a squeeze-out animation to each node (linear)', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeOut('.animate', {
                duration: 100,
                type: 'linear',
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

    test('adds a squeeze-out animation to each node (ease-in)', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeOut('.animate', {
                duration: 100,
                type: 'ease-in',
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
                progress: 0.25,
                styles: { overflow: 'hidden', height: '75px' },
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

    test('adds a squeeze-out animation to each node (ease-out)', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeOut('.animate', {
                duration: 100,
                type: 'ease-out',
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
                progress: 0.7071067812,
                styles: { overflow: 'hidden', height: '29.29px' },
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

    test('adds a squeeze-out animation to each node (infinite)', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeOut('.animate', {
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
                styles: { overflow: '', height: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', height: '50px' },
            },
        ]);
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0,
                styles: { overflow: 'hidden', height: '100px' },
            },
        ]);
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
    });

    test('can be stopped', async ({ page }) => {
        const animationHandle = await page.evaluateHandle((_) => ({
            animation: $.squeezeOut('.animate', {
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
        const animationHandle = await page.evaluateHandle((_) => {
            const animation = $.squeezeOut('.animate', {
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
        await page.evaluate(async (_) => {
            const animation = $.squeezeOut('.animate', {
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
        expect(await page.evaluate(async (_) => {
            try {
                const animation = $.squeezeOut('.animate', {
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
            const animation = $.squeezeOut('.animate', {
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
        const animationHandle = await page.evaluateHandle((_) => ({
            animation: $.squeezeOut('.animate', {
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
        expect(await page.evaluate(async (_) => {
            try {
                const animation = $.squeezeOut('.animate', {
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
            $.squeezeOut(
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
        await page.evaluate((_) => {
            $.squeezeOut(
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
        await page.evaluate((_) => {
            $.squeezeOut(
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
        await page.evaluate((_) => {
            $.squeezeOut([
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
