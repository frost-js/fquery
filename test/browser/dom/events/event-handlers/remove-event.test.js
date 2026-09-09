import { expect, test } from '#test';

test.describe('#removeEvent', () => {
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
            $.removeEvent('a');
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
            $.addEvent('form', 'click', callback);
            $.triggerEvent('form', 'click');
            $.removeEvent('form', 'click', callback);
            $.triggerEvent('form', 'click');
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
            $.removeEvent('a', 'click');
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
            $.removeEvent('a', 'click hover');
            element1.dispatchEvent(event1);
            element1.dispatchEvent(event2);
            element2.dispatchEvent(event1);
            element2.dispatchEvent(event2);
            return result;
        })).toBe(0);
    });

    for (const eventName of ['constructor', 'toString', '__proto__']) {
        test(`removes events named ${eventName}`, async ({ page }) => {
            expect(await page.evaluate((eventName) => {
                let result = 0;
                const event = new Event(eventName);
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                $.addEvent('a', eventName, (_) => {
                    result++;
                });
                $.addEvent('a', 'click', (_) => null);
                $.removeEvent('a', eventName);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                return result;
            }, eventName)).toBe(0);
        });

        test(`preserves other events when removing events named ${eventName}`, async ({ page }) => {
            expect(await page.evaluate((eventName) => {
                let result = 0;
                const event = new Event('click');
                const element1 = document.getElementById('test1');
                const element2 = document.getElementById('test2');
                $.addEvent('a', 'click', (_) => {
                    result++;
                });
                $.addEvent('a', eventName, (_) => null);
                $.removeEvent('a', eventName);
                element1.dispatchEvent(event);
                element2.dispatchEvent(event);
                return result;
            }, eventName)).toBe(2);
        });
    }

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
            $.removeEvent('a', 'click', callback);
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
            $.removeEvent('a', 'click', callback);

            const clones = $.clone('a', { events: true });
            $.triggerEvent(clones, 'click');

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
            $.removeEvent('a', 'click', callback);

            const clones = $.clone('a', { events: true });
            $.triggerEvent(clones, 'click');

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
            $.removeEvent('a', 'click');
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
            $.removeEvent('a', 'click hover');
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
            $.removeEvent('a', 'click');
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
            $.removeEvent('a', 'click hover');
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
            $.removeEvent('a', 'click.test');
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
            $.removeEvent('a', 'click.test hover.test');
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
            $.removeEvent('a', 'click.test');
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
            $.removeEvent('a', 'click.test hover.test');
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
            $.removeEvent('a', 'click.test.deep');
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
            $.removeEvent('a', 'click.test.deep hover.test.deep');
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
            $.removeEvent('a', 'hover', callback);
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
            $.removeEvent('a', 'click.test');
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
            $.removeEvent('a', 'click.test hover.test');
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
            $.removeEvent('a', 'click.test.deep');
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
            $.removeEvent('a', 'click.test.deep hover.test.deep');
            element1.dispatchEvent(event1);
            element1.dispatchEvent(event2);
            element2.dispatchEvent(event1);
            element2.dispatchEvent(event2);
            return result;
        })).toBe(4);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
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
            $.removeEvent(element1, 'click', callback);
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(3);
    });

    test('works with NodeList nodes', async ({ page }) => {
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
            $.removeEvent(
                document.querySelectorAll('a'),
                'click',
                callback,
            );
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(2);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
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
            $.removeEvent(
                document.body.children,
                'click',
                callback,
            );
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(2);
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
            $.removeEvent(shadow, 'click', callback);
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
            $.removeEvent(document, 'click', callback);
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
            $.removeEvent(window, 'click', callback);
            window.dispatchEvent(event);
            return result;
        })).toBe(1);
    });

    test('works with array nodes', async ({ page }) => {
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
            $.removeEvent([
                element1,
                element2,
            ], 'click', callback);
            element1.dispatchEvent(event);
            element2.dispatchEvent(event);
            return result;
        })).toBe(2);
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
            $.removeEvent(document);
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
            $.removeEvent(document, null, null, { capture: true });
            element1.dispatchEvent(event1);
            element1.dispatchEvent(event2);
            element2.dispatchEvent(event1);
            element2.dispatchEvent(event2);
            return result;
        })).toBe(2);
    });
});
