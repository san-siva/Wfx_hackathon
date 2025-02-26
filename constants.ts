import html2canvas from 'html2canvas';

export interface GroupingResult {
	name: string;
	grouping: Map<any, any>;
	highlight: boolean;
}

export interface Children {
	parent: Children | null;
	elementRef: HTMLElement;
	tag: string;
	path: string[];
	uuid: string;
	image: string;
	innerTextHash: string;
	getBoundingClientRect: DOMRect;
	isVisible: boolean;
	children: Children[];
}

export interface CrawledData {
	url: string;
	meta: {
		title: string;
		description: string;
		keywords: string[];
	};
	children: Children[];
}

export const DISABLED_ELEMENTS = new Set([
	'SCRIPT',
	'NOSCRIPT',
	'STYLE',
	'LINK',
	'META',
	'HEAD',
	'SVG',
]);

export const CLICKABLE_ELEMENTS = new Set([
	'A',
	'BUTTON',
	'INPUT',
	'SELECT',
	'TEXTAREA',
]);

export type ChildToParentMap = Map<string, string>;

export const generateHash = async (message: string): Promise<string> => {
	const encoder = new TextEncoder();
	const data = encoder.encode(message);
	const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
	const hashArray = Array.from(new Uint8Array(hashBuffer));
	return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
};

export const highlight = (
	parent: string,
	child: string,
	isAiMode: boolean = false
) => {
	const childElement = document.querySelector(
		`[data-uuid="${child}"]`
	) as HTMLElement;
	const parentElement = document.querySelector(
		`[data-uuid="${parent}"]`
	) as HTMLElement;
	if (!childElement || !parentElement) return;

	parentElement.style.border = `2px solid ${isAiMode ? 'red' : 'purple'}`;
	childElement.style.border = `1px solid ${isAiMode ? 'orange' : 'blue'}`;
};

export const highlightGroupedElements = (
	unionData: ChildToParentMap,
	isAiMode = false
) => {
	unionData.forEach((parent, child) => highlight(parent, child, isAiMode));
};

export const pathToParent = (
	element: HTMLElement | null,
	path: string[] = []
): string[] => {
	if (!element || !element.tagName) return path.reverse();
	path.push(element.tagName);
	return pathToParent(element.parentElement, path);
};

export const compareBoundingClientRects = (
	rect1: DOMRect,
	rect2: DOMRect,
	threshold = 10
): boolean => {
	const diff = (a: number, b: number) => Math.abs(a - b);
	return ['x', 'y', 'width', 'height'].every(
		(prop: string) => diff(rect1[prop], rect2[prop]) < threshold
	);
};

export const compareInnerText = (parent: HTMLElement, child: HTMLElement) =>
	parent.innerText === child.innerText;

export const isAncestorClickable = (path: string[]): boolean =>
	path.some(element => CLICKABLE_ELEMENTS.has(element.toUpperCase()));

// Screenshot Functions
export const downloadScreenshot = async (url: string) => {
	const downloadLink = document.createElement('a');
	downloadLink.href = url;
	downloadLink.download = 'screenshot.png';
	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
};

export const screenshot = async (
	element: HTMLElement,
	parent: Children,
	child: Children
) => {
	const parentOldBorder = parent.elementRef.style.border;
	const childOldBorder = child.elementRef.style.border;
	parent.elementRef.style.border = '2px solid red';
	child.elementRef.style.border = '2px solid red';
	const screenshot = await html2canvas(element);
	parent.elementRef.style.border = parentOldBorder;
	child.elementRef.style.border = childOldBorder;
	const screenshotDataUrl = screenshot.toDataURL('image/base64');
	parent.image = screenshotDataUrl;
	return screenshotDataUrl;
};
