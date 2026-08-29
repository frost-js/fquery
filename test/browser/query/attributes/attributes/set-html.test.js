import { expect, test } from '#test';
import { advanceClock, resetPage, setupClock } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="test1"><div><span id="inner">Test 1</span></div></div><div id="test2"></div>';
const replacementHtml = '<span>Test 2</span>';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('QuerySet #setHTML', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('sets the HTML contents for all nodes', async ({ page }) => {
        await page.evaluate((html) => {
            $('div').setHTML(html);
        }, replacementHtml);

        await expect(page.locator('#test1 > span')).toHaveText('Test 2');
        await expect(page.locator('#test2 > span')).toHaveText('Test 2');
        await expect(page.locator('#test1 > *')).toHaveCount(1);
        await expect(page.locator('#test2 > *')).toHaveCount(1);
    });

    test('removes events recursively', async ({ page }) => {
        const clickCount = await page.evaluate((html) => {
            let count = 0;
            const node = document.getElementById('inner');

            $.addEvent(node, 'click', () => {
                count++;
            });

            $('div').setHTML(html);
            document.body.appendChild(node);
            $.triggerEvent(node, 'click');

            return count;
        }, replacementHtml);

        expect(clickCount).toBe(0);
    });

    test('removes data recursively', async ({ page }) => {
        const storedValue = await page.evaluate((html) => {
            const node = document.getElementById('inner');

            $.setData(node, 'test', 'Test');
            $('div').setHTML(html);
            document.body.appendChild(node);

            return $.getData(node, 'test');
        }, replacementHtml);

        expect(storedValue).toBeUndefined();
    });

    test('removes animations recursively', async ({ page }) => {
        await page.evaluate(() => {
            $.animate('#inner', () => {}, { duration: 100, debug: true });
        });

        await expect.poll(async () =>
            await page.evaluate(() => Boolean(document.getElementById('inner')?.dataset.animationProgress))).toBe(true);

        await page.evaluate((html) => {
            const node = document.getElementById('inner');

            $('div').setHTML(html);
            document.body.appendChild(node);
        }, replacementHtml);

        await expect.poll(async () =>
            await page.evaluate(() => {
                const node = document.getElementById('inner');

                return Boolean(node) &&
                    !node.dataset.animationProgress &&
                    !node.dataset.animationStart &&
                    !node.dataset.animationTime;
            })).toBe(true);
    });

    test('removes queue recursively', async ({ page }) => {
        await setupClock(page);

        await page.evaluate(() => {
            window.innerQueueStartedAt = null;

            $.queue('#inner', () => new Promise((resolve) => {
                window.innerQueueStartedAt = performance.now();
                setTimeout(resolve, 100);
            }));

            $.queue('#inner', (node) => {
                node.dataset.test = 'Test';
            });
        });

        await advanceClock(page, 10);
        await expect.poll(async () =>
            await page.evaluate(() => window.innerQueueStartedAt !== null)).toBe(true);

        await page.evaluate((html) => {
            const node = document.getElementById('inner');

            $('div').setHTML(html);
            document.body.appendChild(node);
        }, replacementHtml);

        await advanceClock(page, 120);

        await expect(page.locator('#test1 > span')).toHaveText('Test 2');
        await expect(page.locator('#test2 > span')).toHaveText('Test 2');
        await expect(page.locator('#inner')).toHaveText('Test 1');
        expect(await page.locator('#inner').getAttribute('data-test')).toBeNull();
    });

    test('triggers a remove event recursively', async ({ page }) => {
        const removeEventCount = await page.evaluate((html) => {
            let count = 0;

            $.addEvent('#inner', 'remove', () => {
                count++;
            });

            $('div').setHTML(html);

            return count;
        }, replacementHtml);

        expect(removeEventCount).toBe(1);
    });

    test('returns the QuerySet', async ({ page }) => {
        const isSameQuerySet = await page.evaluate((html) => {
            const query = $('div');

            return query === query.setHTML(html);
        }, replacementHtml);

        expect(isSameQuerySet).toBe(true);
    });
});
