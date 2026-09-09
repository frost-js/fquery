import { expect, test } from '#test';

test.describe('QuerySet #hasCSSTransition', () => {
    test.beforeEach(async ({ page }) => {
        await page.addStyleTag({ content: '.test { transition: opacity 1s; }' });
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="div1" class="test"></div>' +
                '<div id="div2></div>' +
                '<div id="div3" class="test"></div>' +
                '<div id="div4"></div>';
        });
    });

    test('returns true if any node has a CSS transition', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div')
                    .hasCSSTransition())).toBe(true);
    });

    for (const [duration, expected] of [
        ['1s', true],
        ['0s', false],
    ]) {
        test(`returns ${expected} for CSS transition durations of 0s, ${duration}`, async ({ page }) => {
            await page.addStyleTag({ content: '.test { transition: opacity 0s, transform ' + duration + '; }' });

            expect(await page.evaluate((_) =>
                $('div').hasCSSTransition())).toBe(expected);
        });
    }

    test('returns false if no nodes have a CSS transition', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $('div:not(.test)')
                    .hasCSSTransition())).toBe(false);
    });
});
