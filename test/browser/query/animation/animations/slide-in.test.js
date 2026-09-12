import { setup, slideInTests } from '#cases/animation/animations/slide-in.js';
import { expect, test } from '#test';
import { advanceClock } from '../../../../setup/browser.js';
import { expectAnimationState } from '../../../../support/assertions/animation.js';

test.use({ mockClock: true });

test.describe('QuerySet #slideIn', () => {
    test.beforeEach(setup);

    slideInTests(([nodes, ...args]) => {
        $(nodes).slideIn(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('.animate');
            return query === query.slideIn(
                {
                    debug: true,
                },
            );
        })).toBe(true);
    });

    test.describe('style locks and restoration', () => {
        test('preserves margins supplied by a variable-based shorthand', async ({ page }) => {
            await page.evaluate((_) => {
                document.getElementById('test2').style.cssText = '--spacing: 20px; margin: var(--spacing);';
                $('#test2').slideIn({ duration: 100 });
            });
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
            await page.addStyleTag({ content: '.animate { transform: translateY(200px) !important; }' });
            await page.evaluate((_) => {
                document.getElementById('test2').style.setProperty('transform', 'none', 'important');
                $('#test2').slideIn({ duration: 100 });
            });
            await advanceClock(page, 50);

            await expect(page.locator('#test2')).toHaveCSS('transform', 'matrix(1, 0, 0, 1, 0, 50)');
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
                    .slideIn(
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
});
