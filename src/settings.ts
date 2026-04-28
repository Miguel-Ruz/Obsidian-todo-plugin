import { App, PluginSettingTab, Setting } from 'obsidian';
import type InlineStatusBadgesPlugin from './main';

export type StatusType = 'todo' | 'doing' | 'done' | 'blocked';

export interface InlineStatusBadgesSettings {
	enableBadges: boolean;
	labels: Record<StatusType, string>;
	customKeywords: Array<{ keyword: string; status: StatusType }>;
}

export const DEFAULT_SETTINGS: InlineStatusBadgesSettings = {
	enableBadges: true,
	labels: {
		todo: 'TODO',
		doing: 'DOING',
		done: 'DONE',
		blocked: 'BLOCKED',
	},
	customKeywords: [],
};

export class InlineStatusBadgesSettingTab extends PluginSettingTab {
	plugin: InlineStatusBadgesPlugin;

	constructor(app: App, plugin: InlineStatusBadgesPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h2', { text: 'Inline Status Badges' });

		new Setting(containerEl)
			.setName('Enable badges')
			.setDesc('Enable or disable inline status badges in rendered markdown.')
			.addToggle((toggle) =>
				toggle.setValue(this.plugin.settings.enableBadges).onChange(async (value) => {
					this.plugin.settings.enableBadges = value;
					await this.plugin.saveSettings();
				}))
		;

		new Setting(containerEl)
			.setName('TODO label')
			.setDesc('Text used for #todo and manage_todo_list badges.')
			.addText((text) =>
				text.setValue(this.plugin.settings.labels.todo).onChange(async (value) => {
					this.plugin.settings.labels.todo = value || 'TODO';
					await this.plugin.saveSettings();
				}))
		;

		new Setting(containerEl)
			.setName('DOING label')
			.setDesc('Text used for #doing badges.')
			.addText((text) =>
				text.setValue(this.plugin.settings.labels.doing).onChange(async (value) => {
					this.plugin.settings.labels.doing = value || 'DOING';
					await this.plugin.saveSettings();
				}))
		;

		new Setting(containerEl)
			.setName('DONE label')
			.setDesc('Text used for #done badges.')
			.addText((text) =>
				text.setValue(this.plugin.settings.labels.done).onChange(async (value) => {
					this.plugin.settings.labels.done = value || 'DONE';
					await this.plugin.saveSettings();
				}))
		;

		new Setting(containerEl)
			.setName('BLOCKED label')
			.setDesc('Text used for #blocked badges.')
			.addText((text) =>
				text.setValue(this.plugin.settings.labels.blocked).onChange(async (value) => {
					this.plugin.settings.labels.blocked = value || 'BLOCKED';
					await this.plugin.saveSettings();
				}))
		;

		// Custom keywords section
		containerEl.createEl('h3', { text: 'Palabras clave personalizadas' });
		containerEl.createEl('p', {
			text: 'Agrega palabras clave adicionales que serán detectadas como badges.',
		});

		// Display existing custom keywords
		this.plugin.settings.customKeywords.forEach((item, index) => {
			const container = containerEl.createDiv('custom-keyword-row');
			container.style.display = 'flex';
			container.style.gap = '8px';
			container.style.marginBottom = '8px';

			new Setting(container)
				.addText((text) =>
					text
						.setPlaceholder('Palabra clave (ej: #custom)')
						.setValue(item.keyword)
						.onChange(async (value) => {
							const keyword = this.plugin.settings.customKeywords[index];
							if (keyword) {
								keyword.keyword = value;
								await this.plugin.saveSettings();
							}
						})
				)
				.setClass('custom-keyword-input');

			new Setting(container)
				.addDropdown((dropdown) =>
					dropdown
						.addOption('todo', 'TODO')
						.addOption('doing', 'DOING')
						.addOption('done', 'DONE')
						.addOption('blocked', 'BLOCKED')
						.setValue(item.status)
						.onChange(async (value: string) => {
							const keyword = this.plugin.settings.customKeywords[index];
							if (keyword) {
								keyword.status = value as StatusType;
								await this.plugin.saveSettings();
							}
						})
				)
				.setClass('custom-keyword-dropdown');

			new Setting(container)
				.addButton((button) =>
					button
						.setButtonText('Eliminar')
						.setWarning()
						.onClick(async () => {
							this.plugin.settings.customKeywords.splice(index, 1);
							await this.plugin.saveSettings();
							this.display();
						})
				)
				.setClass('custom-keyword-remove');
		});

		// Add new custom keyword
		new Setting(containerEl)
			.addButton((button) =>
				button
					.setButtonText('+ Agregar palabra clave')
					.setCta()
					.onClick(async () => {
						this.plugin.settings.customKeywords.push({
							keyword: '',
							status: 'todo',
						});
						await this.plugin.saveSettings();
						this.display();
					})
			)
		;
	}
}
