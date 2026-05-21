import { runCommand } from '../src/utils/dependencies.ts';
import { isAbsolute, join } from 'node:path';
import { intro, log, outro } from '@clack/prompts';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { exec } from 'tinyexec';
import { styleText } from 'node:util';

const TEMPLATES_DIR = join(import.meta.dirname, '../files/templates');
const ITEMS_DIR = join(import.meta.dirname, '../files/items');

const TEMPLATE = styleText('cyan', '[TEMPLATE]');
const ITEM = styleText('magenta', '[ITEM]');

const TAZE = (await exec('pnpm', ['which', 'taze'])).stdout.trim();

if (!TAZE || !isAbsolute(TAZE)) {
	log.error('taze not found');
	process.exit(1);
}

const ACTIONS_UP = (await exec('pnpm', ['which', 'actions-up'])).stdout.trim();

if (!ACTIONS_UP || !isAbsolute(ACTIONS_UP)) {
	log.error('actions-up not found');
	process.exit(1);
}

const versionCache = new Map<string, string>();

async function fetchLatestVersion(specifier: string) {
	const hit = versionCache.get(specifier);
	if (hit) return hit;

	const res = await fetch(new URL(specifier, 'https://npm.antfu.dev'));
	const data = await res.json();

	versionCache.set(specifier, data.version);
	return data.version as string;
}

intro('template/item updater');

log.step('updating templates');

for (const template of await readdir(TEMPLATES_DIR, { withFileTypes: true })) {
	if (!template.isDirectory()) {
		continue;
	}

	const dir = join(TEMPLATES_DIR, template.name);
	const actionsPath = join(dir, '.github/workflows');
	const pkgPath = join(dir, 'package.json');

	if (existsSync(pkgPath)) {
		await runCommand({
			successMessage: `${TEMPLATE} Updated Deps for ${template.name}`,
			title: `${TEMPLATE} Updating deps for ${template.name} with taze`,
			command: TAZE,
			args: ['--write', '--include-locked'],
			cwd: dir,
			log: false,
		});

		const pkg = JSON.parse(await readFile(pkgPath, 'utf-8'));
		let pkgChanged = false;

		if ('packageManager' in pkg) {
			const newVersion = await fetchLatestVersion(
				(pkg.packageManager as string).replace('@', '@^'),
			);

			if (newVersion !== pkg.packageManager.split('@')[1]) {
				log.success(
					`updated ${template.name} packageManager ${styleText('gray', pkg.packageManager)} -> ${styleText('green', newVersion)}`,
				);

				pkg.packageManager = newVersion;
				pkgChanged = true;
			}
		}

		if ('volta' in pkg) {
			if ('node' in pkg.volta) {
				// prettier-ignore
				const newVersion = await fetchLatestVersion(`node@^${pkg.volta.node}`);

				if (newVersion !== pkg.volta.node) {
					log.success(
						`updated ${template.name} volta node ${styleText('gray', pkg.volta.node)} -> ${styleText('green', newVersion)}`,
					);

					pkg.volta.node = newVersion;
					pkgChanged = true;
				}
			}

			if ('pnpm' in pkg.volta) {
				// prettier-ignore
				const newVersion = await fetchLatestVersion(`pnpm@^${pkg.volta.pnpm}`);

				if (newVersion !== pkg.volta.pnpm) {
					log.success(
						`updated ${template.name} volta pnpm ${styleText('gray', pkg.volta.pnpm)} -> ${styleText('green', newVersion)}`,
					);

					pkg.volta.pnpm = newVersion;
					pkgChanged = true;
				}
			}
		}

		if (pkgChanged) {
			await writeFile(pkgPath, JSON.stringify(pkg, null, 2));
		}
	}

	if (existsSync(actionsPath)) {
		await runCommand({
			successMessage: `${TEMPLATE} Updated actions for ${template.name}`,
			title: `${TEMPLATE} Updating actions for ${template.name} with actions-up`,
			command: ACTIONS_UP,
			args: ['--yes', '--min-age=3'],
			cwd: dir,
			log: false,
		});
	}
}

log.step('updating items');

await runCommand({
	successMessage: `${ITEM} Updated item actions`,
	title: `${ITEM} Updating item actions with actions-up`,
	command: ACTIONS_UP,
	args: ['--yes', '--min-age=3', '--recursive'],
	cwd: ITEMS_DIR,
	log: false,
});

outro('updated :D');
