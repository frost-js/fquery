import { expect, test } from '#test';
import { advanceClock, resetPage, setupClock } from '../../../setup/browser.js';
import { expectAnimationState } from '../../../support/assertions/animation.js';

test.beforeEach(async ({ page }) => {
    await setupClock(page);
    await resetPage(page);
});

test.describe('QuerySet #animate', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1"></div>' +
                '<div id="test2" class="animate"></div>' +
                '<div id="test3"></div>' +
                '<div id="test4" class="animate"></div>';
        });
    });

    test('adds an animation to each node', async ({ page }) => {
        await page.evaluate((_) => {
            $('.animate')
                .animate(
                    (_) => { },
                    {
                        debug: true,
                    },
                );
        });
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
        await advanceClock(page, 150);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
            },
        ]);
    });

    test('writes and clears debug data on forms with a control named dataset', async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML = '<form id="form"><input name="dataset"></form>';
            $('form').animate((_) => { }, { duration: 100, type: 'linear', debug: true });
        });
        await advanceClock(page, 50);
        expect(Number(await page.locator('#form').getAttribute('data-animation-progress'))).toBeCloseTo(0.5, 10);
        expect(await page.locator('#form').getAttribute('data-animation-start')).not.toBeNull();
        expect(await page.locator('#form').getAttribute('data-animation-time')).not.toBeNull();
        await advanceClock(page, 100);
        expect(await page.locator('#form').getAttribute('data-animation-progress')).toBeNull();
        expect(await page.locator('#form').getAttribute('data-animation-start')).toBeNull();
        expect(await page.locator('#form').getAttribute('data-animation-time')).toBeNull();
    });

    test('adds an animation to each node with duration', async ({ page }) => {
        await page.evaluate((_) => {
            $('.animate')
                .animate(
                    (_) => { },
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

    test('adds an animation to each node (linear)', async ({ page }) => {
        await page.evaluate((_) => {
            $('.animate')
                .animate(
                    (_) => { },
                    {
                        duration: 100,
                        type: 'linear',
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

    test('adds an animation to each node (ease-in)', async ({ page }) => {
        await page.evaluate((_) => {
            $('.animate')
                .animate(
                    (_) => { },
                    {
                        duration: 100,
                        type: 'ease-in',
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
                progress: 0.25,
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
            },
        ]);
    });

    test('adds an animation to each node (ease-out)', async ({ page }) => {
        await page.evaluate((_) => {
            $('.animate')
                .animate(
                    (_) => { },
                    {
                        duration: 100,
                        type: 'ease-out',
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
                progress: 0.7071067812,
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
            },
        ]);
    });

    test('adds an animation to each node (infinite)', async ({ page }) => {
        await page.evaluate((_) => {
            $('.animate')
                .animate(
                    (_) => { },
                    {
                        duration: 100,
                        type: 'linear',
                        infinite: true,
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
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0,
            },
        ]);
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
                .animate(
                    (_) => { },
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
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
            },
        ]);
    });

    test('completes animations started on the same node inside a callback', async ({ page }) => {
        await page.evaluate((_) => {
            $('#test2')
                .animate(
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
                        ).then((_) => {
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

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('.animate');
            return query === query.animate(
                (_) => { },
                {
                    debug: true,
                },
            );
        })).toBe(true);
    });
});
