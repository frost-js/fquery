/** @import { Page } from '@playwright/test'; */
/** @import { animate } from '../../../src/animation/animate.js'; */

import { expect, test } from '#test';
import { advanceClock } from '../../setup/browser.js';
import { expectAnimationState } from '../../support/assertions/animation.js';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.evaluate(() => {
        document.body.innerHTML =
            '<div id="test1"></div>' +
            '<div id="test2" class="animate"></div>' +
            '<div id="test3"></div>' +
            '<div id="test4" class="animate"></div>';
    });
};

/**
 * Registers shared animate behavior tests.
 * @param {() => (...args: Parameters<typeof animate>) => void} createAnimate Creates the browser-side method adapter.
 */
export function animateTests(createAnimate) {
    test('adds an animation to each node', async ({ page }) => {
        const operation = await page.evaluateHandle(createAnimate);

        await operation.evaluate((operation, [nodes, options]) => {
            operation(nodes, () => {}, options);
        }, ['.animate', {
            duration: 200,
            debug: true,
        }]);
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

    test.describe('timing and easing', () => {
        test('adds an animation to each node with duration', async ({ page }) => {
            const operation = await page.evaluateHandle(createAnimate);

            await operation.evaluate((operation, [nodes, options]) => {
                operation(nodes, () => {}, options);
            }, ['.animate', {
                duration: 100,
                debug: true,
            }]);
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

        for (const [type, progress] of [
            ['linear', 0.5],
            ['ease-in', 0.25],
            ['ease-out', 0.7071067812],
        ]) {
            test(`adds an animation to each node (${type})`, async ({ page }) => {
                const operation = await page.evaluateHandle(createAnimate);

                await operation.evaluate((operation, [nodes, options]) => {
                    operation(nodes, () => {}, options);
                }, ['.animate', {
                    duration: 100,
                    type,
                    debug: true,
                }]);
                await advanceClock(page, 50);
                await expectAnimationState(page, [
                    {
                        selectors: ['#test1', '#test3'],
                    },
                    {
                        selectors: ['#test2', '#test4'],
                        progress,
                    },
                ]);
                await advanceClock(page, 100);
                await expectAnimationState(page, [
                    {
                        selectors: ['#test1', '#test2', '#test3', '#test4'],
                    },
                ]);
            });
        }

        test('adds an animation to each node (infinite)', async ({ page }) => {
            const operation = await page.evaluateHandle(createAnimate);

            await operation.evaluate((operation, [nodes, options]) => {
                operation(nodes, () => {}, options);
            }, ['.animate', {
                duration: 100,
                type: 'linear',
                infinite: true,
                debug: true,
            }]);
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
    });

    test.describe('start times and zero duration', () => {
        test('completes zero-duration animations with full progress', async ({ page }) => {
            const operation = await page.evaluateHandle(createAnimate);

            await page.evaluate((operation) => {
                operation(
                    '.animate',
                    (node, progress) => {
                        node.dataset.test = progress;
                    },
                    {
                        duration: 0,
                    },
                );
            }, operation);
            await advanceClock(page, 0);
            await expect(page.locator('#test2')).toHaveAttribute('data-test', '1');
            await expect(page.locator('#test4')).toHaveAttribute('data-test', '1');
        });

        test('waits for the start time of zero-duration animations', async ({ page }) => {
            const operation = await page.evaluateHandle(createAnimate);

            await page.evaluate((operation) => {
                operation(
                    '.animate',
                    (node, progress) => {
                        node.dataset.test = progress;
                    },
                    {
                        duration: 0,
                        start: performance.now() + 100,
                    },
                );
            }, operation);
            await advanceClock(page, 50);
            await expect(page.locator('#test2')).toHaveAttribute('data-test', '0');
            await expect(page.locator('#test4')).toHaveAttribute('data-test', '0');
            await advanceClock(page, 100);
            await expect(page.locator('#test2')).toHaveAttribute('data-test', '1');
            await expect(page.locator('#test4')).toHaveAttribute('data-test', '1');
        });

        test('waits for the start time of infinite ease-out animations', async ({ page }) => {
            const operation = await page.evaluateHandle(createAnimate);

            await page.evaluate((operation) => {
                operation(
                    '.animate',
                    () => { },
                    {
                        duration: 100,
                        start: performance.now() + 100,
                        type: 'ease-out',
                        infinite: true,
                        debug: true,
                    },
                );
            }, operation);
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0,
                },
            ]);
            await advanceClock(page, 200);
            expect(await page.evaluate(() => $.hasAnimation('.animate'))).toBe(true);
        });
    });

    test.describe('debug data', () => {
        test('writes debug data on forms with a control named dataset', async ({ page }) => {
            const operation = await page.evaluateHandle(createAnimate);

            await page.evaluate((operation) => {
                document.body.innerHTML = '<form id="form"><input name="dataset"></form>';
                operation('form', () => { }, { duration: 100, type: 'linear', debug: true });
            }, operation);
            await advanceClock(page, 50);
            expect(Number(await page.locator('#form').getAttribute('data-animation-progress'))).toBeCloseTo(0.5, 10);
            expect(await page.locator('#form').getAttribute('data-animation-start')).not.toBeNull();
            expect(await page.locator('#form').getAttribute('data-animation-time')).not.toBeNull();
        });

        test('clears debug data on forms with a control named dataset', async ({ page }) => {
            const operation = await page.evaluateHandle(createAnimate);

            await page.evaluate((operation) => {
                document.body.innerHTML = '<form id="form"><input name="dataset"></form>';
                operation('form', () => { }, { duration: 100, type: 'linear', debug: true });
            }, operation);
            await advanceClock(page, 150);
            expect(await page.locator('#form').getAttribute('data-animation-progress')).toBeNull();
            expect(await page.locator('#form').getAttribute('data-animation-start')).toBeNull();
            expect(await page.locator('#form').getAttribute('data-animation-time')).toBeNull();
        });
    });
}
