/** @import { Page } from '@playwright/test'; */
/** @import { AnimationOptions } from '../../../../src/animation/animation.js'; */
/** @import { fadeIn } from '../../../../src/animation/animations.js'; */

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
    await page.evaluate((_) => {
        document.body.innerHTML =
            '<div id="test1"></div>' +
            '<div id="test2" class="animate"></div>' +
            '<div id="test3"></div>' +
            '<div id="test4" class="animate"></div>';
    });
};

/**
 * Registers shared fadeIn behavior tests.
 * @param {() => (...args: Parameters<typeof fadeIn>) => void} createFadeIn Creates the browser-side method adapter.
 */
export function fadeInTests(createFadeIn) {
    test('adds a fade-in animation to each node', async ({ page }) => {
        const operation = await page.evaluateHandle(createFadeIn);

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
                styles: { opacity: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { opacity: '0.5' },
            },
        ]);
        await advanceClock(page, 150);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { opacity: '' },
            },
        ]);
    });

    test.describe('timing and easing', () => {
        test('adds a fade-in animation to each node with duration', async ({ page }) => {
            const operation = await page.evaluateHandle(createFadeIn);

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
                    styles: { opacity: '' },
                },
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0.5,
                    styles: { opacity: '0.5' },
                },
            ]);
            await advanceClock(page, 100);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                    styles: { opacity: '' },
                },
            ]);
        });

        for (const [type, progress, opacity] of [
            ['linear', 0.5, '0.5'],
            ['ease-in', 0.25, '0.25'],
            ['ease-out', 0.7071067812, '0.71'],
        ]) {
            test(`adds a fade-in animation to each node (${type})`, async ({ page }) => {
                const operation = await page.evaluateHandle(createFadeIn);

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
                        styles: { opacity: '' },
                    },
                    {
                        selectors: ['#test2', '#test4'],
                        progress,
                        styles: { opacity },
                    },
                ]);
                await advanceClock(page, 100);
                await expectAnimationState(page, [
                    {
                        selectors: ['#test1', '#test2', '#test3', '#test4'],
                        styles: { opacity: '' },
                    },
                ]);
            });
        }

        test('adds a fade-in animation to each node (infinite)', async ({ page }) => {
            const operation = await page.evaluateHandle(createFadeIn);

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
                    styles: { opacity: '' },
                },
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0.5,
                    styles: { opacity: '0.5' },
                },
            ]);
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test3'],
                    styles: { opacity: '' },
                },
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0,
                    styles: { opacity: '0' },
                },
            ]);
            await advanceClock(page, 50);
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test3'],
                    styles: { opacity: '' },
                },
                {
                    selectors: ['#test2', '#test4'],
                    progress: 0.5,
                    styles: { opacity: '0.5' },
                },
            ]);
        });
    });

    test.describe('style locks and restoration', () => {
        test('preserves important opacity during the animation', async ({ page }) => {
            const operation = await page.evaluateHandle(createFadeIn);

            await page.addStyleTag({ content: '.animate { opacity: 0.25 !important; }' });
            await page.evaluate((operation) => {
                document.getElementById('test2').style.setProperty('opacity', '1', 'important');
                operation('#test2', { duration: 100 });
            }, operation);
            await advanceClock(page, 50);

            await expect(page.locator('#test2')).toHaveCSS('opacity', '0.5');
        });

        test('does not promote normal opacity to important', async ({ page }) => {
            const operation = await page.evaluateHandle(createFadeIn);

            await page.addStyleTag({ content: '.animate { opacity: 0.25 !important; }' });
            await page.evaluate((operation) => {
                document.getElementById('test2').style.setProperty('opacity', '1');
                operation('#test2', { duration: 100 });
            }, operation);
            await advanceClock(page, 50);

            await expect(page.locator('#test2')).toHaveCSS('opacity', '0.25');
        });
    });

    test.describe('cloning', () => {
        test('restores the original opacity of each node on cloned animations', async ({ page }) => {
            const operation = await page.evaluateHandle(createFadeIn);

            await page.evaluate((operation) => {
                document.getElementById('test2').style.opacity = '0.25';
                document.getElementById('test4').style.opacity = '0.75';
                operation('.animate', { duration: 100 });
            }, operation);
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const clones = $.clone('.animate', { animations: true });
                for (const clone of clones) {
                    clone.id += '-clone';
                    document.body.appendChild(clone);
                }
            });
            await advanceClock(page, 100);

            await expectAnimationState(page, [
                {
                    selectors: ['#test2', '#test2-clone'],
                    styles: { opacity: '0.25' },
                },
                {
                    selectors: ['#test4', '#test4-clone'],
                    styles: { opacity: '0.75' },
                },
            ]);
        });
    });
}

/**
 * Registers shared fadeIn stopping tests.
 * @param {((args: [string, AnimationOptions]) => () => void)} startStoppableFadeIn Starts the animation and returns its stop callback.
 */
export function fadeInStoppingTests(startStoppableFadeIn) {
    test.describe('completion and stopping', () => {
        test('releases opacity without restoring when stopped without finishing', async ({ page }) => {
            const stop = await page.evaluateHandle(startStoppableFadeIn, ['#test2', { duration: 100 }]);
            await advanceClock(page, 50);
            await stop.evaluate((stop) => {
                stop();
                const release = $.setStyleLock('#test2', 'opacity', 0.75);
                release();
            });
            await stop.dispose();

            await expectAnimationState(page, [
                {
                    selectors: ['#test2'],
                    styles: { opacity: '0.5' },
                },
            ]);
        });
    });
}
