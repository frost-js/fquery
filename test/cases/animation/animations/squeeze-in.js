/** @import { Page } from '@playwright/test'; */
/** @import { squeezeIn } from '../../../../src/animation/animations.js'; */

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
    await page.evaluate((_) => {
        document.body.innerHTML =
            '<div id="test1"></div>' +
            '<div id="test2" class="animate"></div>' +
            '<div id="test3"></div>' +
            '<div id="test4" class="animate"></div>';
    });
};

/**
 * Registers shared squeezeIn behavior tests.
 * @param {() => (...args: Parameters<typeof squeezeIn>) => void} createSqueezeIn Creates the browser-side method adapter.
 */
export function squeezeInTests(createSqueezeIn) {
    test('adds a squeeze-in animation to each node', async ({ page }) => {
        const operation = await page.evaluateHandle(createSqueezeIn);

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

    test.describe('timing and easing', () => {
        test('adds a squeeze-in animation to each node with duration', async ({ page }) => {
            const operation = await page.evaluateHandle(createSqueezeIn);

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

        for (const [type, progress, height] of [
            ['linear', 0.5, '50px'],
            ['ease-in', 0.25, '25px'],
            ['ease-out', 0.7071067812, '70.71px'],
        ]) {
            test(`adds a squeeze-in animation to each node (${type})`, async ({ page }) => {
                const operation = await page.evaluateHandle(createSqueezeIn);

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
                        styles: { overflow: '', height: '' },
                    },
                    {
                        selectors: ['#test2', '#test4'],
                        progress,
                        styles: { overflow: 'hidden', height },
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
        }

        test('adds a squeeze-in animation to each node (infinite)', async ({ page }) => {
            const operation = await page.evaluateHandle(createSqueezeIn);

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
                    styles: { overflow: 'hidden', height: '0px' },
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
    });

    test.describe('direction', () => {
        for (const [direction, styles, restoredStyles] of [
            ['top', { overflow: 'hidden', height: '50px', transform: 'translateY(50px)' }, { overflow: '', height: '', transform: '' }],
            ['right', { overflow: 'hidden', width: '50px' }, { overflow: '', width: '' }],
            ['bottom', { overflow: 'hidden', height: '50px' }, { overflow: '', height: '' }],
            ['left', { overflow: 'hidden', width: '50px', transform: 'translateX(50px)' }, { overflow: '', width: '', transform: '' }],
        ]) {
            test(`adds a squeeze-in animation to each node (${direction})`, async ({ page }) => {
                const operation = await page.evaluateHandle(createSqueezeIn);

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
                        styles: restoredStyles,
                    },
                    {
                        selectors: ['#test2', '#test4'],
                        progress: 0.5,
                        styles,
                    },
                ]);
                await advanceClock(page, 100);
                await expectAnimationState(page, [
                    {
                        selectors: ['#test1', '#test2', '#test3', '#test4'],
                        styles: restoredStyles,
                    },
                ]);
            });
        }

        test('adds a squeeze-in animation to each node (direction callback)', async ({ page }) => {
            const operation = await page.evaluateHandle(createSqueezeIn);

            const args = await page.evaluateHandle(() => ['.animate', {
                direction: (_) => 'bottom',
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

    test.describe('box model', () => {
        for (const [name, css, direction, styles] of [
            [
                'uses content-box height for padded elements',
                '.animate { box-sizing: content-box; padding: 10px; }',
                'top',
                { height: '90px', transform: 'translateY(10px)' },
            ],
            [
                'uses border-box height for padded and bordered elements',
                '.animate { box-sizing: border-box; padding: 10px; border: 5px solid; }',
                'top',
                { height: '90px', transform: 'translateY(10px)' },
            ],
            [
                'uses content-box width for padded elements',
                '.animate { box-sizing: content-box; padding: 10px; }',
                'left',
                { width: '90px', transform: 'translateX(10px)' },
            ],
            [
                'uses border-box width for padded and bordered elements',
                '.animate { box-sizing: border-box; padding: 10px; border: 5px solid; }',
                'left',
                { width: '90px', transform: 'translateX(10px)' },
            ],
        ]) {
            test(name, async ({ page }) => {
                const operation = await page.evaluateHandle(createSqueezeIn);

                await page.addStyleTag({ content: css });
                await operation.evaluate((operation, args) => {
                    operation(...args);
                }, ['.animate', {
                    direction,
                    duration: 500,
                    type: 'linear',
                    debug: true,
                }]);
                await advanceClock(page, 450);
                await expectAnimationState(page, [
                    {
                        selectors: ['#test2', '#test4'],
                        progress: 0.9,
                        styles,
                    },
                ]);
            });
        }
    });

    test.describe('style locks and restoration', () => {
        test('preserves important height while resizing', async ({ page }) => {
            const operation = await page.evaluateHandle(createSqueezeIn);

            await page.addStyleTag({ content: '.animate { height: 200px !important; }' });
            await page.evaluate((operation) => {
                document.getElementById('test2').style.setProperty('height', '100px', 'important');
                operation('#test2', { duration: 100 });
            }, operation);
            await advanceClock(page, 50);

            await expect(page.locator('#test2')).toHaveCSS('height', '50px');
        });

        test('preserves important overflow while clipping', async ({ page }) => {
            const operation = await page.evaluateHandle(createSqueezeIn);

            await page.addStyleTag({ content: '.animate { overflow-x: scroll !important; }' });
            await page.evaluate((operation) => {
                document.getElementById('test2').style.setProperty('overflow-x', 'auto', 'important');
                operation('#test2', { duration: 100 });
            }, operation);
            await advanceClock(page, 50);

            await expect(page.locator('#test2')).toHaveCSS('overflow-x', 'hidden');
        });
    });

    test.describe('cloning', () => {
        test('uses the original dimensions while a cloned animation continues', async ({ page }) => {
            const operation = await page.evaluateHandle(createSqueezeIn);

            await page.evaluate((operation) => {
                operation('#test2', {
                    direction: 'top',
                    duration: 200,
                    debug: true,
                });
            }, operation);
            await advanceClock(page, 100);
            await page.evaluate((_) => {
                const [clone] = $.clone('#test2', { animations: true });
                clone.id = 'clone';
                document.body.appendChild(clone);
            });
            await advanceClock(page, 50);

            await expectAnimationState(page, [
                {
                    selectors: ['#test2', '#clone'],
                    progress: 0.875,
                    styles: { height: '87.5px', transform: 'translateY(12.5px)' },
                },
            ]);
        });
    });
}
