import { expect, test } from '#test';
import { resetPage } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="test1" style="display: none;"></div><div id="test2" style="display: none;"></div>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #show', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('shows all nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $('div').show();
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', '');
        await expect(page.locator('#test2')).toHaveAttribute('style', '');
    });

    test('shows block elements hidden by a stylesheet', async ({ page }) => {
        await page.addStyleTag({ content: '.hidden { display: none; }' });
        await page.evaluate((_) => {
            document.getElementById('test1').classList.add('hidden');
            $('#test1').show();
        });

        await expect(page.locator('#test1')).toHaveCSS('display', 'block');
    });

    test('shows inline elements hidden by a stylesheet', async ({ page }) => {
        await page.addStyleTag({ content: '.hidden { display: none; }' });
        await page.evaluate((_) => {
            document.body.innerHTML = '<span id="test1" class="hidden">Test</span>';
            $('#test1').show();
        });

        await expect(page.locator('#test1')).toHaveCSS('display', 'inline');
    });

    test('shows table rows hidden by a stylesheet', async ({ page }) => {
        await page.addStyleTag({ content: '.hidden { display: none; }' });
        await page.evaluate((_) => {
            document.body.innerHTML = '<table><tbody><tr id="test1" class="hidden"><td>Test</td></tr></tbody></table>';
            $('#test1').show();
        });

        await expect(page.locator('#test1')).toHaveCSS('display', 'table-row');
    });

    test('preserves a visible inline display value', async ({ page }) => {
        await page.evaluate((_) => {
            document.getElementById('test1').style.display = 'flex';
            $('#test1').show();
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: flex;');
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('div');
            return query === query.show();
        })).toBe(true);
    });
});
