import { expect, test } from '#test';
import { advanceClock, setupClock } from '../../../../setup/browser.js';

test.describe('#setText', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate(() => {
            document.body.innerHTML = '<div id="test1"><div><span id="inner">Test 1</span></div></div><div id="test2"></div>';
        });
    });

    test.describe('content replacement', () => {
        test('sets the text contents for all nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.setText('div', 'Test 2');
            });

            await expect(page.locator('#test1')).toHaveText('Test 2');
            await expect(page.locator('#test2')).toHaveText('Test 2');
            await expect(page.locator('#test1 > *')).toHaveCount(0);
        });

        test('sets text contents for nodes with a string content property', async ({ page }) => {
            await page.evaluate(() => {
                document.getElementById('test1').content = 'Test 1';

                $.setText('#test1', 'Test 2');
            });

            await expect(page.locator('#test1')).toHaveText('Test 2');
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
    });

    test.describe('cleanup', () => {
        test('removes events recursively', async ({ page }) => {
            const clickCount = await page.evaluate(() => {
                let count = 0;
                const node = document.getElementById('inner');

                $.addEvent(node, 'click', () => {
                    count++;
                });

                $.setText('div', 'Test 2');
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
                $.setText('div', 'Test 2');
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

                $.setText('div', 'Test 2');
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

                $.setText('div', 'Test 2');
                document.body.appendChild(node);
            });

            await advanceClock(page, 120);

            await expect(page.locator('#test1')).toHaveText('Test 2');
            await expect(page.locator('#test2')).toHaveText('Test 2');
            await expect(page.locator('#inner')).toHaveText('Test 1');
            expect(await page.locator('#inner').getAttribute('data-test')).toBeNull();
        });

        test('triggers a remove event recursively', async ({ page }) => {
            const removeEventCount = await page.evaluate(() => {
                let count = 0;

                $.addEvent('#inner', 'remove', () => {
                    count++;
                });

                $.setText('div', 'Test 2');

                return count;
            });

            expect(removeEventCount).toBe(1);
        });
    });

    test.describe('shadow and template contents', () => {
        test('preserves events in the host shadow root', async ({ page }) => {
            const clickCount = await page.evaluate(() => {
                let count = 0;
                const node = document.getElementById('inner');
                const shadow = document.getElementById('test1').attachShadow({ mode: 'open' });
                shadow.appendChild(node);

                $.addEvent([shadow, node], 'click', () => {
                    count++;
                });

                $.setText('#test1', 'Test 2');
                $.triggerEvent(node, 'click');

                return count;
            });

            expect(clickCount).toBe(2);
            await expect(page.locator('#inner')).toHaveText('Test 1');
        });

        test('preserves events inside template contents', async ({ page }) => {
            const clickCount = await page.evaluate(() => {
                let count = 0;
                const node = document.getElementById('inner');
                const template = document.createElement('template');
                template.content.appendChild(node);
                template.appendChild(document.getElementById('test1'));
                document.body.appendChild(template);

                $.addEvent(node, 'click', () => {
                    count++;
                });

                $.setText(template, 'Test 2');
                document.body.appendChild(template.content);
                $.triggerEvent(node, 'click');

                return count;
            });

            expect(clickCount).toBe(1);
            await expect(page.locator('#inner')).toHaveText('Test 1');
            await expect(page.locator('template > *')).toHaveCount(0);
            await expect(page.locator('template')).toHaveText('Test 2');
        });

        test('preserves data in the host shadow root', async ({ page }) => {
            const storedValue = await page.evaluate(() => {
                const node = document.getElementById('inner');
                const shadow = document.getElementById('test1').attachShadow({ mode: 'open' });
                shadow.appendChild(node);

                $.setData(node, 'test', 'Test');
                $.setText('#test1', 'Test 2');

                return $.getData(node, 'test');
            });

            expect(storedValue).toBe('Test');
            await expect(page.locator('#inner')).toHaveText('Test 1');
        });

        test('preserves data inside template contents', async ({ page }) => {
            const storedValue = await page.evaluate(() => {
                const node = document.getElementById('inner');
                const template = document.createElement('template');
                template.content.appendChild(node);
                template.appendChild(document.getElementById('test1'));
                document.body.appendChild(template);

                $.setData(node, 'test', 'Test');
                $.setText(template, 'Test 2');
                document.body.appendChild(template.content);

                return $.getData(node, 'test');
            });

            expect(storedValue).toBe('Test');
            await expect(page.locator('#inner')).toHaveText('Test 1');
            await expect(page.locator('template > *')).toHaveCount(0);
            await expect(page.locator('template')).toHaveText('Test 2');
        });
    });

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.setText(document.getElementById('test1'), 'Test 2');
            });

            await expect(page.locator('#test1')).toHaveText('Test 2');
            await expect(page.locator('#test2')).toHaveText('');
            await expect(page.locator('#test1 > *')).toHaveCount(0);
        });

        test('works with NodeList nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.setText(document.querySelectorAll('div'), 'Test 2');
            });

            await expect(page.locator('#test1')).toHaveText('Test 2');
            await expect(page.locator('#test2')).toHaveText('Test 2');
            await expect(page.locator('#test1 > *')).toHaveCount(0);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.setText(document.body.children, 'Test 2');
            });

            await expect(page.locator('#test1')).toHaveText('Test 2');
            await expect(page.locator('#test2')).toHaveText('Test 2');
            await expect(page.locator('#test1 > *')).toHaveCount(0);
        });

        test('works with array nodes', async ({ page }) => {
            await page.evaluate(() => {
                $.setText([
                    document.getElementById('test1'),
                    document.getElementById('test2'),
                ], 'Test 2');
            });

            await expect(page.locator('#test1')).toHaveText('Test 2');
            await expect(page.locator('#test2')).toHaveText('Test 2');
            await expect(page.locator('#test1 > *')).toHaveCount(0);
        });
    });
});
