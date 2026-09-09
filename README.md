# fQuery

[![CI](https://github.com/frost-js/fquery/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/frost-js/fquery/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/frost-js/fquery/branch/main/graph/badge.svg)](https://codecov.io/gh/frost-js/fquery)
[![npm version](https://img.shields.io/npm/v/%40fr0st%2Fquery?style=flat-square)](https://www.npmjs.com/package/@fr0st/query)
[![npm downloads](https://img.shields.io/npm/dm/%40fr0st%2Fquery?style=flat-square)](https://www.npmjs.com/package/@fr0st/query)
[![JS gzip size](https://img.badgesize.io/frost-js/fquery/main/dist/fquery.min.js?compression=gzip&label=JS%20gzip%20size&style=flat-square)](https://github.com/frost-js/fquery/blob/main/dist/fquery.min.js)
[![license](https://img.shields.io/github/license/frost-js/fquery?style=flat-square)](./LICENSE)

Lightweight JavaScript library for DOM querying, traversal, manipulation, events, animation, AJAX, and browser utilities.

## Highlights

- Prebuilt ESM and UMD bundles in `dist/`
- Browser UMD bundle exposed as `globalThis.fQuery` and `globalThis.$`
- Familiar, chainable `QuerySet` API alongside equivalent static functions
- Querying across elements, documents, fragments, shadow roots, collections, and multiple contexts
- DOM traversal, manipulation, attributes, styles, events, selection, and form helpers
- Promise-like AJAX requests and animations, with animation queues and built-in effects
- Dynamic script and stylesheet loading, sanitization, cookies, and browser utilities
- [`@fr0st/core`](https://www.npmjs.com/package/@fr0st/core) helpers exposed with an `_` prefix
- JSDoc-powered IntelliSense

## Installation

### Browser projects / bundlers

```bash
npm i @fr0st/query
```

fQuery's package entry point is ESM-only. In a browser environment, importing the default query function initializes the current `window` and `document` and assigns `window.$`.

```js
import $ from '@fr0st/query';

$('.card').addClass('is-ready');
```

### Browser (ESM)

The ESM bundle imports `@fr0st/core`. Map that dependency when loading the bundle directly in a browser:

```html
<script type="importmap">
{
    "imports": {
        "@fr0st/core": "https://cdn.jsdelivr.net/npm/@fr0st/core@latest/dist/frost-core.esm.min.js"
    }
}
</script>
<script type="module">
    import $ from 'https://cdn.jsdelivr.net/npm/@fr0st/query@latest/dist/fquery.esm.min.js';

    $('.card').addClass('is-ready');
</script>
```

### Browser (UMD)

Load the bundle from your own copy or a CDN:

```html
<script src="/path/to/dist/fquery.min.js"></script>
<!-- or -->
<script src="https://cdn.jsdelivr.net/npm/@fr0st/query@latest/dist/fquery.min.js"></script>
<script>
    $('.card').addClass('is-ready');
</script>
```

The UMD bundle includes `@fr0st/core` and exposes the same object as both `globalThis.fQuery` and `globalThis.$`. If another library already uses `$`, restore it while continuing to use `fQuery`:

```js
fQuery.noConflict();
fQuery('.card').addClass('is-ready');
```

The package root resolves to the prebuilt ESM bundle. Published files under `dist/` and `src/` are also available through matching package subpaths.

### Node and DOM implementations

Outside a browser, the default export is an initializer. Pass it a `Window`, such as one created by JSDOM:

```js
import { JSDOM } from 'jsdom';
import register from '@fr0st/query';

const { window } = new JSDOM('<main><p class="message">Hello</p></main>');
const $ = register(window);

$('.message').setText('Hello from fQuery');
```

The DOM implementation is supplied by the application and is not a dependency of fQuery.

## Quick Start

Query existing nodes and chain operations:

```js
const cards = $('.card')
    .addClass('is-ready')
    .setAttribute('aria-busy', 'false');

cards.find('.title').setText('Ready');

cards.addEvent('click.cards', (event) => {
    $(event.currentTarget).toggleClass('is-active');
});
```

Create nodes from HTML and insert them into the document:

```js
const notice = $('<aside class="notice">Saved</aside>');

notice
    .appendTo(document.body)
    .fadeIn({ duration: 200 });
```

Run code when the document is ready:

```js
$(() => {
    $('[data-autofocus]').focus();
});
```

## Query Model

For node or selector inputs, `$(selector, context?)` and `$.query(selector, context?)` return a `QuerySet`. `$.queryOne(selector, context?)` returns a `QuerySet` containing at most one node.

A selector can be:

- a CSS selector string;
- an HTML string beginning with `<`;
- a `Node`, `DocumentFragment`, `ShadowRoot`, `Document`, or `Window`;
- a `NodeList`, `HTMLCollection`, `QuerySet`, or array of nodes; or
- for `$()` and `$.query()`, a callback to run when the document is ready instead of returning a set.

The optional context can be a selector or one or more element, fragment, shadow-root, or document contexts. It defaults to the configured document.

```js
const form = $('#account-form');
const formFields = $('input, select', form);
const firstError = $.queryOne('.error', form);

console.log(formFields.length);
console.log(firstError.get(0));
```

### QuerySet

A `QuerySet` is iterable and keeps an ordered collection of nodes. Traversal and filtering methods return new sets; DOM mutation methods are chainable and generally return the current set.

- `new $.QuerySet(nodes?)`: construct a set directly.
- `query.length`: return the number of nodes.
- `query.get(index?)`: return one node, including negative indexes, or all nodes when no index is given.
- `query.each(callback)`: run a callback for each node and return the current set.
- `query.map(callback)`: map the nodes into a new `QuerySet`.
- `query.slice(begin?, end?)`: return a sliced `QuerySet`.
- `query.add(selector, context?)`: add nodes and return a new sorted, deduplicated set.
- `query.eq(index)`: return the node at an index as a new set.
- `query.first()` / `query.last()`: return the first or last node as a new set.
- `query[Symbol.iterator]()`: iterate over the contained nodes.

## DOM API

Most operations are available in two forms:

```js
$.addClass(selector, 'active');
$(selector).addClass('active');
```

Unless an entry shows full signatures, the static form takes the target selector as its first argument and the `QuerySet` form omits that argument. A `nodeFilter` can be a CSS selector, node, node collection, `QuerySet`, array, or callback.

### Finding

- `$.find(selector, context?)` / `query.find(selector)`: find all matching descendants.
- `$.findOne(selector, context?)` / `query.findOne(selector)`: find the first matching descendant.
- `$.findByClass(className, context?)` / `query.findByClass(className)`: find descendants by class.
- `$.findOneByClass(className, context?)` / `query.findOneByClass(className)`: find the first descendant by class.
- `$.findById(id, context?)` / `query.findById(id)`: find descendants by ID.
- `$.findOneById(id, context?)` / `query.findOneById(id)`: find the first descendant by ID.
- `$.findByTag(tagName, context?)` / `query.findByTag(tagName)`: find descendants by tag name.
- `$.findOneByTag(tagName, context?)` / `query.findOneByTag(tagName)`: find the first descendant by tag name.

### Traversal

- `child(nodeFilter?)`: return the first matching child.
- `children(nodeFilter?, { elementsOnly? })`: return matching children.
- `contents()`: return children including text and comment nodes.
- `closest(nodeFilter?, limitFilter?)`: return the closest matching ancestor, excluding the node itself and the limit.
- `parent(nodeFilter?)`: return matching direct parents.
- `parents(nodeFilter?, limitFilter?)`: return matching ancestors up to an optional limit.
- `next(nodeFilter?)` / `prev(nodeFilter?)`: return the next or previous element sibling if it matches the filter.
- `nextAll(nodeFilter?, limitFilter?)` / `prevAll(nodeFilter?, limitFilter?)`: return following or preceding matching element siblings before the limit.
- `siblings(nodeFilter?, { elementsOnly? })`: return matching siblings.
- `commonAncestor()`: return the nearest shared ancestor, excluding the input nodes themselves. The static form returns `undefined` when none exists; the QuerySet form returns an empty set.
- `offsetParent()`: return the first node's positioned offset parent.
- `fragment()`: return the first node's `DocumentFragment`.
- `shadow()`: return the first node's `ShadowRoot`.

The static forms of `children`, `nextAll`, `parents`, and `prevAll` also accept `{ first: true }` to stop at the first matching result for each input node.

### Filtering

Filtering methods return matching nodes; their `is...` and `has...` counterparts return booleans.

- `filter(nodeFilter)` / `filterOne(nodeFilter)`: nodes matching a filter.
- `not(nodeFilter)` / `notOne(nodeFilter)`: nodes not matching a filter.
- `connected()` / `isConnected()`: connection to a document, including through a shadow tree.
- `equal(otherSelector)` / `isEqual(otherSelector, { shallow? })`: DOM equality.
- `same(otherSelector)` / `isSame(otherSelector)`: node identity.
- `fixed()` / `isFixed()`: fixed positioning on a node or ancestor.
- `hidden()` / `visible()`: visibility filters.
- `isHidden()` / `isVisible()`: visibility tests.
- `is(nodeFilter)`: whether any node matches a filter.
- `withAnimation()` / `hasAnimation()`: active fQuery animations.
- `withAttribute(attribute)` / `hasAttribute(attribute)`: attribute presence.
- `withChildren()` / `hasChildren()`: child-element presence.
- `withClass(...classes)` / `hasClass(...classes)`: class presence.
- `withCSSAnimation()` / `hasCSSAnimation()`: at least one nonzero computed animation duration.
- `withCSSTransition()` / `hasCSSTransition()`: at least one nonzero computed transition duration.
- `withData(key?)` / `hasData(key?)`: fQuery custom data.
- `hasDataset(key)`: dataset presence.
- `withDescendent(nodeFilter?)` / `hasDescendent(nodeFilter?)`: matching descendants, excluding the node itself. Omitting the filter checks for any descendant element.
- `withProperty(property)` / `hasProperty(property)`: own-property presence.
- `hasFragment()` / `hasShadow()`: fragment or shadow-root presence.

Element visibility is based on the presence of layout rectangles, so fixed-position elements can be visible. `opacity: 0` and `visibility: hidden` do not by themselves make these helpers report an element as hidden. Document and Window visibility uses the document's visibility state.

### Attributes and content

Getter methods read the first matching node. Setter and removal methods apply to each matching node.

- `getAttribute(attribute?)` / `setAttribute(attribute, value)` / `removeAttribute(attribute)`: attributes.
- `getProperty(property)` / `setProperty(property, value)` / `removeProperty(property)`: JavaScript properties.
- `getDataset(key?)` / `setDataset(key, value)` / `removeDataset(key)`: parsed and serialized `dataset` values.
- `getHTML()` / `setHTML(html)`: HTML content.
- `getText()` / `setText(text)`: text content.
- `getValue()` / `setValue(value)`: form-control values.

Omitting the key from `getAttribute()` or `getDataset()` returns all values. `setAttribute()`, `setProperty()`, and `setDataset()` also accept an object of keys and values. `hasDataset()` checks attribute presence, including empty values.

### Custom data

Custom data is stored separately from DOM attributes and `dataset`.

- `getData(key?)`: read one value or the full data object from the first node.
- `setData(key, value)`: set a custom value on every node.
- `removeData(key?)`: remove one value or all custom data.
- `cloneData(otherSelector)`: copy each source node's custom data to every destination; later sources take precedence for shared keys.

`setData()` also accepts an object of keys and values. Data copies are shallow, so stored object values remain shared.

### Classes and styles

- `addClass(...classes)` / `removeClass(...classes)` / `toggleClass(...classes)`: change classes. Arrays and space-separated strings are accepted.
- `css(style?)`: read one computed CSS value, or all values when omitted, from the first node.
- `getStyle(style?)`: read one inline style value, or all values when omitted, from the first node.
- `setStyle(style, value, { important? })`: set one or more inline styles.
- `setStyleLock(property, value, { important? })`: temporarily set and lock one inline property on every matched element. Returns a release function.
- `removeStyle(style)`: remove an inline style.
- `hide()` / `show()` / `toggle(force?)`: change element visibility. Pass `true` to `toggle()` to show or `false` to hide; omit it to toggle the current state.

CSS custom property names are preserved verbatim, including case: `--brandColor` and `--brand-color` are distinct properties.

Style locks accept supported longhand properties and CSS custom properties. Shorthands, aliases, invalid values, and attempts to lock an already locked property throw before any matched element is changed. Property names and numeric values use the same normalization as `setStyle()`.

Locks also throw before changing any matched element when an existing longhand value cannot be restored, such as `padding-left` supplied by an inline `padding: var(--spacing)` shorthand. Locks that would reorder an existing declaration also throw, such as locking `width` declared before `inline-size`. Empty custom properties remain supported.

```js
const release = $('.panel').setStyleLock('display', 'none');

release(); // Restore each element's original inline value and !important priority.
```

The static form is `$.setStyleLock(selector, property, value, options?)`. Use `release({ restore: false })` to unlock while keeping the current declaration. Calling the release function again does nothing. Locks are cooperative: ordinary `setStyle()` calls and direct DOM writes can still change the property, and releasing restores the original declaration by default. Different properties can be locked independently.

`hide()` holds a display lock until `show()` releases it, preserving the original inline display value and priority across repeated hides and toggle cycles. Hiding an element whose display is already locked by another caller throws; `show()` only releases locks created by `hide()`.

### Size, position, and scrolling

`height()` and `width()` accept `{ boxSize, outer }`. Use `$.CONTENT_BOX`, `$.PADDING_BOX`, `$.BORDER_BOX`, `$.MARGIN_BOX`, or `$.SCROLL_BOX` for `boxSize`.

- `height(options?)` / `width(options?)`: read the first node's computed dimensions.
- `center({ offset? })`: return center coordinates.
- `position({ offset? })`: return positioned coordinates.
- `rect({ offset? })`: return the bounding rectangle.
- `constrain(containerSelector)`: keep nodes within a container.
- `distTo(x, y, { offset? })` / `distToNode(otherSelector)`: calculate distances.
- `nearestTo(x, y, { offset? })` / `nearestToNode(otherSelector)`: return the nearest node.
- `percentX(x, { offset?, clamp? })` / `percentY(y, { offset?, clamp? })`: convert a coordinate to a percentage of the node.
- `getScrollX()` / `getScrollY()`: read scroll coordinates.
- `setScroll(x, y)` / `setScrollX(x)` / `setScrollY(y)`: set scroll coordinates.

### Manipulation

Methods accepting `otherSelector` also accept nodes, collections, QuerySets, arrays, and—where creation is supported—HTML strings.

- `append(otherSelector)` / `prepend(otherSelector)`: insert content inside each target.
- `appendTo(otherSelector)` / `prependTo(otherSelector)`: insert each target inside another node.
- `before(otherSelector)` / `after(otherSelector)`: insert content adjacent to each target.
- `insertBefore(otherSelector)` / `insertAfter(otherSelector)`: insert each target adjacent to another node.
- `replaceWith(otherSelector)` / `replaceAll(otherSelector)`: replace targets or other nodes.
- `wrap(otherSelector)` / `wrapAll(otherSelector)` / `wrapInner(otherSelector)`: wrap nodes or their contents.
- `unwrap(nodeFilter?)`: remove matching parents while preserving their contents.
- `clone({ deep?, events?, data?, animations? })`: clone nodes and optionally their fQuery state.
- `detach()`: remove nodes while preserving associated state.
- `remove()`: remove nodes and their associated state.
- `empty()`: remove all child nodes and their associated state.
- `attachShadow({ open? })`: attach a shadow root to the first node.

Cloning is deep by default; copying events, data, and animations is opt-in. Deep cloning includes requested state inside `template.content`. `setHTML()` replaces a template's content, while `empty()` and `setText()` affect its own child nodes. Cleanup preserves state on surviving shadow trees and template content fragments.

Create nodes without a target:

- `$.create(tagName?, options?)`: create an element with optional `html`, `text`, `class`, `style`, `value`, `attributes`, `properties`, and `dataset`.
- `$.createComment(comment)`: create a comment node.
- `$.createText(text)`: create a text node.
- `$.createFragment()`: create a document fragment.
- `$.createRange()`: create a range.

## Events

Event names may include namespaces such as `click.menu`. Returning `false` from an event callback prevents the default action.

- `addEvent(events, callback, options?)`: add one or more event handlers.
- `addEventOnce(events, callback, options?)`: add self-removing handlers.
- `addEventDelegate(events, delegate, callback, options?)`: add delegated handlers.
- `addEventDelegateOnce(events, delegate, callback, options?)`: add self-removing delegated handlers.
- `removeEvent(events?, callback?, options?)`: remove matching handlers.
- `removeEventDelegate(events?, delegate?, callback?, options?)`: remove matching delegated handlers.
- `cloneEvents(otherSelector)`: copy registered handlers to other nodes.
- `triggerEvent(events, options?)`: trigger events on every node.
- `triggerOne(event, options?)`: trigger an event on the first node and return whether it was not cancelled, or `undefined` for an empty selection.
- `blur()` / `click()` / `focus()`: invoke the native action on the first node.

Listener options include `capture` and `passive`; the static `$.addEvent()` form also accepts `delegate` and `selfDestruct`. Trigger options include `data`, `detail`, `bubbles`, and `cancelable`.

Delegation matches the target or its nearest matching ancestor before the container. Scoped selectors use that container as `:scope`; Window delegation uses its document. During a delegated callback, `event.currentTarget` is the matching element and `event.delegateTarget` is the container.

`$.mouseDragFactory(down, move?, up?, options?)` creates a mouse/touch drag callback. Options include `debounce`, `passive`, `preventDefault`, and the required number of `touches`.

## Animation and Queues

### Animation

```js
await $.fadeIn('.panel', { duration: 200 });

$('.meter').animate((node, progress) => {
    node.style.width = `${progress * 100}%`;
}, { duration: 500 });
```

Common animation options are:

| Option | Default | Description |
| --- | --- | --- |
| `duration` | `1000` | Duration in milliseconds. |
| `type` | `'ease-in-out'` | One of `linear`, `ease-in`, `ease-out`, or `ease-in-out`. |
| `infinite` | `false` | Repeat indefinitely. |
| `debug` | `false` | Expose timing values through `dataset`. |
| `start` | Current performance time | Start time in the configured Window's `performance.now()` clock. |
| `queueName` | `'default'` | Queue used by QuerySet animation methods. |

- `animate(callback, options?)`: run a custom progress callback.
- `dropIn(options?)` / `dropOut(options?)`: drop nodes from or toward a direction.
- `fadeIn(options?)` / `fadeOut(options?)`: animate opacity.
- `rotateIn(options?)` / `rotateOut(options?)`: animate a 3D rotation.
- `slideIn(options?)` / `slideOut(options?)`: slide nodes from or toward a direction.
- `squeezeIn(options?)` / `squeezeOut(options?)`: animate dimensions from or toward a direction.
- `stop({ finish? })`: stop active animations, finishing them by default.

Slide and drop effects use transforms for movement. Squeeze effects animate width or height and use transforms for positional offsets.

Slide, drop, and squeeze effects accept `direction` as `top`, `right`, `bottom`, `left`, or a function returning a direction. Slide and squeeze default to `bottom`; drop defaults to `top`. Rotation accepts `x`, `y`, and `z` axis components (defaulting to `0`, `1`, and `0`) and `inverse` (defaulting to `false`).

Built-in effects lock the inline properties they change and restore them when they complete or are stopped with `finish: true`. Stopping with `finish: false` releases the locks while leaving the current animated styles in place. Failed effects release their locks and restore their original styles. Effects reject if a property is already locked or its original declaration cannot be safely restored; effects using different properties can run together.

Frame updates preserve existing inline `!important` priorities. Cloned effects retain the source animation's original declarations for restoration.

Static animation methods return an `AnimationSet`. QuerySet animation methods queue the work and return the current set. QuerySet `stop()` also clears all queues before stopping active animations.

`new $.Animation(node, callback, options?)` creates one promise-like animation. It supports `then`, `catch`, `finally`, `clone(node)`, `stop({ finish? })`, and `update(time?)`. `new $.AnimationSet(animations)` combines animations and supports `then`, `catch`, `finally`, and `stop({ finish? })`.

Use `$.getAnimationDefaults()` and `$.setAnimationDefaults(options)` to inspect or change defaults. `$.useTimeout(true)` selects the timer fallback instead of animation frames.

### Queues

```js
$('.notice')
    .fadeIn({ duration: 150 })
    .delay(500)
    .fadeOut({ duration: 150 });
```

- `$.queue(selector, callback, { queueName? })` and `query.queue(callback, { queueName? })` queue callbacks.
- `$.clearQueue(selector, { queueName? })` and `query.clearQueue({ queueName? })` clear the default or named queue. Pass `{ queueName: null }` to clear all queues.
- `query.delay(duration, { queueName? })` queues a delay.

## AJAX

fQuery uses `XMLHttpRequest` and returns a promise-like `AjaxRequest`:

```js
const request = $.get('/api/items', { page: 2 }, {
    responseType: 'json',
});

const { response, xhr } = await request;
```

- `$.ajax(options?)`: create a request with explicit options.
- `$.get(url, data?, options?)`: send a GET request.
- `$.post(url, data?, options?)`: send a POST request.
- `$.put(url, data?, options?)`: send a PUT request.
- `$.patch(url, data?, options?)`: send a PATCH request.
- `$.delete(url, options?)`: send a DELETE request.

Request options include:

| Option | Default | Description |
| --- | --- | --- |
| `url` | Current location | Request URL. |
| `method` | `'GET'` | HTTP method. |
| `data` | `null` | String, array, object, boolean, or `FormData` payload. |
| `contentType` | `'application/x-www-form-urlencoded'` | Default Content-Type header, or `false` to omit the automatically generated header. |
| `responseType` | `null` | Expected response type. |
| `mimeType` | — | MIME type override. |
| `username` / `password` | — | HTTP authentication values. |
| `timeout` | `0` | Timeout in milliseconds. |
| `cache` | `true` | Add a cache-busting query value when disabled. |
| `processData` | `true` | Encode object data using the final Content-Type header; GET and HEAD use query parameters. |
| `isLocal` | Auto-detected | Treat the request as local. |
| `rejectOnCancel` | `true` | Reject cancellation through `cancel()` or `xhr.abort()`. |
| `headers` | `{}` | Additional request headers, merged case-insensitively over defaults. |
| `beforeSend` / `afterSend` | `null` | Hooks receiving the `XMLHttpRequest`. |
| `onProgress` / `onUploadProgress` | `null` | Hooks receiving `(progress, xhr, event)`. |
| `xhr` | XMLHttpRequest factory | Function returning the request object. |

GET and HEAD data is appended to the URL. Relative URLs, including cache-busting rewrites, resolve against the configured Window document's base URI. With `processData: true`, object request bodies are encoded using the final Content-Type header, ignoring parameters such as charset: JSON is stringified, URL-encoded data uses `parseParams()`, and other object data uses `parseFormData()`. Existing `FormData` is sent directly without an automatically generated Content-Type header.

`AjaxRequest` exposes its `xhr`, implements `then`, `catch`, and `finally`, and can be cancelled with `request.cancel(reason?)`. Use `$.getAjaxDefaults()` and `$.setAjaxDefaults(options)` to inspect or change request defaults.

HTTP error statuses, network errors, and timeouts reject with `{ status, xhr, event }`; cancellation rejects with `{ status, xhr, reason }`. Setting `rejectOnCancel: false` leaves a cancelled request's promise pending.

`$.parseParams(data)` produces URL-encoded parameters and `$.parseFormData(data)` produces a `FormData` object. Both accept objects or `{ name, value }` entries. `parseFormData()` preserves repeated names and `File` or `Blob` values.

## Scripts, Stylesheets, and Cookies

- `$.loadScript(url, attributes?, options?)`: load one script. Scripts default to ordered execution.
- `$.loadScripts(urls, options?)`: load multiple scripts. Entries can be URLs or attribute objects.
- `$.loadStyle(url, attributes?, options?)`: load one stylesheet.
- `$.loadStyles(urls, options?)`: load multiple stylesheets. Entries can be URLs or attribute objects.

Loader options include `cache` and an alternate document `context`. Each function returns a `Promise`.

Cookie helpers are `$.getCookie(name)`, `$.setCookie(name, value, { expires?, path?, secure? })`, and `$.removeCookie(name, { path?, secure? })`. Cookie expiration is specified in seconds.

## Parsing, Selection, and Utilities

### Parsing and sanitization

- `$.parseHTML(html)`: parse HTML into an array of elements; top-level text and comment nodes are discarded.
- `$.parseDocument(input, { contentType? })`: parse text into a `Document`.
- `$.sanitize(html, allowedTags?)`: remove disallowed elements and attributes from HTML.

The sanitizer's `allowedTags` argument maps lowercase tag names to arrays of allowed attribute names or regular expressions. String rules match exact attribute names, while the `'*'` entry applies attributes to every allowed tag. URI attributes using the `javascript:` protocol are removed; other protocols are not filtered.

When `template` is allowed, its content is sanitized recursively.

### Selection

- `select()` / `selectAll()`: select the first node or all target nodes.
- `beforeSelection()` / `afterSelection()`: insert nodes before or after the current selection.
- `wrapSelection()`: wrap the current selection with the target nodes.

Static-only helpers are `$.getSelection()` and `$.extractSelection()`.

`getSelection()` includes selected text and comment nodes and returns an empty array for a collapsed selection. Partially selected nodes are returned as whole nodes. Empty or unmatched inputs to `beforeSelection()`, `afterSelection()`, and `wrapSelection()` leave the current selection intact.

### Forms and general utilities

- `serialize()`: serialize successful form controls into a query string.
- `serializeArray()`: serialize successful form controls into `{ name, value }` entries.
- `index()`: return the first node's index within its parent.
- `indexOf(nodeFilter?)`: return the first matching index within the set.
- `normalize()`: join adjacent text nodes and remove empty text nodes.
- `sort()`: sort nodes by document position.
- `tagName()`: return the first node's lowercase tag name.

Forms include associated controls outside their DOM subtree. Disabled controls, disabled options, non-submitting controls, and controls inside `datalist` are excluded. `serializeArray()` preserves repeated names and original line endings; `serialize()` normalizes line endings in names and values to CRLF before encoding. Use `FormData` for file uploads.

Additional static utilities are:

- `$.debounce(callback)` to allow one callback execution per microtask;
- `$.exec(command, value?)` to call `document.execCommand()`;
- `$.ready(callback)` to run after DOM readiness; and
- `$.noConflict()` to restore the previous global `$`.

## Configuration and FrostCore

The active DOM environment can be inspected with `$.getWindow()` and `$.getContext()`, or changed with `$.setWindow(window)` and `$.setContext(document)`. Registering fQuery configures both automatically.

Every export from [`@fr0st/core`](https://www.npmjs.com/package/@fr0st/core) is exposed with an underscore prefix:

```js
const id = $._randomString(12);
const values = $._unique([1, 1, 2]);
```

These prefixed helpers follow the installed FrostCore version. Consult FrostCore for its complete API.

## Behavior Notes

- Selector-based operations use the configured document unless an explicit context is supplied.
- `QuerySet` getter methods generally inspect the first node; mutations generally apply to every node.
- `queryOne()` and `findOne...()` QuerySet methods return sets containing zero or one node.
- HTML strings are recognized by query and creation-aware manipulation APIs when the trimmed string begins with `<`.
- Custom data, registered events, queues, and animations are tracked outside the DOM and cleaned up by fQuery manipulation methods. Cloning can optionally copy data, events, and animations.
- Event namespaces affect fQuery handler registration and removal; native event dispatch still uses the underlying event name.
- Ajax uses `XMLHttpRequest`, not `fetch`.
- fQuery requires a browser DOM or a compatible DOM implementation.

## Development

Install dependencies with `npm ci`, then install Playwright browsers with `npx playwright install --with-deps`.

```bash
npm test
npm run lint
npm run build
```

`npm test` rebuilds the bundles, then runs the Playwright suite in Chromium, Firefox, and WebKit. `npm run test:browser` runs the suite against the existing bundles, so rebuild after changing source files.

After building, `npm run test:coverage` runs Chromium tests and writes coverage reports to `coverage/`.

`npm run test:headed` and `npm run test:ui` also use the existing bundles and open headed browsers or the Playwright UI.

Shared behavior cases live in `test/cases/`, mirroring the feature paths under `test/browser/dom/` and `test/browser/query/`. Import them through `#cases/*`. Each module exports a `setup` callback and a function that registers its shared cases. Register `test.beforeEach(setup)` explicitly in each API's suite so both shared and dedicated tests receive the same setup.

Keep API-specific checks, such as accepted node inputs, QuerySet chainability, return types, and animation queues, in the corresponding browser suite. Use `test/support/` for browser fixtures, assertions, and support utilities.

Group longer suites with shallow `test.describe()` blocks named for behavior. Keep shared setup on the outer suite and lifecycle scenarios as explicit tests.

## License

fQuery is released under the [MIT License](./LICENSE).
