import { expect, test } from '#test';
import { advanceClock } from '../../../../setup/browser.js';
import { expectAnimationState } from '../../../../support/assertions/animation.js';

test.use({ mockClock: true });

test.describe('#fadeIn', () => {
    test.beforeEach(async ({ page }) => {
        await page.evaluate((_) => {
            document.body.innerHTML =
                '<div id="test1"></div>' +
                '<div id="test2" class="animate"></div>' +
                '<div id="test3"></div>' +
                '<div id="test4" class="animate"></div>';
        });
    });

    test('restores existing inline opacity', async ({ page }) => {
        await page.evaluate((_) => {
            for (const node of document.querySelectorAll('.animate')) {
                node.style.setProperty('opacity', '0.25', 'important');
            }

            $.fadeIn('.animate', { duration: 100 });
        });
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test4'],
                styles: { opacity: '0.25' },
            },
        ]);
        expect(await page.evaluate((_) => document.getElementById('test2').style.getPropertyPriority('opacity')))
            .toBe('important');
    });

    test('preserves important opacity during the animation', async ({ page }) => {
        await page.addStyleTag({ content: '.animate { opacity: 0.25 !important; }' });
        await page.evaluate((_) => {
            document.getElementById('test2').style.setProperty('opacity', '1', 'important');
            $.fadeIn('#test2', { duration: 100 });
        });
        await advanceClock(page, 50);

        await expect(page.locator('#test2')).toHaveCSS('opacity', '0.5');
    });

    test('does not promote normal opacity to important', async ({ page }) => {
        await page.addStyleTag({ content: '.animate { opacity: 0.25 !important; }' });
        await page.evaluate((_) => {
            document.getElementById('test2').style.setProperty('opacity', '1');
            $.fadeIn('#test2', { duration: 100 });
        });
        await advanceClock(page, 50);

        await expect(page.locator('#test2')).toHaveCSS('opacity', '0.25');
    });

    test('locks opacity while the animation is active', async ({ page }) => {
        expect(await page.evaluate((_) => {
            $.fadeIn('#test2');
            try {
                $.setStyleLock('#test2', 'opacity', 0.25);
            } catch (error) {
                return error.message;
            }
        })).toBe('CSS property "opacity" is already locked.');
    });

    test('rejects overlapping effects on the same property', async ({ page }) => {
        await page.evaluate((_) => {
            $.fadeIn('#test2', { duration: 100 });
            $.fadeOut('#test2').catch((error) => {
                document.getElementById('test2').dataset.error = error.message;
            });
        });
        await advanceClock(page, 50);

        await expect(page.locator('#test2')).toHaveAttribute('data-error', 'CSS property "opacity" is already locked.');
        await expectAnimationState(page, [
            {
                selectors: ['#test2'],
                styles: { opacity: '0.5' },
            },
        ]);
    });

    test('allows simultaneous effects on different properties', async ({ page }) => {
        await page.evaluate((_) => {
            $.fadeIn('#test2', { duration: 100 });
            $.rotateIn('#test2', { duration: 100 });
        });
        await advanceClock(page, 50);

        await expectAnimationState(page, [
            {
                selectors: ['#test2'],
                styles: { opacity: '0.5', transform: 'rotate3d(0, 1, 0, 45deg)' },
            },
        ]);
    });

    test('releases opacity when the animation completes', async ({ page }) => {
        await page.evaluate((_) => {
            document.getElementById('test2').style.opacity = '0.25';
            $.fadeIn('#test2', { duration: 100 });
        });
        await advanceClock(page, 100);
        await page.evaluate((_) => {
            const release = $.setStyleLock('#test2', 'opacity', 0.75);
            release();
        });

        await expectAnimationState(page, [
            {
                selectors: ['#test2'],
                styles: { opacity: '0.25' },
            },
        ]);
    });

    test('releases opacity on cloned animations', async ({ page }) => {
        await page.evaluate((_) => {
            document.getElementById('test2').style.opacity = '0.25';
            $.fadeIn('#test2', { duration: 100 });
            const [clone] = $.clone('#test2', { animations: true });
            clone.id = 'clone';
            document.body.appendChild(clone);
        });
        await advanceClock(page, 100);
        await page.evaluate((_) => {
            const release = $.setStyleLock('#test2, #clone', 'opacity', 0.75);
            release();
        });

        await expectAnimationState(page, [
            {
                selectors: ['#test2'],
                styles: { opacity: '0.25' },
            },
            {
                selectors: ['#clone'],
                styles: { opacity: '0.25' },
            },
        ]);
    });

    test('restores the original opacity of each node on cloned animations', async ({ page }) => {
        await page.evaluate((_) => {
            document.getElementById('test2').style.opacity = '0.25';
            document.getElementById('test4').style.opacity = '0.75';
            $.fadeIn('.animate', { duration: 100 });
        });
        await advanceClock(page, 50);
        await page.evaluate((_) => {
            const clones = $.clone('.animate', { animations: true });
            for (const clone of clones) {
                clone.id += '-clone';
                document.body.appendChild(clone);
            }
        });
        await advanceClock(page, 100);

        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#test2-clone'],
                styles: { opacity: '0.25' },
            },
            {
                selectors: ['#test4', '#test4-clone'],
                styles: { opacity: '0.75' },
            },
        ]);
    });

    test('restores the original opacity priority on cloned animations', async ({ page }) => {
        await page.evaluate((_) => {
            document.getElementById('test2').style.setProperty('opacity', '0.25', 'important');
            $.fadeIn('#test2', { duration: 100 });
        });
        await advanceClock(page, 50);
        await page.evaluate((_) => {
            const [clone] = $.clone('#test2', { animations: true });
            clone.id = 'clone';
            document.body.appendChild(clone);
        });
        await advanceClock(page, 100);

        expect(await page.evaluate((_) => document.getElementById('clone').style.getPropertyPriority('opacity')))
            .toBe('important');
    });

    test('removes temporary opacity from clones when the original declaration was absent', async ({ page }) => {
        await page.evaluate((_) => {
            $.fadeIn('#test2', { duration: 100 });
        });
        await advanceClock(page, 50);
        await page.evaluate((_) => {
            const [clone] = $.clone('#test2', { animations: true });
            clone.id = 'clone';
            document.body.appendChild(clone);
        });
        await advanceClock(page, 100);

        await expectAnimationState(page, [
            {
                selectors: ['#test2', '#clone'],
                styles: { opacity: '' },
            },
        ]);
    });

    test('keeps the source opacity locked when a clone is stopped', async ({ page }) => {
        await page.evaluate((_) => {
            $.fadeIn('#test2', { duration: 200 });
        });
        await advanceClock(page, 50);
        await page.evaluate((_) => {
            const [clone] = $.clone('#test2', { animations: true });
            clone.id = 'clone';
            document.body.appendChild(clone);
        });
        await advanceClock(page, 50);

        expect(await page.evaluate((_) => {
            $.stop('#clone');
            try {
                $.setStyleLock('#test2', 'opacity', 0.25);
            } catch (error) {
                return error.message;
            }
        })).toBe('CSS property "opacity" is already locked.');
    });

    test('releases opacity when a zero-duration animation completes', async ({ page }) => {
        await page.evaluate(async (_) => {
            await $.fadeIn('#test2', { duration: 0 });
            const release = $.setStyleLock('#test2', 'opacity', 0.75);
            release();
        });

        await expectAnimationState(page, [
            {
                selectors: ['#test2'],
                styles: { opacity: '' },
            },
        ]);
    });

    test('adds a fade-in animation to each node', async ({ page }) => {
        await page.evaluate((_) => {
            $.fadeIn('.animate', {
                duration: 200,
                debug: true,
            });
        });
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { opacity: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { opacity: '0.5' },
            },
        ]);
        await advanceClock(page, 150);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { opacity: '' },
            },
        ]);
    });

    test('adds a fade-in animation to each node with duration', async ({ page }) => {
        await page.evaluate((_) => {
            $.fadeIn('.animate', {
                duration: 100,
                debug: true,
            });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { opacity: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { opacity: '0.5' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { opacity: '' },
            },
        ]);
    });

    test('adds a fade-in animation to each node (linear)', async ({ page }) => {
        await page.evaluate((_) => {
            $.fadeIn('.animate', {
                duration: 100,
                type: 'linear',
                debug: true,
            });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { opacity: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { opacity: '0.5' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { opacity: '' },
            },
        ]);
    });

    test('adds a fade-in animation to each node (ease-in)', async ({ page }) => {
        await page.evaluate((_) => {
            $.fadeIn('.animate', {
                duration: 100,
                type: 'ease-in',
                debug: true,
            });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { opacity: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.25,
                styles: { opacity: '0.25' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { opacity: '' },
            },
        ]);
    });

    test('adds a fade-in animation to each node (ease-out)', async ({ page }) => {
        await page.evaluate((_) => {
            $.fadeIn('.animate', {
                duration: 100,
                type: 'ease-out',
                debug: true,
            });
        });
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { opacity: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.7071067812,
                styles: { opacity: '0.71' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { opacity: '' },
            },
        ]);
    });

    test('adds a fade-in animation to each node (infinite)', async ({ page }) => {
        await page.evaluate((_) => {
            $.fadeIn('.animate', {
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
                styles: { opacity: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { opacity: '0.5' },
            },
        ]);
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { opacity: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0,
                styles: { opacity: '0' },
            },
        ]);
        await advanceClock(page, 50);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { opacity: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { opacity: '0.5' },
            },
        ]);
    });

    test('can be stopped', async ({ page }) => {
        const animationHandle = await page.evaluateHandle((_) => ({
            animation: $.fadeIn('.animate', {
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
                styles: { opacity: '' },
            },
        ]);
    });

    test('releases opacity immediately when stopped', async ({ page }) => {
        await page.evaluate((_) => {
            document.getElementById('test2').style.opacity = '0.25';
            const animation = $.fadeIn('#test2');
            animation.stop();
            const release = $.setStyleLock('#test2', 'opacity', 0.75);
            release();
        });

        await expectAnimationState(page, [
            {
                selectors: ['#test2'],
                styles: { opacity: '0.25' },
            },
        ]);
    });

    test('releases opacity without restoring when stopped without finishing', async ({ page }) => {
        const animationHandle = await page.evaluateHandle((_) => {
            const animation = $.fadeIn('#test2', { duration: 100 });
            animation.catch((_) => { });
            return { animation };
        });
        await advanceClock(page, 50);
        await animationHandle.evaluate(({ animation }) => {
            animation.stop({ finish: false });
            const release = $.setStyleLock('#test2', 'opacity', 0.75);
            release();
        });
        await animationHandle.dispose();

        await expectAnimationState(page, [
            {
                selectors: ['#test2'],
                styles: { opacity: '0.5' },
            },
        ]);
    });

    test('keeps other nodes locked when one node is stopped', async ({ page }) => {
        await page.evaluate((_) => {
            $.fadeIn('.animate', { duration: 100 }).catch((_) => { });
        });
        await advanceClock(page, 50);

        expect(await page.evaluate((_) => {
            $.stop('#test2', { finish: false });
            const release = $.setStyleLock('#test2', 'opacity', 0.75);
            release();
            try {
                $.setStyleLock('#test4', 'opacity', 0.75);
            } catch (error) {
                return error.message;
            }
        })).toBe('CSS property "opacity" is already locked.');
    });

    test('can be stopped (without finishing)', async ({ page }) => {
        const animationHandle = await page.evaluateHandle((_) => {
            const animation = $.fadeIn('.animate', {
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
                styles: { opacity: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { opacity: '0.5' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test3'],
                styles: { opacity: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { opacity: '0.5' },
            },
        ]);
    });

    test('resolves when the animation is stopped', async ({ page }) => {
        await page.evaluate(async (_) => {
            const animation = $.fadeIn('.animate', {
                duration: 100,
                debug: true,
            });
            animation.stop();
            await animation;
        });
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { opacity: '' },
            },
        ]);
    });

    test('throws when the animation is stopped (without finishing)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            try {
                const animation = $.fadeIn('.animate', {
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
            const animation = $.fadeIn('.animate', {
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
                styles: { opacity: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { opacity: '' },
            },
        ]);
    });

    test('resolves when the animation is completed', async ({ page }) => {
        const animationHandle = await page.evaluateHandle((_) => ({
            animation: $.fadeIn('.animate', {
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
                styles: { opacity: '' },
            },
        ]);
    });

    test('throws when all animations are stopped (without finishing)', async ({ page }) => {
        expect(await page.evaluate(async (_) => {
            try {
                const animation = $.fadeIn('.animate', {
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
            $.fadeIn(
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
                styles: { opacity: '' },
            },
            {
                selectors: ['#test2'],
                progress: 0.5,
                styles: { opacity: '0.5' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { opacity: '' },
            },
        ]);
    });

    test('works with NodeList nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.fadeIn(
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
                styles: { opacity: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { opacity: '0.5' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { opacity: '' },
            },
        ]);
    });

    test('works with HTMLCollection nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.fadeIn(
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
                styles: { opacity: '0.5' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { opacity: '' },
            },
        ]);
    });

    test('works with array nodes', async ({ page }) => {
        await page.evaluate((_) => {
            $.fadeIn([
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
                styles: { opacity: '' },
            },
            {
                selectors: ['#test2', '#test4'],
                progress: 0.5,
                styles: { opacity: '0.5' },
            },
        ]);
        await advanceClock(page, 100);
        await expectAnimationState(page, [
            {
                selectors: ['#test1', '#test2', '#test3', '#test4'],
                styles: { opacity: '' },
            },
        ]);
    });
});
