import type { CrawledData, Children, ChildToParentMap } from './constants';
import {
	DISABLED_ELEMENTS,
	generateHash,
	highlightGroupedElements,
	pathToParent,
	Mode,
	bottomUpGrouping,
	logGroupingResults,
} from './constants';

console.log('Content script injected!');

const crawlElement = async (
	element: HTMLElement = document.body,
	path: string[] = [],
	parent: Children | null = null,
	siblingOrder = 0
): Promise<Children> => {
	totalNoOfNodes += 1;

	const { tagName: tag } = element;
	const boundingRect = element.getBoundingClientRect();
	path.push(`${tag}[${siblingOrder}]`);
	const pathHash = await generateHash(path.join(''));
	element.setAttribute('data-uuid', pathHash);

	const elementData: Children = {
		parent,
		elementRef: element,
		path,
		uuid: pathHash,
		tag,
		image: '',
		innerTextHash: element.innerText
			? await generateHash(element.innerText)
			: '',
		getBoundingClientRect: boundingRect,
		isVisible: (element as any).checkVisibility(),
		children: [],
	};

	for (let idx = 0; idx < element.children.length; idx++) {
		const child = element.children[idx];
		if (DISABLED_ELEMENTS.has(child.tagName.toUpperCase())) continue;
		elementData.children.push(
			await crawlElement(
				child as HTMLElement,
				[...elementData.path],
				elementData,
				idx
			)
		);
	}

	return elementData;
};

let totalNoOfNodes = 0;

const generateCrawledData = async (): Promise<CrawledData> => {
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
		await crawlElement(document.body, pathToParent(document.body), null, 0)
	);

	return crawledData;
};

declare global {
	interface Window {
		analyseDom: () => Promise<void>;
	}
}

window.addEventListener(
	'click',
	async () => {
		console.log('Analyzing DOM...');
		const crawledData = await generateCrawledData();
		console.log('Total Nodes:', totalNoOfNodes);
		console.log('Starting Grouping...');

		const ancestorGrouping: ChildToParentMap = new Map();
		const clientBoundingRectGrouping: ChildToParentMap = new Map();
		const innerTextGrouping: ChildToParentMap = new Map();
		const aiGrouping: ChildToParentMap = new Map();

		bottomUpGrouping(
			crawledData.children[0],
			Mode.ANCESTOR,
			ancestorGrouping
		);
		bottomUpGrouping(
			crawledData.children[0],
			Mode.CLIENT_BOUNDING_RECT,
			clientBoundingRectGrouping
		);
		bottomUpGrouping(
			crawledData.children[0],
			Mode.INNER_TEXT,
			innerTextGrouping
		);
		await bottomUpGrouping(crawledData.children[0], Mode.AI, aiGrouping);
		logGroupingResults(
			ancestorGrouping,
			clientBoundingRectGrouping,
			innerTextGrouping,
			aiGrouping,
			totalNoOfNodes
		);
		highlightGroupedElements(ancestorGrouping);
		highlightGroupedElements(clientBoundingRectGrouping);
		highlightGroupedElements(innerTextGrouping);
		highlightGroupedElements(aiGrouping, true);
	},
	true
);
