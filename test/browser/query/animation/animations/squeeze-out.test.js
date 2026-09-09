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

    test('uses content-box height for padded elements', async ({ page }) => {
        await page.addStyleTag({ content: '.animate { box-sizing: content-box; padding: 10px; }' });
        await page.evaluate((_) => {
            $('.animate').squeezeOut({
                direction: 'top',
                duration: 500,
                type: 'linear',
                debug: true,
            });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.1,
                styles: { height: '90px', transform: 'translateY(10px)' },
            },
        ]);
    });

    test('uses border-box height for padded and bordered elements', async ({ page }) => {
        await page.addStyleTag({ content: '.animate { box-sizing: border-box; padding: 10px; border: 5px solid; }' });
        await page.evaluate((_) => {
            $('.animate').squeezeOut({
                direction: 'top',
                duration: 500,
                type: 'linear',
                debug: true,
            });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.1,
                styles: { height: '90px', transform: 'translateY(10px)' },
            },
        ]);
    });

    test('uses content-box width for padded elements', async ({ page }) => {
        await page.addStyleTag({ content: '.animate { box-sizing: content-box; padding: 10px; }' });
        await page.evaluate((_) => {
            $('.animate').squeezeOut({
                direction: 'left',
                duration: 500,
                type: 'linear',
                debug: true,
            });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.1,
                styles: { width: '90px', transform: 'translateX(10px)' },
            },
        ]);
    });

    test('uses border-box width for padded and bordered elements', async ({ page }) => {
        await page.addStyleTag({ content: '.animate { box-sizing: border-box; padding: 10px; border: 5px solid; }' });
        await page.evaluate((_) => {
            $('.animate').squeezeOut({
                direction: 'left',
                duration: 500,
                type: 'linear',
                debug: true,
            });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.1,
                styles: { width: '90px', transform: 'translateX(10px)' },
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
