import { expect, test } from '#test';
import { advanceClock, resetPage, setupClock } from '../../../../setup/browser.js';
import { expectAnimationState } from '../../../../support/assertions/animation.js';

test.beforeEach(async ({ page }) => {
    await setupClock(page);
    await resetPage(page);
});

test.describe('QuerySet #fadeOut', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1"></div>' +
                '<div id="test2" class="animate"></div>' +
                '<div id="test3"></div>' +
                '<div id="test4" class="animate"></div>';
        });
    });

    test('adds a fade-out animation to each node', async ({ page }) => {
        await page.evaluate((_) => {
            $('.animate')
                .fadeOut({
                    debug: true,
                });
        });
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { opacity: '0.5' },
            },
            {
                selectors: ['#test1', '#test3'],
                styles: { opacity: '' },
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

    test('adds a fade-out animation to each node with duration', async ({ page }) => {
        await page.evaluate((_) => {
            $('.animate')
                .fadeOut({
                    duration: 100,
                    debug: true,
                });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { opacity: '0.5' },
            },
            {
                selectors: ['#test1', '#test3'],
                styles: { opacity: '' },
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

    test('adds a fade-out animation to each node (linear)', async ({ page }) => {
        await page.evaluate((_) => {
            $('.animate')
                .fadeOut({
                    duration: 100,
                    type: 'linear',
                    debug: true,
                });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { opacity: '0.5' },
            },
            {
                selectors: ['#test1', '#test3'],
                styles: { opacity: '' },
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

    test('adds a fade-out animation to each node (ease-in)', async ({ page }) => {
        await page.evaluate((_) => {
            $('.animate')
                .fadeOut({
                    duration: 100,
                    type: 'ease-in',
                    debug: true,
                });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.25,
                styles: { opacity: '0.75' },
            },
            {
                selectors: ['#test1', '#test3'],
                styles: { opacity: '' },
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

    test('adds a fade-out animation to each node (ease-out)', async ({ page }) => {
        await page.evaluate((_) => {
            $('.animate')
                .fadeOut({
                    duration: 100,
                    type: 'ease-out',
                    debug: true,
                });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.7071067812,
                styles: { opacity: '0.29' },
            },
            {
                selectors: ['#test1', '#test3'],
                styles: { opacity: '' },
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

    test('adds a fade-out animation to each node (infinite)', async ({ page }) => {
        await page.evaluate((_) => {
            $('.animate')
                .fadeOut({
                    duration: 100,
                    type: 'linear',
                    infinite: true,
                    debug: true,
                });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { opacity: '0.5' },
            },
            {
                selectors: ['#test1', '#test3'],
                styles: { opacity: '' },
            },
        ]);
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0,
                styles: { opacity: '1' },
            },
            {
                selectors: ['#test1', '#test3'],
                styles: { opacity: '' },
            },
        ]);
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { opacity: '0.5' },
            },
            {
                selectors: ['#test1', '#test3'],
                styles: { opacity: '' },
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
                .fadeOut(
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

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('.animate');
            return query === query.fadeOut(
                {
                    debug: true,
                },
            );
        })).toBe(true);
    });
});
