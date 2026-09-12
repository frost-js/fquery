import { setup, stopTests } from '#cases/animation/stop.js';
import { expect, test } from '#test';
import { advanceClock } from '../../../setup/browser.js';

test.use({ mockClock: true });

test.describe('QuerySet #stop', () => {
    test.beforeEach(setup);

    stopTests(([nodes, ...args]) => {
        $(nodes).stop(...args);
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

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('.animate');
            return query === query.stop();
        })).toBe(true);
    });
});
