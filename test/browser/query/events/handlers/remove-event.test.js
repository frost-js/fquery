import { expect, test } from '#test';

test.describe('QuerySet #removeEvent', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<a href="#" id="test1">Test</a>' +
                '<a href="#" id="test2">Test</a>';
        });
    });

    test('removes all events from each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event1 = new Event('click');
            const event2 = new Event('hover');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEvent('a', 'click hover', (_) => {
                result++;
            });
            $('a')
                    .removeEvent();
            element1.dispatchEvent(event1);
            element1.dispatchEvent(event2);
            element2.dispatchEvent(event1);
            element2.dispatchEvent(event2);
            return result;
        })).toBe(0);
    });

    test('removes listeners from forms with a control named removeEventListener', async ({ page }) => {
        expect(await page.evaluate((_) => {
            document.body.innerHTML = '<form><input name="removeEventListener"></form>';
            let result = 0;
            const callback = (_) => {
                result++;
            };
            $('form').addEvent('click', callback);
            $('form').triggerEvent('click');
            $('form').removeEvent('click', callback);
            $('form').triggerEvent('click');
            return result;
        })).toBe(1);
    });

    test('removes all events of a type from each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event1 = new Event('click');
            const event2 = new Event('hover');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEvent('a', 'click', (_) => {
                result++;
            });
            $.addEvent('a', 'click hover', (_) => {
                result++;
            });
            $('a')
                    .removeEvent('click');
            element1.dispatchEvent(event1);
            element1.dispatchEvent(event2);
            element2.dispatchEvent(event1);
            element2.dispatchEvent(event2);
            return result;
        })).toBe(2);
    });

    test('removes all events of types from each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event1 = new Event('click');
            const event2 = new Event('hover');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEvent('a', 'click', (_) => {
                result++;
            });
            $.addEvent('a', 'click hover', (_) => {
                result++;
            });
            $('a')
                    .removeEvent('click hover');
            element1.dispatchEvent(event1);
            element1.dispatchEvent(event2);
            element2.dispatchEvent(event1);
            element2.dispatchEvent(event2);
            return result;
        })).toBe(0);
    });

    test('removes events named constructor', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('constructor');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEvent('a', 'constructor', (_) => {
                result++;
            });
            $.addEvent('a', 'click', (_) => null);
            $('a').removeEvent('constructor');
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(0);
    });

    test('preserves other events when removing events named constructor', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('click');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEvent('a', 'click', (_) => {
                result++;
            });
            $.addEvent('a', 'constructor', (_) => null);
            $('a').removeEvent('constructor');
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(2);
    });

    test('removes events named toString', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('toString');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEvent('a', 'toString', (_) => {
                result++;
            });
            $.addEvent('a', 'click', (_) => null);
            $('a').removeEvent('toString');
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(0);
    });

    test('preserves other events when removing events named toString', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('click');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEvent('a', 'click', (_) => {
                result++;
            });
            $.addEvent('a', 'toString', (_) => null);
            $('a').removeEvent('toString');
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(2);
    });

    test('removes events named __proto__', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('__proto__');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEvent('a', '__proto__', (_) => {
                result++;
            });
            $.addEvent('a', 'click', (_) => null);
            $('a').removeEvent('__proto__');
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(0);
    });

    test('preserves other events when removing events named __proto__', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('click');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEvent('a', 'click', (_) => {
                result++;
            });
            $.addEvent('a', '__proto__', (_) => null);
            $('a').removeEvent('__proto__');
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(2);
    });

    test('removes a specific event from each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const callback = (_) => {
                result++;
            };
            const event = new Event('click');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEvent('a', 'click', callback);
            $.addEvent('a', 'click', (_) => {
                result++;
            });
            $('a')
                    .removeEvent('click', callback);
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(2);
    });

    test('does not restore removed handlers when cloning nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let removedCount = 0;
            const callback = (_) => {
                removedCount++;
            };

            $.addEvent('a', 'click', callback);
            $.addEvent('a', 'click', (_) => null);
            const query = $('a');
            query.removeEvent('click', callback);

            const clones = query.clone({ events: true });
            clones.triggerEvent('click');

            return removedCount;
        })).toBe(0);
    });

    test('preserves remaining handlers when cloning after removal', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let remainingCount = 0;
            const callback = (_) => null;

            $.addEvent('a', 'click', callback);
            $.addEvent('a', 'click', (_) => {
                remainingCount++;
            });
            const query = $('a');
            query.removeEvent('click', callback);

            const clones = query.clone({ events: true });
            clones.triggerEvent('click');

            return remainingCount;
        })).toBe(2);
    });

    test('removes a namespaced event from each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('click');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEvent('a', 'click.test', (_) => {
                result++;
            });
            $('a')
                    .removeEvent('click');
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(0);
    });

    test('removes namespaced events from each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event1 = new Event('click');
            const event2 = new Event('hover');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEvent('a', 'click.test hover.test', (_) => {
                result++;
            });
            $('a')
                    .removeEvent('click hover');
            element1.dispatchEvent(event1);
            element1.dispatchEvent(event2);
            element2.dispatchEvent(event1);
            element2.dispatchEvent(event2);
            return result;
        })).toBe(0);
    });

    test('removes a deep namespaced event from each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('click');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEvent('a', 'click.test.deep', (_) => {
                result++;
            });
            $('a')
                    .removeEvent('click');
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(0);
    });

    test('removes deep namespaced events from each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event1 = new Event('click');
            const event2 = new Event('hover');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEvent('a', 'click.test.deep hover.test.deep', (_) => {
                result++;
            });
            $('a')
                    .removeEvent('click hover');
            element1.dispatchEvent(event1);
            element1.dispatchEvent(event2);
            element2.dispatchEvent(event1);
            element2.dispatchEvent(event2);
            return result;
        })).toBe(0);
    });

    test('removes a namespaced event with namespacing from each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('click');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEvent('a', 'click.test', (_) => {
                result++;
            });
            $('a')
                    .removeEvent('click.test');
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(0);
    });

    test('removes namespaced events with namespacing from each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event1 = new Event('click');
            const event2 = new Event('hover');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEvent('a', 'click.test hover.test', (_) => {
                result++;
            });
            $('a')
                    .removeEvent('click.test hover.test');
            element1.dispatchEvent(event1);
            element1.dispatchEvent(event2);
            element2.dispatchEvent(event1);
            element2.dispatchEvent(event2);
            return result;
        })).toBe(0);
    });

    test('removes a deep namespaced event with namespacing from each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('click');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEvent('a', 'click.test.deep', (_) => {
                result++;
            });
            $('a')
                    .removeEvent('click.test');
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(0);
    });

    test('removes deep namespaced events with namespacing from each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event1 = new Event('click');
            const event2 = new Event('hover');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEvent('a', 'click.test.deep hover.test.deep', (_) => {
                result++;
            });
            $('a')
                    .removeEvent('click.test hover.test');
            element1.dispatchEvent(event1);
            element1.dispatchEvent(event2);
            element2.dispatchEvent(event1);
            element2.dispatchEvent(event2);
            return result;
        })).toBe(0);
    });

    test('removes a deep namespaced event with deep namespacing from each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('click');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEvent('a', 'click.test.deep', (_) => {
                result++;
            });
            $('a')
                    .removeEvent('click.test.deep');
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(0);
    });

    test('removes deep namespaced events with deep namespacing from each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event1 = new Event('click');
            const event2 = new Event('hover');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEvent('a', 'click.test.deep hover.test.deep', (_) => {
                result++;
            });
            $('a')
                    .removeEvent('click.test.deep hover.test.deep');
            element1.dispatchEvent(event1);
            element1.dispatchEvent(event2);
            element2.dispatchEvent(event1);
            element2.dispatchEvent(event2);
            return result;
        })).toBe(0);
    });

    test('does not remove a specific event of the wrong type from each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const callback = (_) => {
                result++;
            };
            const event = new Event('click');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEvent('a', 'click', callback);
            $.addEvent('a', 'click', (_) => {
                result++;
            });
            $('a')
                    .removeEvent('hover', callback);
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(4);
    });

    test('does not remove an event without namespacing from each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('click');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEvent('a', 'click', (_) => {
                result++;
            });
            $('a')
                    .removeEvent('click.test');
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(2);
    });

    test('does not remove events without namespacing from each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event1 = new Event('click');
            const event2 = new Event('hover');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEvent('a', 'click hover', (_) => {
                result++;
            });
            $('a')
                    .removeEvent('click.test hover.test');
            element1.dispatchEvent(event1);
            element1.dispatchEvent(event2);
            element2.dispatchEvent(event1);
            element2.dispatchEvent(event2);
            return result;
        })).toBe(4);
    });

    test('does not remove a namespaced event with deep namespacing from each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event = new Event('click');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEvent('a', 'click.test', (_) => {
                result++;
            });
            $('a')
                    .removeEvent('click.test.deep');
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(2);
    });

    test('does not remove namespaced events with deep namespacing from each node', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event1 = new Event('click');
            const event2 = new Event('hover');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEvent('a', 'click.test hover.test', (_) => {
                result++;
            });
            $('a')
                    .removeEvent('click.test.deep hover.test.deep');
            element1.dispatchEvent(event1);
            element1.dispatchEvent(event2);
            element2.dispatchEvent(event1);
            element2.dispatchEvent(event2);
            return result;
        })).toBe(4);
    });

    test('returns the QuerySet', async ({ page }) => {
        expect(await page.evaluate((_) => {
            const query = $('a');
            return query === query.removeEvent();
        })).toBe(true);
    });

    test('works with ShadowRoot nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const callback = (_) => {
                result++;
            };
            const event = new Event('click');
            const div = document.createElement('div');
            const shadow = div.attachShadow({ mode: 'open' });
            $.addEvent(shadow, 'click', callback);
            $.addEvent(shadow, 'click', (_) => {
                result++;
            });
            $(shadow)
                    .removeEvent('click', callback);
            shadow.dispatchEvent(event);
            return result;
        })).toBe(1);
    });

    test('works with Document nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const callback = (_) => {
                result++;
            };
            const event = new Event('click');
            $.addEvent(document, 'click', callback);
            $.addEvent(document, 'click', (_) => {
                result++;
            });
            $(document)
                    .removeEvent('click', callback);
            document.dispatchEvent(event);
            return result;
        })).toBe(1);
    });

    test('works with Window nodes', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const callback = (_) => {
                result++;
            };
            const event = new Event('click');
            $.addEvent(window, 'click', callback);
            $.addEvent(window, 'click', (_) => {
                result++;
            });
            $(window)
                    .removeEvent('click', callback);
            window.dispatchEvent(event);
            return result;
        })).toBe(1);
    });

    test('removes capture events', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event1 = new Event('click');
            const event2 = new Event('hover');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEvent(document, 'click hover', (_) => {
                result++;
            }, true);
            $(document)
                    .removeEvent();
            element1.dispatchEvent(event1);
            element1.dispatchEvent(event2);
            element2.dispatchEvent(event1);
            element2.dispatchEvent(event2);
            return result;
        })).toBe(0);
    });

    test('works with capture', async ({ page }) => {
        expect(await page.evaluate((_) => {
            let result = 0;
            const event1 = new Event('click', {
                bubbles: true,
            });
            const event2 = new Event('hover');
            const element1 = document.getElementById('test1');
            const element2 = document.getElementById('test2');
            $.addEvent(document, 'click', (_) => {
                result++;
            });
            $.addEvent(document, 'hover', (_) => {
                result++;
            }, { capture: true });
            $(document)
                    .removeEvent(null, null, { capture: true });
            element1.dispatchEvent(event1);
            element1.dispatchEvent(event2);
            element2.dispatchEvent(event1);
            element2.dispatchEvent(event2);
            return result;
        })).toBe(2);
    });
});
