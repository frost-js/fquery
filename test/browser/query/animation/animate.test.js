import { animateTests, setup } from '#cases/animation/animate.js';
import { expect, test } from '#test';
import { advanceClock } from '../../../setup/browser.js';
import { expectAnimationState } from '../../../support/assertions/animation.js';

test.use({ mockClock: true });

test.describe('QuerySet #animate', () => {
    test.beforeEach(setup);

    animateTests(([nodes, options]) => {
        $(nodes).animate(() => {}, options);
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

    test.describe('start times and zero duration', () => {
        test('completes zero-duration animations with full progress', async ({ page }) => {
            await page.evaluate((_) => {
                $('.animate').animate(
                    (node, progress) => {
                        node.dataset.test = progress;
                    },
                    {
                        duration: 0,
                    },
                );
            });
            await advanceClock(page, 0);
            await expect(page.locator('#test2')).toHaveAttribute('data-test', '1');
            await expect(page.locator('#test4')).toHaveAttribute('data-test', '1');
        });

        test('waits for the start time of zero-duration animations', async ({ page }) => {
            await page.evaluate((_) => {
                $('.animate').animate(
                    (node, progress) => {
                        node.dataset.test = progress;
                    },
                    {
                        duration: 0,
                        start: performance.now() + 100,
                    },
                );
            });
            await advanceClock(page, 50);
            await expect(page.locator('#test2')).toHaveAttribute('data-test', '0');
            await expect(page.locator('#test4')).toHaveAttribute('data-test', '0');
            await advanceClock(page, 100);
            await expect(page.locator('#test2')).toHaveAttribute('data-test', '1');
            await expect(page.locator('#test4')).toHaveAttribute('data-test', '1');
        });

        test('waits for the start time of infinite ease-out animations', async ({ page }) => {
            await page.evaluate((_) => {
                $('.animate').animate(
                    (_) => { },
                    {
                        duration: 100,
                        start: performance.now() + 100,
                        type: 'ease-out',
                        infinite: true,
                        debug: true,
                    },
                );
            });
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0,
                },
            ]);
            await advanceClock(page, 200);
            expect(await page.evaluate((_) => $('.animate').hasAnimation())).toBe(true);
        });
    });

    test.describe('completion and stopping', () => {
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
    });

    test.describe('queues', () => {
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
    });

    test.describe('debug data', () => {
        test('writes debug data on forms with a control named dataset', async ({ page }) => {
            await page.evaluate((_) => {
                document.body.innerHTML = '<form id="form"><input name="dataset"></form>';
                $('form').animate((_) => { }, { duration: 100, type: 'linear', debug: true });
            });
            await advanceClock(page, 50);
            expect(Number(await page.locator('#form').getAttribute('data-animation-progress'))).toBeCloseTo(0.5, 10);
            expect(await page.locator('#form').getAttribute('data-animation-start')).not.toBeNull();
            expect(await page.locator('#form').getAttribute('data-animation-time')).not.toBeNull();
        });

        test('clears debug data on forms with a control named dataset', async ({ page }) => {
            await page.evaluate((_) => {
                document.body.innerHTML = '<form id="form"><input name="dataset"></form>';
                $('form').animate((_) => { }, { duration: 100, type: 'linear', debug: true });
            });
            await advanceClock(page, 150);
            expect(await page.locator('#form').getAttribute('data-animation-progress')).toBeNull();
            expect(await page.locator('#form').getAttribute('data-animation-start')).toBeNull();
            expect(await page.locator('#form').getAttribute('data-animation-time')).toBeNull();
        });
    });
});
