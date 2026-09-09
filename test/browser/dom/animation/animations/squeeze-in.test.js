import { expect, test } from '#test';
import { advanceClock } from '../../../../setup/browser.js';
import { expectAnimationState } from '../../../../support/assertions/animation.js';

test.use({ mockClock: true });

test.describe('#squeezeIn', () => {
    test.beforeEach(async ({ page }) => {
        await page.addStyleTag({ content: 'div { width: 100px; height: 100px; }' });
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1"></div>' +
                '<div id="test2" class="animate"></div>' +
                '<div id="test3"></div>' +
                '<div id="test4" class="animate"></div>';
        });
    });

    test('restores existing inline dimensions, overflow and transform', async ({ page }) => {
        await page.evaluate((_) => {
            for (const node of document.querySelectorAll('.animate')) {
                node.style.setProperty('height', '80px');
                node.style.setProperty('overflow', 'scroll');
                node.style.setProperty('transform', 'scale(2)');
                node.style.setProperty('width', '90px');
            }

            $.squeezeIn('.animate', {
                direction: 'top',
                duration: 100,
            });
        });
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                styles: { height: '80px', overflow: 'scroll', transform: 'scale(2)', width: '90px' },
            },
        ]);
    });

    test('rejects overflow supplied by a variable-based shorthand', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            document.getElementById('test2').style.cssText = '--overflow: scroll; overflow: var(--overflow);';
            try {
                await $.squeezeIn('#test2');
            } catch (error) {
                return error.message;
            }
        })).toBe('Cannot lock CSS property "overflow-x" because its original value cannot be restored.');

        await expect(page.locator('#test2')).toHaveAttribute('style', '--overflow: scroll; overflow: var(--overflow);');
    });

    test('releases earlier properties when a later property is locked', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            document.getElementById('test2').style.height = '50px';
            $.setStyleLock('#test2', 'overflow-x', 'scroll');
            try {
                await $.squeezeIn('#test2');
            } catch (error) {
                const release = $.setStyleLock('#test2', 'height', '75px');
                release();
                return error.message;
            }
        })).toBe('CSS property "overflow-x" is already locked.');

        await expectAnimationState(page, [
            {
                selectors: ['#test2'],
                styles: { height: '50px', overflowX: 'scroll' },
            },
        ]);
    });

    test('rejects dimensions that would change declaration precedence', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            document.getElementById('test2').style.cssText = 'width: 100px; inline-size: 200px;';
            try {
                await $.squeezeIn('#test2');
            } catch (error) {
                return error.message;
            }
        })).toBe('Cannot lock CSS property "width" because its original value cannot be restored.');

        await expect(page.locator('#test2')).toHaveAttribute('style', 'width: 100px; inline-size: 200px;');
    });

    test('releases earlier properties when a dimension cannot be restored', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            document.getElementById('test2').style.cssText = 'width: 100px; inline-size: 200px;';
            try {
                await $.squeezeIn('#test2');
            } catch {
                const release = $.setStyleLock('#test2', 'height', '50px');
                release();
                return true;
            }
        })).toBe(true);
    });

    test('restores separate overflow declarations', async ({ page }) => {
        await page.evaluate((_) => {
            const style = document.getElementById('test2').style;
            style.setProperty('overflow-x', 'scroll', 'important');
            style.setProperty('overflow-y', 'auto');
            $.squeezeIn('#test2', { duration: 100 });
        });
        await advanceClock(page, 100);

        await expectAnimationState(page, [
            {
                selectors: ['#test2'],
                styles: { overflowX: 'scroll', overflowY: 'auto' },
            },
        ]);
        expect(await page.evaluate((_) =>
            document.getElementById('test2').style.getPropertyPriority('overflow-x'))).toBe('important');
    });

    test('uses the original dimensions while a cloned animation continues', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeIn('#test2', {
                direction: 'top',
                duration: 200,
                debug: true,
            });
        });
        await advanceClock(page, 100);
        await page.evaluate((_) => {
            const [clone] = $.clone('#test2', { animations: true });
            clone.id = 'clone';
            document.body.appendChild(clone);
        });
        await advanceClock(page, 50);

        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#clone'],
                progress: 0.875,
                styles: { height: '87.5px', transform: 'translateY(12.5px)' },
            },
        ]);
    });

    test('preserves important height while resizing', async ({ page }) => {
        await page.addStyleTag({ content: '.animate { height: 200px !important; }' });
        await page.evaluate((_) => {
            document.getElementById('test2').style.setProperty('height', '100px', 'important');
            $.squeezeIn('#test2', { duration: 100 });
        });
        await advanceClock(page, 50);

        await expect(page.locator('#test2')).toHaveCSS('height', '50px');
    });

    test('preserves important overflow while clipping', async ({ page }) => {
        await page.addStyleTag({ content: '.animate { overflow-x: scroll !important; }' });
        await page.evaluate((_) => {
            document.getElementById('test2').style.setProperty('overflow-x', 'auto', 'important');
            $.squeezeIn('#test2', { duration: 100 });
        });
        await advanceClock(page, 50);

        await expect(page.locator('#test2')).toHaveCSS('overflow-x', 'hidden');
    });

    test('adds a squeeze-in animation to each node', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeIn('.animate', {
                duration: 200,
                debug: true,
            });
        });
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', height: '50px' },
            },
        ]);
        await advanceClock(page, 150);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { overflow: '', height: '' },
            },
        ]);
    });

    test('adds a squeeze-in animation to each node with duration', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeIn('.animate', {
                duration: 100,
                debug: true,
            });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', height: '50px' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { overflow: '', height: '' },
            },
        ]);
    });

    test('uses content-box height for padded elements', async ({ page }) => {
        await page.addStyleTag({ content: '.animate { box-sizing: content-box; padding: 10px; }' });
        await page.evaluate((_) => {
            $.squeezeIn('.animate', {
                direction: 'top',
                duration: 500,
                type: 'linear',
                debug: true,
            });
        });
        await advanceClock(page, 450);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.9,
                styles: { height: '90px', transform: 'translateY(10px)' },
            },
        ]);
    });

    test('uses border-box height for padded and bordered elements', async ({ page }) => {
        await page.addStyleTag({ content: '.animate { box-sizing: border-box; padding: 10px; border: 5px solid; }' });
        await page.evaluate((_) => {
            $.squeezeIn('.animate', {
                direction: 'top',
                duration: 500,
                type: 'linear',
                debug: true,
            });
        });
        await advanceClock(page, 450);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.9,
                styles: { height: '90px', transform: 'translateY(10px)' },
            },
        ]);
    });

    test('uses content-box width for padded elements', async ({ page }) => {
        await page.addStyleTag({ content: '.animate { box-sizing: content-box; padding: 10px; }' });
        await page.evaluate((_) => {
            $.squeezeIn('.animate', {
                direction: 'left',
                duration: 500,
                type: 'linear',
                debug: true,
            });
        });
        await advanceClock(page, 450);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.9,
                styles: { width: '90px', transform: 'translateX(10px)' },
            },
        ]);
    });

    test('uses border-box width for padded and bordered elements', async ({ page }) => {
        await page.addStyleTag({ content: '.animate { box-sizing: border-box; padding: 10px; border: 5px solid; }' });
        await page.evaluate((_) => {
            $.squeezeIn('.animate', {
                direction: 'left',
                duration: 500,
                type: 'linear',
                debug: true,
            });
        });
        await advanceClock(page, 450);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                progress: 0.9,
                styles: { width: '90px', transform: 'translateX(10px)' },
            },
        ]);
    });

    test('adds a squeeze-in animation to each node (top)', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeIn('.animate', {
                direction: 'top',
                duration: 100,
                debug: true,
            });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '', transform: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', height: '50px', transform: 'translateY(50px)' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { overflow: '', height: '', transform: '' },
            },
        ]);
    });

    test('adds a squeeze-in animation to each node (right)', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeIn('.animate', {
                direction: 'right',
                duration: 100,
                debug: true,
            });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', width: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', width: '50px' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { overflow: '', width: '' },
            },
        ]);
    });

    test('adds a squeeze-in animation to each node (bottom)', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeIn('.animate', {
                direction: 'bottom',
                duration: 100,
                debug: true,
            });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', height: '50px' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { overflow: '', height: '' },
            },
        ]);
    });

    test('adds a squeeze-in animation to each node (left)', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeIn('.animate', {
                direction: 'left',
                duration: 100,
                debug: true,
            });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', width: '', transform: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', width: '50px', transform: 'translateX(50px)' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { overflow: '', width: '', transform: '' },
            },
        ]);
    });

    test('adds a squeeze-in animation to each node (direction callback)', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeIn('.animate', {
                direction: (_) => 'bottom',
                duration: 100,
                debug: true,
            });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', height: '50px' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { overflow: '', height: '' },
            },
        ]);
    });

    test('adds a squeeze-in animation to each node (linear)', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeIn('.animate', {
                duration: 100,
                type: 'linear',
                debug: true,
            });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', height: '50px' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { overflow: '', height: '' },
            },
        ]);
    });

    test('adds a squeeze-in animation to each node (ease-in)', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeIn('.animate', {
                duration: 100,
                type: 'ease-in',
                debug: true,
            });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.25,
                styles: { overflow: 'hidden', height: '25px' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { overflow: '', height: '' },
            },
        ]);
    });

    test('adds a squeeze-in animation to each node (ease-out)', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeIn('.animate', {
                duration: 100,
                type: 'ease-out',
                debug: true,
            });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.7071067812,
                styles: { overflow: 'hidden', height: '70.71px' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { overflow: '', height: '' },
            },
        ]);
    });

    test('adds a squeeze-in animation to each node (infinite)', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeIn('.animate', {
                duration: 100,
                type: 'linear',
                infinite: true,
                debug: true,
            });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', height: '50px' },
            },
        ]);
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0,
                styles: { overflow: 'hidden', height: '0px' },
            },
        ]);
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', height: '50px' },
            },
        ]);
    });

    test('can be stopped', async ({ page }) => {
        const animationHandle = await page.evaluateHandle((_) => ({
            animation: $.squeezeIn('.animate', {
                duration: 100,
                debug: true,
            }),
        }));
        await advanceClock(page, 50);
        await animationHandle.evaluate(({ animation }) => {
            animation.stop();
        });
        await animationHandle.dispose();
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { overflow: '', height: '' },
            },
        ]);
    });

    test('can be stopped (without finishing)', async ({ page }) => {
        const animationHandle = await page.evaluateHandle((_) => {
            const animation = $.squeezeIn('.animate', {
                duration: 100,
                debug: true,
            });

            animation.catch((_) => { });

            return { animation };
        });
        await advanceClock(page, 50);
        await animationHandle.evaluate(({ animation }) => {
            animation.stop({ finish: false });
        });
        await animationHandle.dispose();
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', height: '50px' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', height: '50px' },
            },
        ]);
    });

    test('resolves when the animation is stopped', async ({ page }) => {
        await page.evaluate(async (_) => {
            const animation = $.squeezeIn('.animate', {
                duration: 100,
                debug: true,
            });
            animation.stop();
            await animation;
        });
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { overflow: '', height: '' },
            },
        ]);
    });

    test('throws when the animation is stopped (without finishing)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            try {
                const animation = $.squeezeIn('.animate', {
                    duration: 100,
                    debug: true,
                });
                animation.stop({ finish: false });
                await animation;
                return false;
            } catch {
                return true;
            }
        })).toBe(true);
    });

    test('does not stop all animations', async ({ page }) => {
        const animationHandle = await page.evaluateHandle((_) => {
            const animation = $.squeezeIn('.animate', {
                duration: 100,
            });
            $.animate(
                '.animate',
                (_) => { },
                {
                    duration: 100,
                    debug: true,
                },
            );

            return { animation };
        });
        await advanceClock(page, 50);
        await animationHandle.evaluate(({ animation }) => {
            animation.stop();
        });
        await animationHandle.dispose();
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: '', height: '' },
            },
        ]);
    });

    test('resolves when the animation is completed', async ({ page }) => {
        const animationHandle = await page.evaluateHandle((_) => ({
            animation: $.squeezeIn('.animate', {
                duration: 100,
                debug: true,
            }),
        }));
        await advanceClock(page, 100);
        await animationHandle.evaluate(async ({ animation }) => {
            await animation;
        });
        await animationHandle.dispose();
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { overflow: '', height: '' },
            },
        ]);
    });

    test('throws when all animations are stopped (without finishing)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            try {
                const animation = $.squeezeIn('.animate', {
                    duration: 1000,
                    debug: true,
                });
                $.stop('.animate', { finish: false });
                await animation;
                return false;
            } catch {
                return true;
            }
        })).toBe(true);
    });

    test('works with HTMLElement nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeIn(
                document.getElementById('test2'),
                {
                    duration: 100,
                    debug: true,
                },
            );
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3', '#test4'],
                styles: { overflow: '', height: '' },
            },
            {
                selectors: ['#test2'],
                progress: 0.5,
                styles: { overflow: 'hidden', height: '50px' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { overflow: '', height: '' },
            },
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeIn(
                document.querySelectorAll('.animate'),
                {
                    duration: 100,
                    debug: true,
                },
            );
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', height: '50px' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { overflow: '', height: '' },
            },
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeIn(
                document.body.children,
                {
                    duration: 100,
                    debug: true,
                },
            );
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', height: '50px' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { overflow: '', height: '' },
            },
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.squeezeIn([
                document.getElementById('test2'),
                document.getElementById('test4'),
            ], {
                duration: 100,
                debug: true,
            });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { overflow: '', height: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { overflow: 'hidden', height: '50px' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { overflow: '', height: '' },
            },
        ]);
    });
});
