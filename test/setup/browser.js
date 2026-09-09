/** @import { Page } from '@playwright/test'; */

/**
 * Install Playwright's browser clock and pause it at a stable fixed time.
 * @param {Page} page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export async function setupClock(page) {
    await page.clock.install({ time: 0 });
    await page.clock.pauseAt(60000);
}

/**
 * Deterministically advance the browser clock, including enough margin for a
 * queued start and a frame on the requested boundary to be processed.
 * @param {Page} page The Playwright page.
 * @param {number} milliseconds The duration to advance.
 * @returns {Promise<void>} The promise.
 */
export async function advanceClock(page, milliseconds) {
    await page.clock.runFor(milliseconds + 2);
}
