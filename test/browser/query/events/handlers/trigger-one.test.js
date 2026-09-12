import { setup, triggerOneTests } from '#cases/events/event-handlers/trigger-one.js';
import { expect, test } from '#test';

test.describe('QuerySet #triggerOne', () => {
    test.beforeEach(setup);

    triggerOneTests(([nodes, ...args]) => $(nodes).triggerOne(...args));

    test('triggers an event for the first node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const targets = [];
            $.addEvent('a', 'click', (e) => {
                targets.push(e.target.id);
            });
            $('a').triggerOne('click');
            return targets;
        })).toEqual(['test1']);
    });

    test.describe('event properties', () => {
        test('triggers an event for the first node with custom data', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const targets = [];
                $.addEvent('a', 'click', (e) => {
                    if (e.test) {
                        targets.push(e.target.id);
                    }
                });
                $('a').triggerOne('click');
                $('a')
                        .triggerOne('click', {
                            data: {
                                test: true,
                            },
                        });
                return targets;
            })).toEqual(['test1']);
        });

        test('triggers an event for the first node with custom details', async ({ page }) => {
            expect(await page.evaluate((_) => {
                const targets = [];
                $.addEvent('a', 'click', (e) => {
                    if (e.detail === 'test') {
                        targets.push(e.target.id);
                    }
                });
                $('a').triggerOne('click');
                $('a')
                        .triggerOne('click', {
                            detail: 'test',
                        });
                return targets;
            })).toEqual(['test1']);
        });
    });

    test.describe('propagation', () => {
        test('bubbles to other event listeners', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                $.addEvent('#div1', 'click', (_) => {
                    result++;
                });
                $('a').triggerOne('click');
                return result;
            })).toBe(1);
        });

        test('can be prevented from bubbling', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                $.addEvent('#div1', 'click',
                    (_) => {
                        result++;
                    });
                $('a')
                        .triggerOne('click', {
                            bubbles: false,
                        });
                return result;
            })).toBe(0);
        });
    });

    test.describe('cancellation', () => {
        test('returns false if the event is cancelled', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $.addEvent('#test1', 'click', (e) => {
                    e.preventDefault();
                });
                return $('#test1').triggerOne('click');
            })).toBe(false);
        });

        test('returns false if the event returns false', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $.addEvent('#test1', 'click', (_) => false);
                return $('#test1').triggerOne('click');
            })).toBe(false);
        });

        test('returns false if a delegated event returns false', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $.addEventDelegate('#div1', 'click', 'a', (_) => false);
                return $('#test1').triggerOne('click');
            })).toBe(false);
        });

        test('returns true if the event is not cancelled', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $.addEvent('#test1', 'click', (_) => { });
                return $('#test1').triggerOne('click');
            })).toBe(true);
        });

        test('returns true if a delegated event is not cancelled', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $.addEventDelegate('#div1', 'click', 'a', (_) => { });
                return $('#test1').triggerOne('click');
            })).toBe(true);
        });

        test('can be prevented from being cancelled', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $.addEvent('#test1', 'click', (e) => {
                    e.preventDefault();
                });
                return $('#test1')
                        .triggerOne('click', {
                            cancelable: false,
                        });
            })).toBe(true);
        });

        test('can be prevented from being cancelled with delegate', async ({ page }) => {
            expect(await page.evaluate((_) => {
                $.addEventDelegate('#div1', 'click', 'a', (e) => {
                    e.preventDefault();
                });
                return $('#test1')
                        .triggerOne('click', {
                            cancelable: false,
                        });
            })).toBe(true);
        });
    });

    test.describe('node inputs', () => {
        test('works with ShadowRoot nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                const div = document.createElement('div');
                const shadow = div.attachShadow({ mode: 'open' });
                $.addEvent(shadow, 'click', (_) => {
                    result++;
                });
                $(shadow).triggerOne('click');
                return result;
            })).toBe(1);
        });

        test('works with Document nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                $.addEvent(document, 'click', (_) => {
                    result++;
                });
                $(document).triggerOne('click');
                return result;
            })).toBe(1);
        });

        test('works with Window nodes', async ({ page }) => {
            expect(await page.evaluate((_) => {
                let result = 0;
                $.addEvent(window, 'click', (_) => {
                    result++;
                });
                $(window).triggerOne('click');
                return result;
            })).toBe(1);
        });
    });
});
