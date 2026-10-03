/** @import { Page } from '@playwright/test'; */

/**
 * Sets up the shared DOM fixture for query, traversal, and QuerySet add tests.
 * @param {object} fixtures The test fixtures.
 * @param {Page} fixtures.page The Playwright page.
 * @returns {Promise<void>} The promise.
 */
export const setupQuery = async ({ page }) => {
    await page.evaluate(() => {
        document.body.innerHTML =
            '<div id="parent1">' +
            '<div id="child1">' +
            '<span id="span1" class="span1 group1">' +
            '<a id="a1" class="group1">' +
            '<strong id="strong1" class="group1"></strong>' +
            '</a>' +
            '<a id="a2" class="group1">' +
            '<strong id="strong2" class="group1"></strong>' +
            '</a>' +
            '<a id="a3" class="group1" data-toggle="test">' +
            '<strong id="strong3" class="group1"></strong>' +
            '</a>' +
            '</span>' +
            '<span id="span2" class="span1 group1">' +
            '<a id="a4" class="group1">' +
            '<strong id="strong4" class="group1"></strong>' +
            '</a>' +
            '<a id="a5" class="group1">' +
            '<strong id="strong5" class="group1"></strong>' +
            '</a>' +
            '<a id="a6" class="group1" data-toggle="test">' +
            '<strong id="strong6" class="group1"></strong>' +
            '</a>' +
            '</span>' +
            '</div>' +
            '<div id="child2">' +
            '<span id="span3" class="span1 group1">' +
            '<a id="a7" class="group1">' +
            '<strong id="strong7" class="group1"></strong>' +
            '</a>' +
            '<a id="a8" class="group1">' +
            '<strong id="strong8" class="group1"></strong>' +
            '</a>' +
            '<a id="a9" class="group1" data-toggle="test">' +
            '<strong id="strong9" class="group1"></strong>' +
            '</a>' +
            '</span>' +
            '<span id="span4" class="span1 group1"></span>' +
            '</div>' +
            '<div id="child3">' +
            '<span id="span5" class="span1 group1"></span>' +
            '<span id="span6" class="span1 group1"></span>' +
            '</div>' +
            '</div>' +
            '<div id="parent2">' +
            '<div id="child4">' +
            '<span id="span7" class="span2 group2">' +
            '<a id="a10" class="group2">' +
            '<strong id="strong10" class="group2"></strong>' +
            '</a>' +
            '<a id="a11" class="group2">' +
            '<strong id="strong11" class="group2"></strong>' +
            '</a>' +
            '<a id="a12" class="group2" data-toggle="test">' +
            '<strong id="strong12" class="group2"></strong>' +
            '</a>' +
            '</span>' +
            '<span id="span8" class="span2 group2">' +
            '<a id="a13" class="group2">' +
            '<strong id="strong13" class="group2"></strong>' +
            '</a>' +
            '<a id="a14" class="group2">' +
            '<strong id="strong14" class="group2"></strong>' +
            '</a>' +
            '<a id="a15" class="group2" data-toggle="test">' +
            '<strong id="strong15" class="group2"></strong>' +
            '</a>' +
            '</span>' +
            '</div>' +
            '<div id="child5">' +
            '<span id="span9" class="span2 group2">' +
            '<a id="a16" class="group2">' +
            '<strong id="strong16" class="group2"></strong>' +
            '</a>' +
            '<a id="a17" class="group2">' +
            '<strong id="strong17" class="group2"></strong>' +
            '</a>' +
            '<a id="a18" class="group2" data-toggle="test">' +
            '<strong id="strong18" class="group2"></strong>' +
            '</a>' +
            '</span>' +
            '<span id="span10" class="span2 group2"></span>' +
            '</div>' +
            '<div id="child6">' +
            '<span id="span11" class="span2 group2"></span>' +
            '<span id="span12" class="span2 group2"></span>' +
            '</div>' +
            '</div>';
    });
};
