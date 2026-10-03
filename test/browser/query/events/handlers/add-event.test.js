import { addEventTests, setup } from '#cases/events/event-handlers/add-event.js';
import { expect, test } from '#test';

test.describe('QuerySet #addEvent', () => {
    test.beforeEach(setup);

    addEventTests(() => (nodes, ...args) => {
        $(nodes).addEvent(...args);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate(() => {
            const query = $('a');
            return query === query.addEvent('click', () => null);
        })).toBe(true);
    });

    test.describe('node inputs', () => {
        test('adds listeners on forms with a control named addEventListener', async ({ page }) => {
            expect(await page.evaluate(() => {
                document.body.innerHTML = '<form><input name="addEventListener"></form>';
                let result = 0;
                const callback = () => {
                    result++;
                };
                $('form').addEvent('click', callback);
                document.querySelector('form').dispatchEvent(new Event('click'));
                return result;
            })).toBe(1);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result = 0;
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                const event = new Event('click');
                $(shadow)
                        .addEvent('click', () => {
                            result++;
                        });
                shadow.dispatchEvent(event);
                shadow.dispatchEvent(event);
                return result;
            })).toBe(2);
        });

        test('works with Document nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result = 0;
                const event = new Event('click');
                $(document)
                        .addEvent('click', () => {
                            result++;
                        });
                document.dispatchEvent(event);
                document.dispatchEvent(event);
                return result;
            })).toBe(2);
        });

        test('works with Window nodes', async ({ page }) => {
            expect(await page.evaluate(() => {
                let result = 0;
                const event = new Event('click');
                $(window)
                        .addEvent('click', () => {
                            result++;
                        });
                window.dispatchEvent(event);
                window.dispatchEvent(event);
                return result;
            })).toBe(2);
        });
    });
});
