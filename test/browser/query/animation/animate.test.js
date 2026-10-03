import { animateTests, setup } from '#cases/animation/animate.js';
import { expect, test } from '#test';
import { advanceClock } from '../../../setup/browser.js';
import { expectAnimationState } from '../../../support/assertions/animation.js';

test.use({ mockClock: true });

test.describe('QuerySet #animate', () => {
    test.beforeEach(setup);

    animateTests(() => (nodes, ...args) => {
        $(nodes).animate(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate(() => {
            const query = $('.animate');
            return query === query.animate(
                () => { },
                {
                    debug: true,
                },
            );
        })).toBe(true);
    });

    test.describe('completion and stopping', () => {
        test('completes animations started on the same node inside a callback', async ({ page }) => {
            await page.evaluate(() => {
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
    });

    test.describe('queues', () => {
        test('adds the animation to the queue', async ({ page }) => {
            await page.evaluate(() => {
                $('.animate')
                    .queue(() =>
                        new Promise((resolve) =>
                            setTimeout(resolve, 100),
                        ),
                    );
                $('.animate')
                    .animate(
                        () => { },
                        {
                            duration: 100,
                            debug: true,
                        },
                    );
            });
            await advanceClock(page, 50);
            expect(await page.evaluate(() => document.body.innerHTML)).toBe('<div id="test1"></div>' +
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
});
