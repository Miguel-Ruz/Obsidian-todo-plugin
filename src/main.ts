import { MarkdownPostProcessorContext, Plugin } from 'obsidian';
import { DEFAULT_SETTINGS, InlineStatusBadgesSettings, InlineStatusBadgesSettingTab, type StatusType } from './settings';

const STATUS_CONFIG: Array<{ keyword: string; status: StatusType }> = [
	{ keyword: 'manage_todo_list', status: 'todo' },
	{ keyword: '#todo', status: 'todo' },
	{ keyword: '#doing', status: 'doing' },
	{ keyword: '#done', status: 'done' },
	{ keyword: '#blocked', status: 'blocked' },
];

const KEYWORDS_REGEX = new RegExp(`(${STATUS_CONFIG.map((item) => escapeRegExp(item.keyword)).join('|')})`, 'g');
const STATUS_ORDER: StatusType[] = ['todo', 'doing', 'done', 'blocked'];

export default class InlineStatusBadgesPlugin extends Plugin {
	settings: InlineStatusBadgesSettings;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new InlineStatusBadgesSettingTab(this.app, this));

		this.registerMarkdownPostProcessor((element: HTMLElement, _context: MarkdownPostProcessorContext) => {
			if (!this.settings.enableBadges) {
				return;
			}

			const textNodes = collectTextNodes(element);
			for (const textNode of textNodes) {
				if (!textNode.parentElement || textNode.parentElement.closest('code, pre')) {
					continue;
				}

				this.replaceKeywords(textNode);
			}
		});
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData() as Partial<InlineStatusBadgesSettings>);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	replaceKeywords(textNode: Text) {
		const text = textNode.nodeValue;
		if (!text) {
			return;
		}

		KEYWORDS_REGEX.lastIndex = 0;
		let match: RegExpExecArray | null;
		let lastIndex = 0;
		const fragment = document.createDocumentFragment();

		while ((match = KEYWORDS_REGEX.exec(text)) !== null) {
			const keyword = match[0];
			const before = text.slice(lastIndex, match.index);
			if (before.length) {
				fragment.appendChild(document.createTextNode(before));
			}

			const entry = STATUS_CONFIG.find((item) => item.keyword === keyword);
			if (entry) {
				fragment.appendChild(this.createBadge(entry.status));
			} else {
				fragment.appendChild(document.createTextNode(keyword));
			}

			lastIndex = match.index + keyword.length;
		}

		if (lastIndex === 0) {
			return;
		}

		const remainder = text.slice(lastIndex);
		if (remainder.length) {
			fragment.appendChild(document.createTextNode(remainder));
		}

		textNode.parentNode?.replaceChild(fragment, textNode);
	}

	createBadge(status: StatusType): HTMLElement {
		const badge = document.createElement('span');
		badge.className = `status-badge status-${status}`;
		badge.dataset.status = status;
		badge.textContent = this.settings.labels[status] ?? status.toUpperCase();
		badge.addEventListener('click', () => this.onBadgeClick(badge));
		return badge;
	}

	onBadgeClick(badge: HTMLElement) {
		const current = badge.dataset.status as StatusType | undefined;
		if (!current) {
			return;
		}

		const next = this.getNextStatus(current);
		this.updateBadge(badge, next);
	}

	getNextStatus(current: StatusType): StatusType {
		const index = STATUS_ORDER.indexOf(current);
		if (index < 0) {
			return 'todo';
		}
		return STATUS_ORDER[(index + 1) % STATUS_ORDER.length] ?? 'todo';
	}

	updateBadge(badge: HTMLElement, status: StatusType) {
		badge.className = `status-badge status-${status}`;
		badge.dataset.status = status;
		badge.textContent = this.settings.labels[status] ?? status.toUpperCase();
	}
}

function collectTextNodes(element: HTMLElement): Text[] {
	const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, null);
	const textNodes: Text[] = [];
	let currentNode = walker.nextNode();

	while (currentNode) {
		textNodes.push(currentNode as Text);
		currentNode = walker.nextNode();
	}

	return textNodes;
}

function escapeRegExp(value: string): string {
	return value.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&');
}
