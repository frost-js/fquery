export const CONTENT_BOX = 0;
export const PADDING_BOX = 1;
export const BORDER_BOX = 2;
export const MARGIN_BOX = 3;
export const SCROLL_BOX = 4;

export const allowedTags = {
    '*': ['class', 'dir', 'id', 'lang', 'role', /^aria-[\w-]*$/i],
    'a': ['target', 'href', 'title', 'rel'],
    'area': [],
    'b': [],
    'br': [],
    'col': [],
    'code': [],
    'div': [],
    'dd': [],
    'dl': [],
    'dt': [],
    'em': [],
    'hr': [],
    'h1': [],
    'h2': [],
    'h3': [],
    'h4': [],
    'h5': [],
    'h6': [],
    'i': [],
    'img': ['src', 'alt', 'title', 'width', 'height'],
    'li': [],
    'ol': [],
    'p': [],
    'pre': [],
    's': [],
    'small': [],
    'span': [],
    'sub': [],
    'sup': [],
    'strong': [],
    'u': [],
    'ul': [],
};

export const uriAttributes = new Set([
    'action',
    'background',
    'cite',
    'formaction',
    'href',
    'itemtype',
    'longdesc',
    'poster',
    'src',
    'xlink:href',
]);

export const eventLookup = {
    mousedown: ['mousemove', 'mouseup'],
    touchstart: ['touchmove', 'touchend touchcancel'],
};

export const animations = new Map();

export const data = new WeakMap();

export const events = new WeakMap();

export const queues = new WeakMap();

export const styles = new WeakMap();
