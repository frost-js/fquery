import { fadeInStoppingTests, fadeInTests, setup } from '#cases/animation/animations/fade-in.js';
import { expect, test } from '#test';
import { advanceClock } from '../../../../setup/browser.js';
import { expectAnimationState } from '../../../../support/assertions/animation.js';

test.use({ mockClock: true });

test.describe('QuerySet #fadeIn', () => {
    test.beforeEach(setup);

    fadeInTests(() => (nodes, ...args) => {
        $(nodes).fadeIn(...args);
    });

    fadeInStoppingTests(([nodes, options]) => {
        const query = $(nodes).fadeIn(options);
        return () => query.stop({ finish: false });
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate(() => {
            const query = $('.animate');
            return query === query.fadeIn(
                {
                    debug: true,
                },
            );
        })).toBe(true);
    });

    test.describe('style locks and restoration', () => {
        test('holds an opacity lock while the animation is active', async ({ page }) => {
            await page.evaluate(() => {
                $('#test2').fadeIn({ duration: 100 });
            });
            await advanceClock(page, 50);

            expect(await page.evaluate(() => {
                try {
                    $('#test2').setStyleLock('opacity', 0.25);
                } catch (error) {
                    return error.message;
                }
            })).toBe('CSS property "opacity" is already locked.');
        });
    });

    test.describe('queues', () => {
        test('releases opacity before the next queued effect starts', async ({ page }) => {
            await page.evaluate(() => {
                $('#test2').fadeIn({ duration: 100 }).fadeOut({ duration: 100 });
            });
            await advanceClock(page, 150);

            await expectAnimationState(page, [
                {
                    selectors: ['#test2'],
                    styles: { opacity: '0.5' },
                },
            ]);
        });

        test('adds the animation to the queue', async ({ page }) => {
            await page.evaluate(() => {
                $('.animate')
                    .queue(() =>
                        new Promise((resolve) =>
                            setTimeout(resolve, 100),
                        ),
                    );
                $('.animate')
                    .fadeIn(
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
});
