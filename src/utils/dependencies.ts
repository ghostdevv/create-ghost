import { confirm, multiselect, taskLog } from '@clack/prompts';
import { handleCancel } from './prompts';
import { exec } from 'tinyexec';

export interface Dependency {
	specifier: string;
	dev?: boolean;
}

// Based on MIT Licensed code from Svelte CLI Contributors
// https://github.com/sveltejs/cli/blob/9cbf5199c30618d53573c3de8fe08f031f60a125/LICENSE
// https://github.com/sveltejs/cli/blob/9cbf5199c30618d53573c3de8fe08f031f60a125/packages/sv/src/core/package-manager.ts#L52-L79
async function install(cwd: string, dev: boolean, deps: string[]) {
	const task = taskLog({
		title: `Installing ${deps.join(', ')}`,
		limit: Math.ceil(process.stdout.rows / 2),
		retainLog: true,
		spacing: 0,
	});

	const args = ['add', ...deps];
	if (dev) args.splice(1, 0, '-D');

	try {
		const proc = exec('pnpm', args, {
			nodeOptions: { cwd, stdio: 'pipe' },
			throwOnError: true,
		});

		for await (const line of proc) {
			task.message(line);
		}

		task.success('Installed');
	} catch {
		task.error('Failed');
		process.exit(1);
	}
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
		await install(cwd, false, prod);
	}

	if (dev.length > 0) {
		await install(cwd, true, dev);
	}
}
