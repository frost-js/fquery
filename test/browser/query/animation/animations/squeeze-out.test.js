import { expect, test } from '#test';
import { advanceClock, resetPage, setupClock } from '../../../../setup/browser.js';
import { expectAnimationState } from '../../../../support/assertions/animation.js';

test.beforeEach(async ({ page }) => {
    await setupClock(page);
    await resetPage(page);
});

test.describe('QuerySet #squeezeOut', () => {
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

    test('adds a squeeze-out animation to each node', async ({ page }) => {
        await page.evaluate((_) => {
            $('.animate')
                .squeezeOut({
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
            $('.animate')
                .squeezeOut({
                    duration: 100,
                    debug: true,
                });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', height: '50px' },
            },
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '' },
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
            $('.animate')
                .squeezeOut({
                    direction: 'top',
                    duration: 100,
                    debug: true,
                });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', height: '50px', transform: 'translateY(50px)' },
            },
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '', transform: '' },
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
            $('.animate')
                .squeezeOut({
                    direction: 'right',
                    duration: 100,
                    debug: true,
                });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', width: '50px' },
            },
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', width: '' },
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
            $('.animate')
                .squeezeOut({
                    direction: 'bottom',
                    duration: 100,
                    debug: true,
                });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', height: '50px' },
            },
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '' },
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
            $('.animate')
                .squeezeOut({
                    direction: 'left',
                    duration: 100,
                    debug: true,
                });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', width: '50px', transform: 'translateX(50px)' },
            },
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', width: '', transform: '' },
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
            $('.animate')
                .squeezeOut({
                    direction: (_) => 'bottom',
                    duration: 100,
                    debug: true,
                });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', height: '50px' },
            },
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '' },
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
            $('.animate')
                .squeezeOut({
                    duration: 100,
                    useGpu: false,
                    debug: true,
                });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', height: '50px' },
            },
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '' },
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
            $('.animate')
                .squeezeOut({
                    direction: 'top',
                    duration: 100,
                    useGpu: false,
                    debug: true,
                });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', height: '50px', marginTop: '50px' },
            },
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '', marginTop: '' },
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
            $('.animate')
                .squeezeOut({
                    direction: 'right',
                    duration: 100,
                    useGpu: false,
                    debug: true,
                });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', width: '50px' },
            },
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', width: '' },
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
            $('.animate')
                .squeezeOut({
                    direction: 'bottom',
                    duration: 100,
                    useGpu: false,
                    debug: true,
                });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', height: '50px' },
            },
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '' },
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
            $('.animate')
                .squeezeOut({
                    direction: 'left',
                    duration: 100,
                    useGpu: false,
                    debug: true,
                });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', width: '50px', marginLeft: '50px' },
            },
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', width: '', marginLeft: '' },
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
            $('.animate')
                .squeezeOut({
                    duration: 100,
                    type: 'linear',
                    debug: true,
                });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', height: '50px' },
            },
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '' },
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
            $('.animate')
                .squeezeOut({
                    duration: 100,
                    type: 'ease-in',
                    debug: true,
                });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.25,
                styles: { overflow: 'hidden', height: '75px' },
            },
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '' },
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
            $('.animate')
                .squeezeOut({
                    duration: 100,
                    type: 'ease-out',
                    debug: true,
                });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.7071067812,
                styles: { overflow: 'hidden', height: '29.29px' },
            },
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '' },
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
            $('.animate')
                .squeezeOut({
                    duration: 100,
                    type: 'linear',
                    infinite: true,
                    debug: true,
                });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', height: '50px' },
            },
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '' },
            },
        ]);
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0,
                styles: { overflow: 'hidden', height: '100px' },
            },
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '' },
            },
        ]);
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', height: '50px' },
            },
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '' },
            },
        ]);
    });

    test('adds the animation to the queue', async ({ page }) => {
        await page.evaluate((_) => {
            $('.animate')
                .queue((_) =>
                    new Promise((resolve) =>
                        setTimeout(resolve, 100),
                    ),
                );
            $('.animate')
                .squeezeOut(
                    {
                        duration: 100,
                        debug: true,
                    },
                );
        });
        await advanceClock(page, 50);
        expect(await page.evaluate((_) => document.body.innerHTML)).toBe('<div id="test1"></div>' +
                '<div id="test2" class="animate"></div>' +
                '<div id="test3"></div>' +
                '<div id="test4" class="animate"></div>');
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

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('.animate');
            return query === query.squeezeOut(
                {
                    debug: true,
                },
            );
        })).toBe(true);
    });
});
