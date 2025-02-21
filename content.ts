console.log('Content script injected!');

import type { CrawledData, Children, Styles, Attributes } from './constants';
import { defaultStyles } from './constants';

const getStyles = (element: HTMLElement): Styles => {
	const styles: Styles = {};
	const computedStyles = window.getComputedStyle(element);
	for (const [property, value] of Object.entries(computedStyles)) {
		if (!value || value === 'auto') continue;
		if (!isNaN(parseInt(property))) continue;
		const match = property.match(/^webkit.*/);
		if (match) continue;
		if (property in defaultStyles)
			if (defaultStyles[property] === value) continue;
		styles[property] = value;
	}
	return styles;
};

const getAttributes = (element: HTMLElement): Attributes => {
	const attributes: Attributes = {};
	for (const attribute of element.getAttributeNames()) {
		attributes[attribute] = element.getAttribute(attribute);
	}
	return attributes;
};

const generateHash = async (message: string): Promise<string> => {
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
	'PATH',
	'G',
]);

const crawlElement = async (
	element: HTMLElement = document.querySelector('body')!,
	traversal: string = '',
	parent: Children | null = null,
	siblingOrder = 0
): Promise<Children> => {
	const { tagName: tag } = element;
	const path = `${traversal}${tag}[${siblingOrder}]`;
	const elementData: Children = {
		parent,
		elementRef: element,
		path,
		uuid: await generateHash(path),
		tag,
		attributes: getAttributes(element),
		image: '',
		innerTextHash: element?.innerText
			? await generateHash(element.innerText)
			: '',
		getBoundingClientRect: element.getBoundingClientRect(),
		isVisible: (element as any).checkVisibility(),
		children: [],
	};

	const children = element.children;
	for (let idx = 0; idx < children.length; idx++) {
		if (DISABLED_ELEMENTS.has(children[idx].tagName.toUpperCase())) continue;
		elementData.children.push(
			await crawlElement(
				children[idx] as HTMLElement,
				`${elementData.path}/`,
				elementData,
				idx
			)
		);
	}
	return elementData;
};

const pathToParent = (element: HTMLElement | null, path = ''): string => {
	if (!element || !element.tagName) return `${path}/`;

	const { tagName, parentElement } = element;
	return pathToParent(parentElement, `${tagName}${path ? '/' : ''}${path}`);
};

const generatedCrawledData = async (
	event: MouseEvent
): Promise<CrawledData> => {
	const crawledData: CrawledData = {
		url: window.location.href,
		meta: {
			title: document.title,
			description:
				document
					.querySelector('meta[name="description"]')
					?.getAttribute('content') || '',
			keywords:
				document
					.querySelector('meta[name="keywords"]')
					?.getAttribute('content')
					?.split(',') || [],
		},
		children: [],
	};
	crawledData.children.push(
		await crawlElement(
			event.target as HTMLElement,
			pathToParent(event.target as HTMLElement)
		)
	);
	return crawledData;
};

const isChildGroupableWithParent = async (
	parent: Children,
	childIdx: number
): Promise<boolean> => {
	console.log(parent, childIdx);
	return true;
};

const bottomUpGrouping = async (
	node: Children | null,
	unionData: Map<string, string>
) => {
	console.log('NODE', node);
	if (!node) return;
	let allChildrenGroupable = true;
	for (let childIdx = 0; childIdx < node.children.length; childIdx++) {
		if (await isChildGroupableWithParent(node, childIdx)) {
			console.log('Grouping', { node, childIdx });
			continue;
		}
		allChildrenGroupable = false;
	}
	if (!allChildrenGroupable) {
		console.log('Not all children groupable', node);
		return;
	}
	for (let childIdx = 0; childIdx < node.children.length; childIdx++) {
		unionData.set(node.children[childIdx].uuid, node.uuid);
	}
	await bottomUpGrouping(node.parent, unionData);
};

document.addEventListener(
	'click',
	async (event: MouseEvent) => {
		const crawledData = await generatedCrawledData(event);
		console.log(crawledData);
		// 													  node, group
		const unionData = new Map<string, string>();
		await bottomUpGrouping(crawledData.children[0], unionData);
		console.log(unionData);
	},
	true
);
