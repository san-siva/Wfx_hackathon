'use strict';
console.log('Content script injected!');
const defaultStyles = {
    accentColor: 'auto',
    alignContent: 'normal',
    alignItems: 'normal',
    alignSelf: 'auto',
    alignmentBaseline: 'auto',
    animation: 'none 0s ease 0s 1 normal none running',
    animationDelay: '0s',
    animationDirection: 'normal',
    animationDuration: '0s',
    animationFillMode: 'none',
    animationIterationCount: '1',
    animationName: 'none',
    animationPlayState: 'running',
    animationTimingFunction: 'ease',
    appearance: 'none',
    backdropFilter: 'none',
    backfaceVisibility: 'visible',
    background: 'rgba(0, 0, 0, 0) none repeat scroll 0% 0% / auto padding-box border-box',
    backgroundAttachment: 'scroll',
    backgroundBlendMode: 'normal',
    backgroundClip: 'border-box',
    backgroundColor: 'rgba(0, 0, 0, 0)',
    backgroundImage: 'none',
    backgroundOrigin: 'padding-box',
    backgroundPosition: '0% 0%',
    backgroundRepeat: 'repeat',
    backgroundSize: 'auto',
    blockSize: 'auto',
    border: '0px none rgb(0, 0, 0)',
    borderBlockEnd: '0px none rgb(0, 0, 0)',
    borderBlockStart: '0px none rgb(0, 0, 0)',
    borderBottom: '0px none rgb(0, 0, 0)',
    borderBottomLeftRadius: '0px',
    borderBottomRightRadius: '0px',
    borderCollapse: 'separate',
    borderColor: 'rgb(0, 0, 0)',
    borderImage: 'none',
    borderInlineEnd: '0px none rgb(0, 0, 0)',
    borderInlineStart: '0px none rgb(0, 0, 0)',
    borderLeft: '0px none rgb(0, 0, 0)',
    borderRadius: '0px',
    borderRight: '0px none rgb(0, 0, 0)',
    borderSpacing: '0px 0px',
    borderStyle: 'none',
    borderTop: '0px none rgb(0, 0, 0)',
    borderWidth: '0px',
    bottom: 'auto',
    boxShadow: 'none',
    boxSizing: 'content-box',
    breakAfter: 'auto',
    breakBefore: 'auto',
    breakInside: 'auto',
    captionSide: 'top',
    caretColor: 'rgb(0, 0, 0)',
    clear: 'none',
    clip: 'auto',
    clipPath: 'none',
    color: 'rgb(0, 0, 0)',
    colorInterpolation: 'srgb',
    colorInterpolationFilters: 'linearrgb',
    colorScheme: 'normal',
    columnCount: 'auto',
    columnGap: 'normal',
    columnWidth: 'auto',
    content: 'normal',
    cursor: 'auto',
    direction: 'ltr',
    display: 'inline',
    emptyCells: 'show',
    fill: 'rgb(0, 0, 0)',
    filter: 'none',
    flex: '0 1 auto',
    flexBasis: 'auto',
    flexDirection: 'row',
    flexGrow: '0',
    flexShrink: '1',
    flexWrap: 'nowrap',
    float: 'none',
    font: '16px sans-serif',
    fontFamily: 'sans-serif',
    fontSize: '16px',
    fontStretch: '100%',
    fontStyle: 'normal',
    fontVariant: 'normal',
    fontWeight: '400',
    height: 'auto',
    inlineSize: 'auto',
    isolation: 'auto',
    justifyContent: 'normal',
    left: 'auto',
    letterSpacing: 'normal',
    lineHeight: 'normal',
    listStyle: 'outside none disc',
    margin: '0px',
    maxBlockSize: 'none',
    maxHeight: 'none',
    maxInlineSize: 'none',
    maxWidth: 'none',
    minBlockSize: '0px',
    minHeight: '0px',
    minInlineSize: '0px',
    minWidth: '0px',
    mixBlendMode: 'normal',
    objectFit: 'fill',
    objectPosition: '50% 50%',
    opacity: '1',
    orphans: '2',
    outline: 'rgb(0, 0, 0) none 0px',
    overflow: 'visible',
    overflowAnchor: 'auto',
    overflowWrap: 'normal',
    overflowX: 'visible',
    overflowY: 'visible',
    padding: '0px',
    perspective: 'none',
    pointerEvents: 'auto',
    position: 'static',
    resize: 'none',
    right: 'auto',
    rowGap: 'normal',
    scrollBehavior: 'auto',
    tabSize: '8',
    tableLayout: 'auto',
    textAlign: 'start',
    textAlignLast: 'auto',
    textDecoration: 'none solid rgb(0, 0, 0)',
    textDecorationLine: 'none',
    textIndent: '0px',
    textOverflow: 'clip',
    textRendering: 'auto',
    textShadow: 'none',
    textTransform: 'none',
    top: 'auto',
    touchAction: 'auto',
    transform: 'none',
    transformStyle: 'flat',
    transition: 'all 0s ease 0s',
    unicodeBidi: 'normal',
    userSelect: 'auto',
    verticalAlign: 'baseline',
    visibility: 'visible',
    whiteSpace: 'normal',
    widows: '2',
    width: 'auto',
    willChange: 'auto',
    wordBreak: 'normal',
    wordSpacing: '0px',
    writingMode: 'horizontal-tb',
    zIndex: 'auto',
    zoom: '1',
    additiveSymbols: '',
    all: '',
    anchorName: 'none',
    anchorScope: 'none',
    animationComposition: 'replace',
    animationRange: 'normal',
    animationRangeEnd: 'normal',
    animationRangeStart: 'normal',
    animationTimeline: 'auto',
    appRegion: 'none',
    ascentOverride: '',
    aspectRatio: 'auto',
    baselineShift: '0px',
    baselineSource: 'auto',
    borderEndEndRadius: '0px',
    borderEndStartRadius: '0px',
    borderStartEndRadius: '0px',
    borderStartStartRadius: '0px',
    boxDecorationBreak: 'slice',
    bufferedRendering: 'auto',
    colorRendering: 'auto',
    contain: 'none',
    containIntrinsicBlockSize: 'none',
    containIntrinsicHeight: 'none',
    containIntrinsicInlineSize: 'none',
    containIntrinsicSize: 'none',
    containIntrinsicWidth: 'none',
    container: 'none',
    containerName: 'none',
    containerType: 'normal',
    contentVisibility: 'visible',
    counterIncrement: 'none',
    counterReset: 'none',
    counterSet: 'none',
    cx: '0px',
    cy: '0px',
    d: 'none',
    descentOverride: '',
    dominantBaseline: 'auto',
    fieldSizing: 'fixed',
    fillOpacity: '1',
    fillRule: 'nonzero',
    floodColor: 'rgb(0, 0, 0)',
    floodOpacity: '1',
    fontDisplay: '',
    fontFeatureSettings: 'normal',
    fontKerning: 'auto',
    fontOpticalSizing: 'auto',
    fontPalette: 'normal',
    fontSizeAdjust: 'none',
    fontSynthesis: 'weight style small-caps',
    fontSynthesisSmallCaps: 'auto',
    fontSynthesisStyle: 'auto',
    fontSynthesisWeight: 'auto',
    fontVariantAlternates: 'normal',
    fontVariantCaps: 'normal',
    fontVariantEastAsian: 'normal',
    fontVariantEmoji: 'normal',
    fontVariantLigatures: 'normal',
    fontVariantNumeric: 'normal',
    fontVariantPosition: 'normal',
    fontVariationSettings: 'normal',
    forcedColorAdjust: 'auto',
    gap: 'normal',
    grid: 'none / none / none / row / auto / auto',
    gridArea: 'auto',
    gridAutoColumns: 'auto',
    gridAutoFlow: 'row',
    gridAutoRows: 'auto',
    gridColumn: 'auto',
    gridColumnEnd: 'auto',
    gridColumnStart: 'auto',
    gridRow: 'auto',
    gridRowEnd: 'auto',
    gridRowStart: 'auto',
    gridTemplate: 'none',
    gridTemplateAreas: 'none',
    gridTemplateColumns: 'none',
    gridTemplateRows: 'none',
    hyphenateCharacter: 'auto',
    hyphenateLimitChars: 'auto',
    hyphens: 'manual',
    imageOrientation: 'from-image',
    imageRendering: 'auto',
    initialLetter: 'normal',
    inset: 'auto',
    insetBlock: 'auto',
    insetBlockEnd: 'auto',
    insetBlockStart: 'auto',
    insetInline: 'auto',
    insetInlineEnd: 'auto',
    insetInlineStart: 'auto',
    interpolateSize: 'numeric-only',
    justifyItems: 'normal',
    justifySelf: 'auto',
    lightingColor: 'rgb(255, 255, 255)',
    lineBreak: 'auto',
    lineGapOverride: '',
    marker: 'none',
    markerEnd: 'none',
    markerMid: 'none',
    markerStart: 'none',
    mask: 'none',
    maskClip: 'border-box',
    maskComposite: 'add',
    maskImage: 'none',
    maskMode: 'match-source',
    maskOrigin: 'border-box',
    maskPosition: '0% 0%',
    maskRepeat: 'repeat',
    maskSize: 'auto',
    maskType: 'luminance',
    mathDepth: '0',
    mathShift: 'normal',
    mathStyle: 'normal',
    objectViewBox: 'none',
    offset: 'none 0px auto 0deg',
    offsetAnchor: 'auto',
    offsetDistance: '0px',
    offsetPath: 'none',
    offsetPosition: 'normal',
    offsetRotate: 'auto 0deg',
    order: '0',
    overflowClipMargin: '0px',
    overscrollBehavior: 'auto',
    overscrollBehaviorBlock: 'auto',
    overscrollBehaviorInline: 'auto',
    overscrollBehaviorX: 'auto',
    overscrollBehaviorY: 'auto',
    paintOrder: 'normal',
    perspectiveOrigin: '50% 50%',
    placeContent: 'normal',
    placeItems: 'normal',
    placeSelf: 'auto',
    r: '0px',
    rotate: 'none',
    rubyAlign: 'space-around',
    rubyPosition: 'over',
    rx: 'auto',
    ry: 'auto',
    scale: 'none',
    scrollMargin: '0px',
    scrollMarginBlock: '0px',
    scrollMarginBlockEnd: '0px',
    scrollMarginBlockStart: '0px',
    scrollMarginBottom: '0px',
    scrollMarginInline: '0px',
    scrollMarginInlineEnd: '0px',
    scrollMarginInlineStart: '0px',
    scrollMarginLeft: '0px',
    scrollMarginRight: '0px',
    scrollMarginTop: '0px',
    scrollPadding: 'auto',
    scrollPaddingBlock: 'auto',
    scrollPaddingBlockEnd: 'auto',
    scrollPaddingBlockStart: 'auto',
    scrollPaddingBottom: 'auto',
    scrollPaddingInline: 'auto',
    scrollPaddingInlineEnd: 'auto',
    scrollPaddingInlineStart: 'auto',
    scrollPaddingLeft: 'auto',
    scrollPaddingRight: 'auto',
    scrollPaddingTop: 'auto',
    scrollSnapAlign: 'none',
    scrollSnapStop: 'normal',
    scrollSnapType: 'none',
    scrollTimeline: 'none',
    scrollTimelineAxis: 'block',
    scrollTimelineName: 'none',
    scrollbarColor: 'auto',
    scrollbarGutter: 'auto',
    scrollbarWidth: 'auto',
    shapeImageThreshold: '0',
    shapeMargin: '0px',
    shapeOutside: 'none',
    shapeRendering: 'auto',
    speak: 'normal',
    stopColor: 'rgb(0, 0, 0)',
    stopOpacity: '1',
    stroke: 'none',
    strokeDasharray: 'none',
    strokeDashoffset: '0px',
    strokeLinecap: 'butt',
    strokeLinejoin: 'miter',
    strokeMiterlimit: '4',
    strokeOpacity: '1',
    strokeWidth: '1px',
    textAnchor: 'start',
    textBox: 'normal',
    textBoxEdge: 'auto',
    textBoxTrim: 'none',
    textCombineUpright: 'none',
    textDecorationSkipInk: 'auto',
    textDecorationThickness: 'auto',
    textEmphasis: 'none rgb(0, 0, 0)',
    textEmphasisColor: 'rgb(0, 0, 0)',
    textEmphasisPosition: 'over',
    textEmphasisStyle: 'none',
    textOrientation: 'mixed',
    textSizeAdjust: 'auto',
    textSpacingTrim: 'normal',
    textUnderlineOffset: 'auto',
    textUnderlinePosition: 'auto',
    textWrap: 'wrap',
    textWrapMode: 'wrap',
    textWrapStyle: 'auto',
    timelineScope: 'none',
    transformBox: 'view-box',
    transitionBehavior: 'normal',
    translate: 'none',
    unicodeRange: '',
    vectorEffect: 'none',
    viewTimeline: 'none',
    viewTimelineAxis: 'block',
    viewTimelineInset: 'auto',
    viewTimelineName: 'none',
    viewTransitionClass: 'none',
    viewTransitionName: 'none',
    whiteSpaceCollapse: 'collapse',
    wordWrap: 'normal',
    x: '0px',
    y: '0px',
};
const getStyles = (element) => {
    const styles = {};
    const computedStyles = window.getComputedStyle(element);
    for (const [property, value] of Object.entries(computedStyles)) {
        if (!value || value === 'auto')
            continue;
        if (!isNaN(parseInt(property)))
            continue;
        const match = property.match(/^webkit.*/);
        if (match)
            continue;
        if (property in defaultStyles)
            if (defaultStyles[property] === value)
                continue;
        styles[property] = value;
    }
    return styles;
};
const getAttributes = (element) => {
    const attributes = {};
    for (const attribute of element.getAttributeNames()) {
        attributes[attribute] = element.getAttribute(attribute);
    }
    return attributes;
};
const generateHash = async (message) => {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray
        .map(byte => byte.toString(16).padStart(2, '0'))
        .join('');
    return hashHex;
};
const DISABLED_ELEMENTS = new Set([
    'SCRIPT',
    'NOSCRIPT',
    'STYLE',
    'LINK',
    'META',
    'HEAD',
    'SVG',
]);
const crawlElement = async (element = document.querySelector('body'), traversal = '', siblingOrder = 0) => {
    const { tagName: tag } = element;
    const path = `${traversal}${tag}[${siblingOrder}]`;
    const elementData = {
        path,
        uuid: await generateHash(path),
        tag,
        attributes: getAttributes(element),
        style: getStyles(element),
        image: '',
        innerTextHash: element?.innerText
            ? await generateHash(element.innerText)
            : '',
        getBoundingClientRect: element.getBoundingClientRect(),
        isVisible: element.checkVisibility(),
        children: [],
    };
    const children = element.children;
    for (let idx = 0; idx < children.length; idx++) {
        if (DISABLED_ELEMENTS.has(children[idx].tagName))
            continue;
        elementData.children.push(await crawlElement(children[idx], `${elementData.path}/`, idx));
    }
    return elementData;
};
const pathToParent = (element, path = '') => {
    if (!element)
        return path;
    const { tagName, parentElement } = element;
    if (!tagName)
        return path;
    return pathToParent(parentElement, `${tagName}${path ? '/' : ''}${path}`);
};
document.addEventListener('click', async (event) => {
    const crawledData = {
        url: window.location.href,
        meta: {
            title: document.title,
            description: document
                .querySelector('meta[name="description"]')
                ?.getAttribute('content') || '',
            keywords: document
                .querySelector('meta[name="keywords"]')
                ?.getAttribute('content')
                ?.split(',') || [],
        },
        children: [],
    };
    crawledData.children.push(await crawlElement(event.target, pathToParent(event.target)));
    console.log(crawledData);
}, true);
//# sourceMappingURL=content.js.map