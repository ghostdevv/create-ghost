import { confirm, log, multiselect, taskLog } from '@clack/prompts';
import { handleCancel } from './prompts';
import { existsSync } from 'node:fs';
import { exec } from 'tinyexec';
import { join } from 'node:path';

export interface Dependency {
	specifier: string;
	dev?: boolean;
}

type PackageManager = 'deno' | 'pnpm';

const pmCache = new Map<string, PackageManager>();
function getPackageManager(cwd: string): PackageManager {
	const hit = pmCache.get(cwd);
	if (hit) return hit;

	if (
		existsSync(join(cwd, './deno.json')) ||
		existsSync(join(cwd, './deno.jsonc'))
	) {
		pmCache.set(cwd, 'deno');
		return 'deno';
	}

	pmCache.set(cwd, 'pnpm');
	return 'pnpm';
}

interface CommandOptions {
	successMessage: string;
	command: string;
	args: string[];
	title: string;
	cwd: string;
}

// Based on MIT Licensed code from Svelte CLI Contributors
// https://github.com/sveltejs/cli/blob/9cbf5199c30618d53573c3de8fe08f031f60a125/LICENSE
// https://github.com/sveltejs/cli/blob/9cbf5199c30618d53573c3de8fe08f031f60a125/packages/sv/src/core/package-manager.ts#L52-L79
async function runCommand(options: CommandOptions) {
	log.info(`${options.command} ${options.args.join(' ')}`);

	const task = taskLog({
		limit: Math.ceil(process.stdout.rows / 2),
		title: options.title,
		retainLog: true,
		spacing: 0,
	});

	try {
		const proc = exec(options.command, options.args, {
			nodeOptions: { cwd: options.cwd, stdio: 'pipe' },
			throwOnError: true,
		});

		for await (const line of proc) {
			task.message(line);
		}

		task.success(options.successMessage);
	} catch {
		task.error('Failed');
		process.exit(1);
	}
}

async function install(cwd: string) {
	const pm = getPackageManager(cwd);

	await runCommand({
		cwd,
		command: pm,
		args: ['install', ...(pm === 'pnpm' ? ['--prefer-offline'] : [])],
		title: `Installing dependencies with ${pm}`,
		successMessage: 'Installed Successfully!',
	});
}

async function add(cwd: string, dev: boolean, deps: string[]) {
	const pm = getPackageManager(cwd);

	await runCommand({
		cwd,
		command: pm,
		args: [
			'add',
			...(dev ? ['-D'] : []),
			...(pm === 'deno' ? deps.map((d) => `npm:${d}`) : deps),
		],
		title: `Adding${dev ? ' dev' : ''} ${deps.join(', ')}`,
		successMessage: 'Added Successfully!',
	});
}

export async function installDependencies(cwd: string) {
	const confirmation = await confirm({
		message: 'Would you like to install dependencies?',
	});

	handleCancel(confirmation);

	if (!confirmation) {
		return;
	}

	await install(cwd);
}

/**
 * Adds and installs the list of dependencies with pnpm.
 *
 * @param cwd - directory to install deps in
 * @param deps - the list of deps to install
 * @param askIndividually - whether to ask the user if they want to install for each dependency individually
 */
export async function addDependencies(
	cwd: string,
	deps: Dependency[],
	askIndividually = false,
) {
	if (askIndividually) {
		const selectedDeps = await multiselect({
			message: 'Select dependencies to install',
			required: false,
			options: deps.map((dep) => ({
				label: dep.dev ? `${dep.specifier} (dev)` : dep.specifier,
				value: dep,
			})),
		});

		handleCancel(selectedDeps);

		if (selectedDeps.length === 0) {
			return;
		}

		// biome-ignore lint/style/noParameterAssign: easiest
		deps = selectedDeps;
	} else {
		const confirmation = await confirm({
			message: 'Would you like to install dependencies?',
		});

		handleCancel(confirmation);

		if (!confirmation) {
			return;
		}
	}

	if (deps.length === 0) {
		return;
	}

	const prod: string[] = [];
	const dev: string[] = [];

	for (const dep of deps) {
		if (dep.dev) {
			dev.push(dep.specifier);
		} else {
			prod.push(dep.specifier);
		}
	}

	if (prod.length > 0) {
		await add(cwd, false, prod);
	}

	if (dev.length > 0) {
		await add(cwd, true, dev);
	}
}
