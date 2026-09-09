import { expect, test } from '#test';

const bodyMarkup = '<div id="test1"></div><div id="test2" style="display: none;"></div>';

test.describe('#toggle', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('toggles the visibility of all nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.toggle('div');
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
        await expect(page.locator('#test2')).toHaveAttribute('style', '');
    });

    test('shows all nodes when forced', async ({ page }) => {
        await page.evaluate((_) => {
            $.toggle('div', true);
        });

        await expect(page.locator('#test1')).toHaveCSS('display', 'block');
        await expect(page.locator('#test2')).toHaveCSS('display', 'block');
    });

    test('hides all nodes when forced', async ({ page }) => {
        await page.evaluate((_) => {
            $.toggle('div', false);
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: none;');
    });

    test('shows elements hidden by a stylesheet', async ({ page }) => {
        await page.addStyleTag({ content: '.hidden { display: none; }' });
        await page.evaluate((_) => {
            document.getElementById('test1').classList.add('hidden');
            $.toggle('#test1');
        });

        await expect(page.locator('#test1')).toHaveCSS('display', 'block');
    });

    test('hides stylesheet-hidden elements after showing them', async ({ page }) => {
        await page.addStyleTag({ content: '.hidden { display: none; }' });
        await page.evaluate((_) => {
            document.getElementById('test1').classList.add('hidden');
            $.toggle('#test1');
            $.toggle('#test1');
        });

        await expect(page.locator('#test1')).toHaveCSS('display', 'none');
    });

    test('shows detached elements hidden by an inline style', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const node = document.getElementById('test2');
            node.remove();
            $.toggle(node);

            return node.style.display;
        })).toBe('');
    });

    test('restores the inline display after toggling twice', async ({ page }) => {
        await page.evaluate((_) => {
            document.getElementById('test1').style.display = 'flex';
            $.toggle('#test1');
            $.toggle('#test1');
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: flex;');
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.toggle(document.getElementById('test1'));
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
        await expect(page.locator('#test2')).toHaveAttribute('style', 'display: none;');
    });

    test('works with NodeList nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.toggle(document.querySelectorAll('div'));
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
        await expect(page.locator('#test2')).toHaveAttribute('style', '');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.toggle(document.body.children);
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
        await expect(page.locator('#test2')).toHaveAttribute('style', '');
    });

    test('works with array nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.toggle([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ]);
        });

        await expect(page.locator('#test1')).toHaveAttribute('style', 'display: none;');
        await expect(page.locator('#test2')).toHaveAttribute('style', '');
    });
});
