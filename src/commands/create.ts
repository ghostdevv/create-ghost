import { existsSync, statSync, rmSync, readdirSync } from 'node:fs';
import { checkForce, onCancel } from '../utils/prompts.js';
import { select, text, group, log } from '@clack/prompts';
import { join, resolve } from 'node:path';
import { copy } from '../utils/copy.js';
import type { Handler } from 'sade';
import { gray } from 'picocolors';

async function loadTemplates() {
	const path = join(import.meta.env.FILES_DIR, './templates');
	const dirs = readdirSync(path);

	return dirs.map((name) => ({
		path: join(path, name),
		name: name
			.split('-')
			.map((x) => x[0].toUpperCase() + x.slice(1))
			.join(' '),
	}));
}

export const run: Handler = async ({ force }) => {
	const templates = await loadTemplates();

	const { template, out } = await group(
		{
			template: () =>
				select({
					message: 'Select a template',
					options: templates.map((t) => ({
						label: t.name,
						value: t.path,
					})),
				}),
			out: () =>
				text({
					message: 'What folder should we put the template in?',
				}),
		},
		{ onCancel },
	);

	const outPath = resolve(out);

	if (existsSync(outPath) && !force) {
		await checkForce(outPath);

		const stat = statSync(outPath);

		if (!stat.isDirectory()) {
			rmSync(outPath);
		}
	}

	await copy(template, outPath);

	log.success(`Created a folder called ${gray(out)}`);
};
