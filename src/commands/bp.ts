import { existsSync, readdirSync, mkdirSync, copyFileSync } from 'node:fs';
import { addDependencies, type Dependency } from '../utils/dependencies';
import { checkForce, handleCancel } from '../utils/prompts.js';
import { readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { multiselect, log } from '@clack/prompts';
import { FILES_DIR } from '../utils/vars.js';
import { pathToFileURL } from 'node:url';
import { copy } from '../utils/copy.js';
import type { Handler } from 'sade';
import { exec } from 'tinyexec';
import pc from 'picocolors';

interface BpItemMeta {
	name: string;
	file?: string;
	dir?: string;
	out: string;
	dependencies?: Dependency[];
}

async function load() {
	const itemsPath = join(FILES_DIR, './items');
	const dirs = readdirSync(itemsPath);

	const items = new Map<string, BpItemMeta & { path: string }>();
	const options = [];

	for (const dir of dirs) {
		const itemPath = join(itemsPath, dir);
		const metaPath = join(itemPath, 'meta.js');

		const { default: meta } = await import(
			pathToFileURL(metaPath).toString()
		);

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
		if (!item) continue;

		if (item.file) {
			const file = join(item.path, item.file);
			const out = resolve(item.out);

			if (existsSync(out) && !force) await checkForce(item.out);

			mkdirSync(dirname(out), { recursive: true });
			copyFileSync(file, out);

			// todo add proper hooks
			if (item.file == 'LICENSE') {
				const gitResult = await exec('git', [
					'log',
					'--reverse',
					'--format=%cd',
					'--date=format:%Y',
				]);

				const maybeYear = Number.parseInt(
					gitResult.stdout.toString().trim().split('\n')[0],
					10,
				);

				const year = Number.isNaN(maybeYear)
					? new Date().getFullYear()
					: maybeYear;

				let contents = await readFile(out, 'utf-8');
				contents = contents.replace(/{YEAR}/g, `${year}`);
				await writeFile(out, contents, 'utf-8');
			}
		} else {
			const dir = join(item.path, item.dir!);
			const out = resolve(item.out);

			const exists = existsSync(out);

			if (exists && !force) await checkForce(item.out, true);

			await copy(dir, out);
		}
	}

	const deps = new Map<string, Dependency>();

	for (const dir of directories) {
		const item = items.get(dir);
		if (!item?.dependencies) continue;
		for (const dep of item.dependencies) {
			deps.set(dep.specifier, dep);
		}
	}

	if (deps.size > 0) {
		await addDependencies(process.cwd(), Array.from(deps.values()), true);
	}

	log.success(pc.green('Done'));
};
