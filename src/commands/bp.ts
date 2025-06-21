import { existsSync, readdirSync, mkdirSync, copyFileSync } from 'node:fs';
import { checkForce, handleCancel } from '../utils/prompts.js';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { multiselect, log } from '@clack/prompts';
import { copy } from '../utils/copy.js';
import type { Handler } from 'sade';
import { green } from 'picocolors';
import exec from 'nanoexec';

async function load() {
	const itemsPath = join(import.meta.env.FILES_DIR, './items');
	const dirs = readdirSync(itemsPath);

	const items = new Map();
	const options = [];

	for (const dir of dirs) {
		const itemPath = join(itemsPath, dir);
		const metaPath = join(itemPath, 'meta.js');

		const { default: meta } = await import(metaPath);

		items.set(itemPath, { ...meta, path: itemPath });
		options.push({ label: meta.name, value: itemPath });
	}

	return { items, options };
}

export const run: Handler = async ({ force }) => {
	const { items, options } = await load();

	const directories = await multiselect({
		message: 'Select an bp item',
		options,
	});

	handleCancel(directories);

	for (const dir of directories) {
		const item = items.get(dir);

		if (item.file) {
			const file = join(item.path, item.file);
			const out = resolve(item.out);

			if (existsSync(out) && !force) await checkForce(item.out);

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

	log.success(green('Done'));
};
