import { expect, test } from '#test';
import { advanceClock } from '../../../setup/browser.js';
import { expectAnimationState } from '../../../support/assertions/animation.js';

test.use({ mockClock: true });

test.describe('QuerySet #stop', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1"></div>' +
                '<div id="test2" class="animate"></div>' +
                '<div id="test3"></div>' +
                '<div id="test4" class="animate"></div>';
        });
    });

    test('stops animations on all nodes', async ({ page }) => {
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
            $('.animate').stop();
        });
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
            },
        ]);
    });

    test('clears pending animations in a named queue when stopping', async ({ page }) => {
        await page.evaluate((_) => {
            $('#test2').animate(
                (_) => { },
                {
                    duration: 100,
                    queueName: 'test',
                },
            );
            $('#test2').animate(
                (node) => {
                    node.dataset.test = 'Test';
                },
                {
                    duration: 100,
                    queueName: 'test',
                },
            );
        });
        await advanceClock(page, 25);
        expect(await page.evaluate((_) =>
            $('#test2').hasAnimation())).toBe(true);
        await page.evaluate((_) => {
            $('#test2').stop();
        });
        await advanceClock(page, 150);
        expect(await page.locator('#test2').getAttribute('data-test')).toBeNull();
    });

    test('stops animations on all nodes (without finishing)', async ({ page }) => {
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
        const testHtml = await page.evaluate((_) => {
            $('.animate').stop({ finish: false });
            return document.body.innerHTML;
        });
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
            },
        ]);
        await advanceClock(page, 25);
        const html = await page.evaluate((_) => document.body.innerHTML);
        expect(html).toBe(testHtml);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('.animate');
            return query === query.stop();
        })).toBe(true);
    });
});
