import { setup, squeezeInTests } from '#cases/animation/animations/squeeze-in.js';
import { expect, test } from '#test';
import { advanceClock } from '../../../../setup/browser.js';
import { expectAnimationState } from '../../../../support/assertions/animation.js';

test.use({ mockClock: true });

test.describe('QuerySet #squeezeIn', () => {
    test.beforeEach(setup);

    squeezeInTests(() => (nodes, ...args) => {
        $(nodes).squeezeIn(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('.animate');
            return query === query.squeezeIn(
                {
                    debug: true,
                },
            );
        })).toBe(true);
    });

    test.describe('style locks and restoration', () => {
        test('preserves overflow supplied by a variable-based shorthand', async ({ page }) => {
            await page.evaluate((_) => {
                document.getElementById('test2').style.cssText = '--overflow: scroll; overflow: var(--overflow);';
                $('#test2').squeezeIn();
            });
            await advanceClock(page, 50);

            await expect(page.locator('#test2')).toHaveAttribute('style', '--overflow: scroll; overflow: var(--overflow);');
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
                    .squeezeIn(
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
});
