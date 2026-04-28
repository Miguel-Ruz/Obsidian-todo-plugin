import { App, PluginSettingTab, Setting } from 'obsidian';
import type InlineStatusBadgesPlugin from './main';

export type StatusType = 'todo' | 'doing' | 'done' | 'blocked';

export interface InlineStatusBadgesSettings {
	enableBadges: boolean;
	labels: Record<StatusType, string>;
}

export const DEFAULT_SETTINGS: InlineStatusBadgesSettings = {
	enableBadges: true,
	labels: {
		todo: 'TODO',
		doing: 'DOING',
		done: 'DONE',
		blocked: 'BLOCKED',
	},
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
	}
}
