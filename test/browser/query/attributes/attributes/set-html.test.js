import { expect, test } from '#test';
import { advanceClock, setupClock } from '../../../../setup/browser.js';

test.describe('QuerySet #setHTML', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML = '<div id="test1"><div><span id="inner">Test 1</span></div></div><div id="test2"></div>';
        });
    });

    test('returns the QuerySet', async ({ page }) => {
        const isSameQuerySet = await page.evaluate(() => {
            const query = $('div');

            return query === query.setHTML('<span>Test 2</span>');
        });

        expect(isSameQuerySet).toBe(true);
    });

    test.describe('content replacement', () => {
        test('sets the HTML contents for all nodes', async ({ page }) => {
            await page.evaluate(() => {
                $('div').setHTML('<span>Test 2</span>');
            });

            await expect(page.locator('#test1 > span')).toHaveText('Test 2');
            await expect(page.locator('#test2 > span')).toHaveText('Test 2');
            await expect(page.locator('#test1 > *')).toHaveCount(1);
            await expect(page.locator('#test2 > *')).toHaveCount(1);
        });

        test('sets HTML contents for nodes with a string content property', async ({ page }) => {
            await page.evaluate(() => {
                document.getElementById('test1').content = 'Test 1';

                $('#test1').setHTML('<span>Test 2</span>');
            });

            await expect(page.locator('#test1 > span')).toHaveText('Test 2');
            await expect(page.locator('#test1 > *')).toHaveCount(1);
        });
    });

    test.describe('cleanup', () => {
        test('removes events recursively', async ({ page }) => {
            const clickCount = await page.evaluate(() => {
                let count = 0;
                const node = document.getElementById('inner');

                $.addEvent(node, 'click', () => {
                    count++;
                });

                $('div').setHTML('<span>Test 2</span>');
                document.body.appendChild(node);
                $.triggerEvent(node, 'click');

                return count;
            });

            expect(clickCount).toBe(0);
        });

        test('removes data recursively', async ({ page }) => {
            const storedValue = await page.evaluate(() => {
                const node = document.getElementById('inner');

                $.setData(node, 'test', 'Test');
                $('div').setHTML('<span>Test 2</span>');
                document.body.appendChild(node);

                return $.getData(node, 'test');
            });

            expect(storedValue).toBeUndefined();
        });

        test('removes animations recursively', async ({ page }) => {
            await page.evaluate(() => {
                $.animate('#inner', () => {}, { duration: 100, debug: true });
            });

            await expect.poll(async () =>
                await page.evaluate(() => Boolean(document.getElementById('inner')?.dataset.animationProgress))).toBe(true);

            await page.evaluate(() => {
                const node = document.getElementById('inner');

                $('div').setHTML('<span>Test 2</span>');
                document.body.appendChild(node);
            });

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

            await page.evaluate(() => {
                const node = document.getElementById('inner');

                $('div').setHTML('<span>Test 2</span>');
                document.body.appendChild(node);
            });

            await advanceClock(page, 120);

            await expect(page.locator('#test1 > span')).toHaveText('Test 2');
            await expect(page.locator('#test2 > span')).toHaveText('Test 2');
            await expect(page.locator('#inner')).toHaveText('Test 1');
            expect(await page.locator('#inner').getAttribute('data-test')).toBeNull();
        });

        test('triggers a remove event recursively', async ({ page }) => {
            const removeEventCount = await page.evaluate(() => {
                let count = 0;

                $.addEvent('#inner', 'remove', () => {
                    count++;
                });

                $('div').setHTML('<span>Test 2</span>');

                return count;
            });

            expect(removeEventCount).toBe(1);
        });
    });

    test.describe('shadow and template contents', () => {
        test('removes events recursively inside template contents', async ({ page }) => {
            const clickCount = await page.evaluate(() => {
                let count = 0;
                const node = document.getElementById('inner');
                const template = document.createElement('template');
                template.content.appendChild(document.getElementById('test1'));
                document.body.appendChild(template);

                $.addEvent(node, 'click', () => {
                    count++;
                });

                $(template).setHTML('<span>Test 2</span>');
                document.body.appendChild(node);
                $.triggerEvent(node, 'click');

                return count;
            });

            expect(clickCount).toBe(0);
        });

        test('preserves events in the host shadow root', async ({ page }) => {
            const clickCount = await page.evaluate(() => {
                let count = 0;
                const node = document.getElementById('inner');
                const shadow = document.getElementById('test1').attachShadow({ mode: 'open' });
                shadow.appendChild(node);

                $.addEvent([shadow, node], 'click', () => {
                    count++;
                });

                $('#test1').setHTML('<span>Test 2</span>');
                $.triggerEvent(node, 'click');

                return count;
            });

            expect(clickCount).toBe(2);
            await expect(page.locator('#inner')).toHaveText('Test 1');
        });

        test('removes data recursively inside template contents', async ({ page }) => {
            const storedValue = await page.evaluate(() => {
                const node = document.getElementById('inner');
                const template = document.createElement('template');
                template.content.appendChild(document.getElementById('test1'));
                document.body.appendChild(template);

                $.setData(node, 'test', 'Test');
                $(template).setHTML('<span>Test 2</span>');
                document.body.appendChild(node);

                return $.getData(node, 'test');
            });

            expect(storedValue).toBeUndefined();
        });

        test('preserves data in the host shadow root', async ({ page }) => {
            const storedValue = await page.evaluate(() => {
                const node = document.getElementById('inner');
                const shadow = document.getElementById('test1').attachShadow({ mode: 'open' });
                shadow.appendChild(node);

                $.setData(node, 'test', 'Test');
                $('#test1').setHTML('<span>Test 2</span>');

                return $.getData(node, 'test');
            });

            expect(storedValue).toBe('Test');
            await expect(page.locator('#inner')).toHaveText('Test 1');
        });

        test('preserves data on the template content fragment', async ({ page }) => {
            const storedValue = await page.evaluate(() => {
                const template = document.createElement('template');
                template.content.appendChild(document.getElementById('test1'));
                document.body.appendChild(template);

                $.setData(template.content, 'test', 'Test');
                $(template).setHTML('<span>Test 2</span>');
                document.getElementById('test2').appendChild(template.content);

                return $.getData(template.content, 'test');
            });

            expect(storedValue).toBe('Test');
            await expect(page.locator('#test2 > span')).toHaveText('Test 2');
            await expect(page.locator('#inner')).toHaveCount(0);
        });
    });
});
