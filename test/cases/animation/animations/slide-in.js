/** @import { Page } from '@playwright/test'; */
/** @import { slideIn } from '../../../../src/animation/animations.js'; */

import { expect, test } from '#test';
import { advanceClock } from '../../../setup/browser.js';
import { expectAnimationState } from '../../../support/assertions/animation.js';

/**
 * Sets up the page for the shared and dedicated tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setup = async ({ page }) => {
    await page.addStyleTag({ content: 'div { width: 100px; height: 100px; }' });
    await page.evaluate(() => {
        document.body.innerHTML =
            '<div id="test1"></div>' +
            '<div id="test2" class="animate"></div>' +
            '<div id="test3"></div>' +
            '<div id="test4" class="animate"></div>';
    });
};

/**
 * Registers shared slideIn behavior tests.
 * @param {() => (...args: Parameters<typeof slideIn>) => void} createSlideIn Creates the browser-side method adapter.
 */
export function slideInTests(createSlideIn) {
    test('adds a slide-in animation to each node', async ({ page }) => {
        const operation = await page.evaluateHandle(createSlideIn);

        await operation.evaluate((operation, args) => {
            operation(...args);
        }, ['.animate', {
            duration: 200,
            debug: true,
        }]);
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
        await advanceClock(page, 150);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { transform: '' },
            },
        ]);
    });

    test.describe('timing and easing', () => {
        test('adds a slide-in animation to each node with duration', async ({ page }) => {
            const operation = await page.evaluateHandle(createSlideIn);

            await operation.evaluate((operation, args) => {
                operation(...args);
            }, ['.animate', {
                duration: 100,
                debug: true,
            }]);
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

        for (const [type, progress, transform] of [
            ['linear', 0.5, 'translateY(50px)'],
            ['ease-in', 0.25, 'translateY(75px)'],
            ['ease-out', 0.7071067812, 'translateY(29.29px)'],
        ]) {
            test(`adds a slide-in animation to each node (${type})`, async ({ page }) => {
                const operation = await page.evaluateHandle(createSlideIn);

                await operation.evaluate((operation, args) => {
                    operation(...args);
                }, ['.animate', {
                    duration: 100,
                    type,
                    debug: true,
                }]);
                await advanceClock(page, 50);
                await expectAnimationState(page, [
                    {
                        selectors: ['#test1', '#test3'],
                        styles: { transform: '' },
                    },
                    {
                        selectors: ['#test2', '#test4'],
                        progress,
                        styles: { transform },
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
        }

        test('adds a slide-in animation to each node (infinite)', async ({ page }) => {
            const operation = await page.evaluateHandle(createSlideIn);

            await operation.evaluate((operation, args) => {
                operation(...args);
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
                    styles: { transform: '' },
                },
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0.5,
                    styles: { transform: 'translateY(50px)' },
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
                    styles: { transform: 'translateY(100px)' },
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
                    styles: { transform: 'translateY(50px)' },
                },
            ]);
        });
    });

    test.describe('direction', () => {
        for (const [direction, transform] of [
            ['top', 'translateY(-50px)'],
            ['right', 'translateX(50px)'],
            ['bottom', 'translateY(50px)'],
            ['left', 'translateX(-50px)'],
        ]) {
            test(`adds a slide-in animation to each node (${direction})`, async ({ page }) => {
                const operation = await page.evaluateHandle(createSlideIn);

                await operation.evaluate((operation, args) => {
                    operation(...args);
                }, ['.animate', {
                    direction,
                    duration: 100,
                    debug: true,
                }]);
                await advanceClock(page, 50);
                await expectAnimationState(page, [
                    {
                        selectors: ['#test1', '#test3'],
                        styles: { transform: '' },
                    },
                    {
                        selectors: ['#test2', '#test4'],
                        progress: 0.5,
                        styles: { transform },
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
        }

        test('adds a slide-in animation to each node (direction callback)', async ({ page }) => {
            const operation = await page.evaluateHandle(createSlideIn);

            const args = await page.evaluateHandle(() => ['.animate', {
                direction: () => 'top',
                duration: 100,
                debug: true,
            }]);
            await operation.evaluate((operation, args) => {
                operation(...args);
            }, args);
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

    test.describe('style locks and restoration', () => {
        test('preserves margins supplied by a variable-based shorthand', async ({ page }) => {
            const operation = await page.evaluateHandle(createSlideIn);

            await page.evaluate((operation) => {
                document.getElementById('test2').style.cssText = '--spacing: 20px; margin: var(--spacing);';
                operation('#test2', { duration: 100 });
            }, operation);
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

        test('preserves important transforms during the animation', async ({ page }) => {
            const operation = await page.evaluateHandle(createSlideIn);

            await page.addStyleTag({ content: '.animate { transform: translateY(200px) !important; }' });
            await page.evaluate((operation) => {
                document.getElementById('test2').style.setProperty('transform', 'none', 'important');
                operation('#test2', { duration: 100 });
            }, operation);
            await advanceClock(page, 50);

            await expect(page.locator('#test2')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 50)');
        });
    });
}
