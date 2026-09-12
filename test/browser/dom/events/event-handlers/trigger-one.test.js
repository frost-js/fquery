import { setup, triggerOneTests } from '#cases/events/event-handlers/trigger-one.js';
import { expect, test } from '#test';

test.describe('#triggerOne', () => {
    test.beforeEach(setup);

    triggerOneTests((args) => $.triggerOne(...args));

    test.describe('node inputs', () => {
        test('works with HTMLElement nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const targets = [];
                $.addEvent('a', 'click', (e) => {
                    targets.push(e.target.id);
                });
                $.triggerOne(document.getElementById('test1'), 'click');
                return targets;
            })).toEqual(['test1']);
        });

        test('works with NodeList nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const targets = [];
                $.addEvent('a', 'click', (e) => {
                    targets.push(e.target.id);
                });
                $.triggerOne(document.querySelectorAll('a'), 'click');
                return targets;
            })).toEqual(['test1']);
        });

        test('works with HTMLCollection nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const targets = [];
                $.addEvent('a', 'click', (e) => {
                    targets.push(e.target.id);
                });
                $.triggerOne(document.getElementById('div1').children, 'click');
                return targets;
            })).toEqual(['test1']);
        });

        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                $.addEvent(shadow, 'click', (_) => {
                    result++;
                });
                $.triggerOne(shadow, 'click');
                return result;
            })).toBe(1);
        });

        test('works with Document nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                $.addEvent(document, 'click', (_) => {
                    result++;
                });
                $.triggerOne(document, 'click');
                return result;
            })).toBe(1);
        });

        test('works with Window nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                $.addEvent(window, 'click', (_) => {
                    result++;
                });
                $.triggerOne(window, 'click');
                return result;
            })).toBe(1);
        });

        test('works with array nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const targets = [];
                $.addEvent('a', 'click', (e) => {
                    targets.push(e.target.id);
                });
                $.triggerOne([
                    document.getElementById('test1'),
                    document.getElementById('test2'),
                ], 'click');
                return targets;
            })).toEqual(['test1']);
        });
    });
});
