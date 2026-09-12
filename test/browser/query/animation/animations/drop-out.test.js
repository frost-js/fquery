import { dropOutTests, setup } from '#cases/animation/animations/drop-out.js';
import { expect, test } from '#test';
import { advanceClock } from '../../../../setup/browser.js';
import { expectAnimationState } from '../../../../support/assertions/animation.js';

test.use({ mockClock: true });

test.describe('QuerySet #dropOut', () => {
    test.beforeEach(setup);

    dropOutTests(([nodes, ...args]) => {
        $(nodes).dropOut(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('.animate');
            return query === query.dropOut(
                {
                    debug: true,
                },
            );
        })).toBe(true);
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
                    .dropOut(
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
                    styles: { transform: 'translateY(-50px)' },
                },
            ]);
        });
    });
});
