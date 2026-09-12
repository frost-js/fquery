import { fadeInTests, setup } from '#cases/animation/animations/fade-in.js';
import { expect, test } from '#test';
import { advanceClock } from '../../../../setup/browser.js';
import { expectAnimationState } from '../../../../support/assertions/animation.js';

test.use({ mockClock: true });

test.describe('QuerySet #fadeIn', () => {
    test.beforeEach(setup);

    fadeInTests(([nodes, ...args]) => {
        $(nodes).fadeIn(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('.animate');
            return query === query.fadeIn(
                {
                    debug: true,
                },
            );
        })).toBe(true);
    });

    test.describe('style locks and restoration', () => {
        test('preserves important opacity during the animation', async ({ page }) => {
            await page.addStyleTag({ content: '.animate { opacity: 0.25 !important; }' });
            await page.evaluate((_) => {
                document.getElementById('test2').style.setProperty('opacity', '1', 'important');
                $('#test2').fadeIn({ duration: 100 });
            });
            await advanceClock(page, 50);

            await expect(page.locator('#test2')).toHaveCSS('opacity', '0.5');
        });

        test('does not promote normal opacity to important', async ({ page }) => {
            await page.addStyleTag({ content: '.animate { opacity: 0.25 !important; }' });
            await page.evaluate((_) => {
                document.getElementById('test2').style.setProperty('opacity', '1');
                $('#test2').fadeIn({ duration: 100 });
            });
            await advanceClock(page, 50);

            await expect(page.locator('#test2')).toHaveCSS('opacity', '0.25');
        });

        test('holds an opacity lock while the animation is active', async ({ page }) => {
            await page.evaluate((_) => {
                $('#test2').fadeIn({ duration: 100 });
            });
            await advanceClock(page, 50);

            expect(await page.evaluate((_) => {
                try {
                    $('#test2').setStyleLock('opacity', 0.25);
                } catch (error) {
                    return error.message;
                }
            })).toBe('CSS property "opacity" is already locked.');
        });
    });

    test.describe('cloning', () => {
        test('restores the original opacity of each node on cloned animations', async ({ page }) => {
            await page.evaluate((_) => {
                document.getElementById('test2').style.opacity = '0.25';
                document.getElementById('test4').style.opacity = '0.75';
                $('.animate').fadeIn({ duration: 100 });
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                const clones = $('.animate').clone({ animations: true }).get();
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

    test.describe('completion and stopping', () => {
        test('releases opacity without restoring when stopped without finishing', async ({ page }) => {
            await page.evaluate((_) => {
                $('#test2').fadeIn({ duration: 100 });
            });
            await advanceClock(page, 50);
            await page.evaluate((_) => {
                $('#test2').stop({ finish: false });
                const release = $('#test2').setStyleLock('opacity', 0.75);
                release();
            });

            await expectAnimationState(page, [
                {
                    selectors: ['#test2'],
                    styles: { opacity: '0.5' },
                },
            ]);
        });
    });

    test.describe('queues', () => {
        test('releases opacity before the next queued effect starts', async ({ page }) => {
            await page.evaluate((_) => {
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
            await page.evaluate((_) => {
                $('.animate')
                    .queue((_) =>
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
            expect(await page.evaluate((_) => document.body.innerHTML)).toBe('<div id="test1"></div>' +
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
