import type {
	CrawledData,
	Children,
	ChildToParentMap,
	GroupingResult,
} from './constants';
import {
	DISABLED_ELEMENTS,
	generateHash,
	highlight,
	highlightGroupedElements,
	pathToParent,
	compareInnerText,
	compareBoundingClientRects,
	isAncestorClickable,
	screenshot,
} from './constants';

console.log('Content script injected!');

const ancestorGrouping: ChildToParentMap = new Map();
const clientBoundingRectGrouping: ChildToParentMap = new Map();
const innerTextGrouping: ChildToParentMap = new Map();
const aiGrouping: ChildToParentMap = new Map();

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

// Grouping Functions
const tryGrouping = async (
	parent: Children,
	child: Children
): Promise<void> => {
	if (!parent || !child) return;

	if (isAncestorClickable(child.path)) {
		ancestorGrouping.set(child.uuid, parent.uuid);
		return;
	}

	if (
		compareBoundingClientRects(
			parent.getBoundingClientRect,
			child.getBoundingClientRect
		)
	) {
		clientBoundingRectGrouping.set(child.uuid, parent.uuid);
		return;
	}

	if (compareInnerText(parent.elementRef, child.elementRef)) {
		innerTextGrouping.set(child.uuid, parent.uuid);
		return;
	}

	const response = await fetch('http://127.0.0.1:5000/group', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			img: await screenshot(parent.elementRef, parent, child),
		}),
	}).then(res => res.json());

	if (`${response?.received_data}`.toLowerCase() === 'true') {
		aiGrouping.set(child.uuid, parent.uuid);
		console.log('AI Grouping', child.elementRef, parent.elementRef);
		return;
	}

	return;
};

const groupingResults: GroupingResult[] = [
	{ name: 'Ancestor', grouping: ancestorGrouping, highlight: false },
	{
		name: 'ClientBoundingRect',
		grouping: clientBoundingRectGrouping,
		highlight: false,
	},
	{ name: 'InnerText', grouping: innerTextGrouping, highlight: false },
	{ name: 'AI', grouping: aiGrouping, highlight: false },
];

const calculatePercentage = (count: number, total: number): string =>
	((count / total) * 100).toFixed(2);

const logGroupingResults = (results: GroupingResult[], totalNodes: number) => {
	const totalGrouped = results.reduce(
		(sum, result) => sum + result.grouping.size,
		0
	);
	const unableToGroup = totalNodes - totalGrouped;

	results.forEach(result => {
		console.log(
			`Grouped by ${result.name}: ${calculatePercentage(result.grouping.size, totalNodes)}%`
		);
	});

	console.log(
		`Unable to group: ${calculatePercentage(unableToGroup, totalNodes)}%`
	);
};

const bottomUpGrouping = async (node: Children | null): Promise<boolean> => {
	if (!node) return true;
	for (const child of node.children) {
		await bottomUpGrouping(child);
	}
	if (!node.parent) return true;
	tryGrouping(node.parent, node);
	return true;
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
		const done = await bottomUpGrouping(crawledData.children[0]);
		if (done) {
			groupingResults.forEach(result => {
				highlightGroupedElements(result.grouping, result.highlight);
			});
			logGroupingResults(groupingResults, totalNoOfNodes);
			return;
		}
	},
	true
);
