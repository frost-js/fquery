import { expect, test } from '#test';
import { advanceClock, setupClock } from '../../../../setup/browser.js';

const bodyMarkup = '<div id="test1"><div><span id="inner">Test 1</span></div></div><div id="test2"></div>';
const replacementHtml = '<span>Test 2</span>';

test.describe('#setHTML', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((html) => {
            document.body.innerHTML = html;
        }, bodyMarkup);
    });

    test('sets the HTML contents for all nodes', async ({ page }) => {
        await page.evaluate((html) => {
            $.setHTML('div', html);
        }, replacementHtml);

        await expect(page.locator('#test1 > span')).toHaveText('Test 2');
        await expect(page.locator('#test2 > span')).toHaveText('Test 2');
        await expect(page.locator('#test1 > *')).toHaveCount(1);
        await expect(page.locator('#test2 > *')).toHaveCount(1);
    });

    test('sets HTML contents for nodes with a string content property', async ({ page }) => {
        await page.evaluate((html) => {
            document.getElementById('test1').content = 'Test 1';

            $.setHTML('#test1', html);
        }, replacementHtml);

        await expect(page.locator('#test1 > span')).toHaveText('Test 2');
        await expect(page.locator('#test1 > *')).toHaveCount(1);
    });

    test('removes events recursively', async ({ page }) => {
        const clickCount = await page.evaluate((html) => {
            let count = 0;
            const node = document.getElementById('inner');

            $.addEvent(node, 'click', () => {
                count++;
            });

            $.setHTML('div', html);
            document.body.appendChild(node);
            $.triggerEvent(node, 'click');

            return count;
        }, replacementHtml);

        expect(clickCount).toBe(0);
    });

    test('removes events recursively inside template contents', async ({ page }) => {
        const clickCount = await page.evaluate((html) => {
            let count = 0;
            const node = document.getElementById('inner');
            const template = document.createElement('template');
            template.content.appendChild(document.getElementById('test1'));
            document.body.appendChild(template);

            $.addEvent(node, 'click', () => {
                count++;
            });

            $.setHTML(template, html);
            document.body.appendChild(node);
            $.triggerEvent(node, 'click');

            return count;
        }, replacementHtml);

        expect(clickCount).toBe(0);
    });

    test('preserves events in the host shadow root', async ({ page }) => {
        const clickCount = await page.evaluate((html) => {
            let count = 0;
            const node = document.getElementById('inner');
            const shadow = document.getElementById('test1').attachShadow({ mode: 'open' });
            shadow.appendChild(node);

            $.addEvent([shadow, node], 'click', () => {
                count++;
            });

            $.setHTML('#test1', html);
            $.triggerEvent(node, 'click');

            return count;
        }, replacementHtml);

        expect(clickCount).toBe(2);
        await expect(page.locator('#inner')).toHaveText('Test 1');
    });

    test('removes data recursively', async ({ page }) => {
        const storedValue = await page.evaluate((html) => {
            const node = document.getElementById('inner');

            $.setData(node, 'test', 'Test');
            $.setHTML('div', html);
            document.body.appendChild(node);

            return $.getData(node, 'test');
        }, replacementHtml);

        expect(storedValue).toBeUndefined();
    });

    test('removes data recursively inside template contents', async ({ page }) => {
        const storedValue = await page.evaluate((html) => {
            const node = document.getElementById('inner');
            const template = document.createElement('template');
            template.content.appendChild(document.getElementById('test1'));
            document.body.appendChild(template);

            $.setData(node, 'test', 'Test');
            $.setHTML(template, html);
            document.body.appendChild(node);

            return $.getData(node, 'test');
        }, replacementHtml);

        expect(storedValue).toBeUndefined();
    });

    test('preserves data in the host shadow root', async ({ page }) => {
        const storedValue = await page.evaluate((html) => {
            const node = document.getElementById('inner');
            const shadow = document.getElementById('test1').attachShadow({ mode: 'open' });
            shadow.appendChild(node);

            $.setData(node, 'test', 'Test');
            $.setHTML('#test1', html);

            return $.getData(node, 'test');
        }, replacementHtml);

        expect(storedValue).toBe('Test');
        await expect(page.locator('#inner')).toHaveText('Test 1');
    });

    test('preserves data on the template content fragment', async ({ page }) => {
        const storedValue = await page.evaluate((html) => {
            const template = document.createElement('template');
            template.content.appendChild(document.getElementById('test1'));
            document.body.appendChild(template);

            $.setData(template.content, 'test', 'Test');
            $.setHTML(template, html);
            document.getElementById('test2').appendChild(template.content);

            return $.getData(template.content, 'test');
        }, replacementHtml);

        expect(storedValue).toBe('Test');
        await expect(page.locator('#test2 > span')).toHaveText('Test 2');
        await expect(page.locator('#inner')).toHaveCount(0);
    });

    test('removes animations recursively', async ({ page }) => {
        await page.evaluate(() => {
            $.animate('#inner', () => {}, { duration: 100, debug: true });
        });

        await expect.poll(async () =>
            await page.evaluate(() => Boolean(document.getElementById('inner')?.dataset.animationProgress))).toBe(true);

        await page.evaluate((html) => {
            const node = document.getElementById('inner');

            $.setHTML('div', html);
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

            $.setHTML('div', html);
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

            $.setHTML('div', html);

            return count;
        }, replacementHtml);

        expect(removeEventCount).toBe(1);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        await page.evaluate((html) => {
            $.setHTML(document.getElementById('test1'), html);
        }, replacementHtml);

        await expect(page.locator('#test1 > span')).toHaveText('Test 2');
        await expect(page.locator('#test2 > *')).toHaveCount(0);
    });

    test('works with NodeList nodes', async ({ page }) => {
        await page.evaluate((html) => {
            $.setHTML(document.querySelectorAll('div'), html);
        }, replacementHtml);

        await expect(page.locator('#test1 > span')).toHaveText('Test 2');
        await expect(page.locator('#test2 > span')).toHaveText('Test 2');
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await page.evaluate((html) => {
            $.setHTML(document.body.children, html);
        }, replacementHtml);

        await expect(page.locator('#test1 > span')).toHaveText('Test 2');
        await expect(page.locator('#test2 > span')).toHaveText('Test 2');
    });

    test('works with array nodes', async ({ page }) => {
        await page.evaluate((html) => {
            $.setHTML([
                document.getElementById('test1'),
                document.getElementById('test2'),
            ], html);
        }, replacementHtml);

        await expect(page.locator('#test1 > span')).toHaveText('Test 2');
        await expect(page.locator('#test2 > span')).toHaveText('Test 2');
    });
});
