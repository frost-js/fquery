import { setup, stopTests } from '#cases/animation/stop.js';
import { test } from '#test';
import { advanceClock } from '../../../setup/browser.js';
import { expectAnimationState } from '../../../support/assertions/animation.js';

test.use({ mockClock: true });

test.describe('#stop', () => {
    test.beforeEach(setup);

    stopTests((args) => {
        $.stop(...args);
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            await page.evaluate((_) => {
                $.animate(
                    '.animate',
                    (_) => { },
                    {
                        duration: 100,
                        debug: true,
                    },
                );
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $.stop(document.getElementById('test2'));
            });
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3'],
                },
                {
                    selectors: ['#test4'],
                    progress: 0.5,
                },
            ]);
        });

        test('works with NodeList nodes', async ({ page }) => {
            await page.evaluate((_) => {
                $.animate(
                    '.animate',
                    (_) => { },
                    {
                        duration: 100,
                        debug: true,
                    },
                );
            });
            await advanceClock(page, 25);
            await page.evaluate((_) => {
                $.stop(document.querySelectorAll('.animate'));
            });
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                },
            ]);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            await page.evaluate((_) => {
                $.animate(
                    '.animate',
                    (_) => { },
                    {
                        duration: 100,
                        debug: true,
                    },
                );
            });
            await advanceClock(page, 25);
            await page.evaluate((_) => {
                $.stop(document.body.children);
            });
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                },
            ]);
        });

        test('works with array nodes', async ({ page }) => {
            await page.evaluate((_) => {
                $.animate(
                    '.animate',
                    (_) => { },
                    {
                        duration: 100,
                        debug: true,
                    },
                );
            });
            await advanceClock(page, 25);
            await page.evaluate((_) => {
                $.stop([
                    document.getElementById('test2'),
                    document.getElementById('test4'),
                ]);
            });
            await expectAnimationState(page, [
                {
                    selectors: ['#test1', '#test2', '#test3', '#test4'],
                },
            ]);
        });
    });
});
