/** @import { Page } from '@playwright/test'; */

/**
 * Sets up the shared DOM fixture for findByClass and findOneByClass tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setupFindByClass = async ({ page }) => {
    await page.evaluate(() => {
        document.body.innerHTML =
            '<div id="parent1">' +
            '<div id="child1">' +
            '<span id="span1" class="test"></span>' +
            '<span id="span2"></span>' +
            '</div>' +
            '<div id="child2">' +
            '<span id="span3" class="test"></span>' +
            '<span id="span4"></span>' +
            '</div>' +
            '</div>' +
            '<div id="parent2">' +
            '<div id="child3">' +
            '<span id="span5" class="test"></span>' +
            '<span id="span6"></span>' +
            '</div>' +
            '<div id="child4">' +
            '<span id="span7" class="test"></span>' +
            '<span id="span8"></span>' +
            '</div>' +
            '</div>';
    });
};

/**
 * Sets up the shared DOM fixture for findById and findOneById tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setupFindById = async ({ page }) => {
    await page.evaluate(() => {
        document.body.innerHTML =
            '<div id="parent1">' +
            '<div id="child1">' +
            '<span id="test" data-id="span1"></span>' +
            '<span data-id="span2"></span>' +
            '</div>' +
            '<div id="child2">' +
            '<span id="test" data-id="span3"></span>' +
            '<span data-id="span4"></span>' +
            '</div>' +
            '</div>' +
            '<div id="parent2">' +
            '<div id="child3">' +
            '<span id="test" data-id="span5"></span>' +
            '<span data-id="span6"></span>' +
            '</div>' +
            '<div id="child4">' +
            '<span id="test" data-id="span7"></span>' +
            '<span data-id="span8"></span>' +
            '</div>' +
            '</div>';
    });
};

/**
 * Sets up the shared DOM fixture for findByTag and findOneByTag tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setupFindByTag = async ({ page }) => {
    await page.evaluate(() => {
        document.body.innerHTML =
            '<div id="parent1">' +
            '<div id="child1">' +
            '<span id="span1"></span>' +
            '<span id="span2"></span>' +
            '</div>' +
            '<div id="child2">' +
            '<span id="span3"></span>' +
            '<span id="span4"></span>' +
            '</div>' +
            '</div>' +
            '<div id="parent2">' +
            '<div id="child3">' +
            '<span id="span5"></span>' +
            '<span id="span6"></span>' +
            '</div>' +
            '<div id="child4">' +
            '<span id="span7"></span>' +
            '<span id="span8"></span>' +
            '</div>' +
            '</div>';
    });
};
