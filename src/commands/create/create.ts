import { existsSync, statSync, rmSync, readdirSync } from 'node:fs';
import { checkForce, onCancel } from '../../utils/prompts.js';
import { logSymbols } from '../../utils/symbols.js';
import { select, text, group } from '@clack/prompts';
import { copy } from '../../utils/copy.js';
import { join, resolve } from 'node:path';
import type { Handler } from 'sade';
import pc from 'picocolors';

async function loadTemplates() {
	const path = join(import.meta.dirname, './templates');
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

	console.log(
		`${logSymbols.success} Created a folder called ${pc.gray(out)}`,
	);
};
