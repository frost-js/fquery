import { setup, squeezeInTests } from '#cases/animation/animations/squeeze-in.js';
import { expect, test } from '#test';
import { advanceClock } from '../../../../setup/browser.js';
import { expectAnimationState } from '../../../../support/assertions/animation.js';

test.use({ mockClock: true });

test.describe('QuerySet #squeezeIn', () => {
    test.beforeEach(setup);

    squeezeInTests(([nodes, ...args]) => {
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

        test('preserves important height while resizing', async ({ page }) => {
            await page.addStyleTag({ content: '.animate { height: 200px !important; }' });
            await page.evaluate((_) => {
                document.getElementById('test2').style.setProperty('height', '100px', 'important');
                $('#test2').squeezeIn({ duration: 100 });
            });
            await advanceClock(page, 50);

            await expect(page.locator('#test2')).toHaveCSS('height', '50px');
        });

        test('preserves important overflow while clipping', async ({ page }) => {
            await page.addStyleTag({ content: '.animate { overflow-x: scroll !important; }' });
            await page.evaluate((_) => {
                document.getElementById('test2').style.setProperty('overflow-x', 'auto', 'important');
                $('#test2').squeezeIn({ duration: 100 });
            });
            await advanceClock(page, 50);

            await expect(page.locator('#test2')).toHaveCSS('overflow-x', 'hidden');
        });
    });

    test.describe('cloning', () => {
        test('uses the original dimensions while a cloned animation continues', async ({ page }) => {
            await page.evaluate((_) => {
                $('#test2').squeezeIn({
                    direction: 'top',
                    duration: 200,
                    debug: true,
                });
            });
            await advanceClock(page, 100);
            await page.evaluate((_) => {
                const [clone] = $('#test2').clone({ animations: true }).get();
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
