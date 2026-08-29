import { expect, test } from '#test';
import { advanceClock, resetPage, setupClock } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="test1"><div><span id="inner">Test 1</span></div></div><div id="test2"></div>';
const replacementText = 'Test 2';

test.beforeEach(async ({ page }) => {
    await resetPage(page);
});

test.describe('#setText', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('sets the text contents for all nodes', async ({ page }) => {
        await page.evaluate((text) => {
            $.setText('div', text);
        }, replacementText);

        await expect(page.locator('#test1')).toHaveText(replacementText);
        await expect(page.locator('#test2')).toHaveText(replacementText);
        await expect(page.locator('#test1 > *')).toHaveCount(0);
    });

    test('escapes HTML strings', async ({ page }) => {
        await page.evaluate(() => {
            $.setText('#test1', '<span>Test 2</span>');
        });

        await expect(page.locator('#test1')).toHaveText('<span>Test 2</span>');
        await expect(page.locator('#test1 > span')).toHaveCount(0);
        expect(await page.locator('#test1').innerHTML()).toBe('&lt;span&gt;Test 2&lt;/span&gt;');
    });

    test('removes events recursively', async ({ page }) => {
        const clickCount = await page.evaluate((text) => {
            let count = 0;
            const node = document.getElementById('inner');

            $.addEvent(node, 'click', () => {
                count++;
            });

            $.setText('div', text);
            document.body.appendChild(node);
            $.triggerEvent(node, 'click');

            return count;
        }, replacementText);

        expect(clickCount).toBe(0);
    });

    test('removes data recursively', async ({ page }) => {
        const storedValue = await page.evaluate((text) => {
            const node = document.getElementById('inner');

            $.setData(node, 'test', 'Test');
            $.setText('div', text);
            document.body.appendChild(node);

            return $.getData(node, 'test');
        }, replacementText);

        expect(storedValue).toBeUndefined();
    });

    test('removes animations recursively', async ({ page }) => {
        await page.evaluate(() => {
            $.animate('#inner', () => {}, { duration: 100, debug: true });
        });

        await expect.poll(async () =>
            await page.evaluate(() => Boolean(document.getElementById('inner')?.dataset.animationProgress))).toBe(true);

        await page.evaluate((text) => {
            const node = document.getElementById('inner');

            $.setText('div', text);
            document.body.appendChild(node);
        }, replacementText);

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

        await page.evaluate((text) => {
            const node = document.getElementById('inner');

            $.setText('div', text);
            document.body.appendChild(node);
        }, replacementText);

        await advanceClock(page, 120);

        await expect(page.locator('#test1')).toHaveText(replacementText);
        await expect(page.locator('#test2')).toHaveText(replacementText);
        await expect(page.locator('#inner')).toHaveText('Test 1');
        expect(await page.locator('#inner').getAttribute('data-test')).toBeNull();
    });

    test('triggers a remove event recursively', async ({ page }) => {
        const removeEventCount = await page.evaluate((text) => {
            let count = 0;

            $.addEvent('#inner', 'remove', () => {
                count++;
            });

            $.setText('div', text);

            return count;
        }, replacementText);

        expect(removeEventCount).toBe(1);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        await page.evaluate((text) => {
            $.setText(document.getElementById('test1'), text);
        }, replacementText);

        await expect(page.locator('#test1')).toHaveText(replacementText);
        await expect(page.locator('#test2')).toHaveText('');
        await expect(page.locator('#test1 > *')).toHaveCount(0);
    });

    test('works with NodeList nodes', async ({ page }) => {
        await page.evaluate((text) => {
            $.setText(document.querySelectorAll('div'), text);
        }, replacementText);

        await expect(page.locator('#test1')).toHaveText(replacementText);
        await expect(page.locator('#test2')).toHaveText(replacementText);
        await expect(page.locator('#test1 > *')).toHaveCount(0);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await page.evaluate((text) => {
            $.setText(document.body.children, text);
        }, replacementText);

        await expect(page.locator('#test1')).toHaveText(replacementText);
        await expect(page.locator('#test2')).toHaveText(replacementText);
        await expect(page.locator('#test1 > *')).toHaveCount(0);
    });

    test('works with array nodes', async ({ page }) => {
        await page.evaluate((text) => {
            $.setText([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], text);
        }, replacementText);

        await expect(page.locator('#test1')).toHaveText(replacementText);
        await expect(page.locator('#test2')).toHaveText(replacementText);
        await expect(page.locator('#test1 > *')).toHaveCount(0);
    });
});
