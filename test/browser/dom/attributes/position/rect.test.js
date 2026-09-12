import { rectTests, setup } from '#cases/attributes/position/rect.js';
import { expect, test } from '#test';

test.describe('#rect', () => {
    test.beforeEach(setup);

    rectTests((args) => $.rect(...args).toJSON());

    test('returns undefined for empty nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.rect('#invalid'))).toBe(undefined);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.rect(document.getElementById('test1')).toJSON())).toEqual({
            x: 600,
            y: 50,
            width: 200,
            height: 200,
            top: 50,
            right: 800,
            bottom: 250,
            left: 600,
        });
    });

    test('works with NodeList nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.rect(document.querySelectorAll('div')).toJSON())).toEqual({
            x: 600,
            y: 50,
            width: 200,
            height: 200,
            top: 50,
            right: 800,
            bottom: 250,
            left: 600,
        });
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.rect(document.body.children).toJSON())).toEqual({
            x: 600,
            y: 50,
            width: 200,
            height: 200,
            top: 50,
            right: 800,
            bottom: 250,
            left: 600,
        });
    });

    test('works with array nodes', async ({ page }) => {
        expect(await page.evaluate((_) =>
            $.rect([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ]).toJSON())).toEqual({
            x: 600,
            y: 50,
            width: 200,
            height: 200,
            top: 50,
            right: 800,
            bottom: 250,
            left: 600,
        });
    });
});
