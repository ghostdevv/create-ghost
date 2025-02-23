import { existsSync, readdirSync, mkdirSync, copyFileSync } from 'node:fs';
import { onCancel, checkForce } from '../../utils/prompts.js';
import { readFile, writeFile } from 'node:fs/promises';
import { logSymbols } from '../../utils/symbols.js';
import { dirname, join, resolve } from 'node:path';
import { copy } from '../../utils/copy.js';
import prompts from 'prompts';
import pc from 'picocolors';
import exec from 'nanoexec';

async function load() {
	const itemsPath = join(import.meta.dirname, './items');
	const dirs = readdirSync(itemsPath);

	const items = new Map();
	const choices = [];

	for (const dir of dirs) {
		const itemPath = join(itemsPath, dir);
		const metaPath = join(itemPath, 'meta.js');

		const { default: meta } = await import(metaPath);

		items.set(itemPath, { ...meta, path: itemPath });
		choices.push({ title: meta.name, value: itemPath });
	}

	return { items, choices };
}

/** @type {import('sade').Handler} */
export const run = async ({ force }) => {
	const { items, choices } = await load();

	const { directories } = await prompts(
		{
			type: 'multiselect',
			message: 'Select an bp item',
			name: 'directories',
			choices,
		},
		{ onCancel },
	);

	for (const dir of directories) {
		console.log();

		const item = items.get(dir);

		if (item.file) {
			const file = join(item.path, item.file);
			const out = resolve(item.out);

			if (existsSync(out) && !force) await checkForce(item.file);

			mkdirSync(dirname(out), { recursive: true });
			copyFileSync(file, out);

			// todo add proper hooks
			if (item.file == 'LICENSE') {
				const gitResult = await exec(
					'git',
					['log', '--reverse', '--format=%cd', '--date=format:%Y'],
					{ shell: true },
				);

				const maybeYear = Number.parseInt(
					gitResult.stdout.toString().trim().split('\n')[0],
				);

				const year = Number.isNaN(maybeYear)
					? new Date().getFullYear()
					: maybeYear;

				let contents = await readFile(out, 'utf-8');
				contents = contents.replace(/{YEAR}/g, `${year}`);
				await writeFile(out, contents, 'utf-8');
			}
		} else {
			const dir = join(item.path, item.dir);
			const out = resolve(item.out);

			const exists = existsSync(out);

			if (exists && !force) await checkForce(item.out, true);

			await copy(dir, out);
		}
	}

	console.log();
	console.log(`${logSymbols.success} ${pc.green('Done')}`);
};
