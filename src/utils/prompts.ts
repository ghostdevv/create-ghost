import { confirm, isCancel } from '@clack/prompts';
import pc from 'picocolors';

export function handleCancel<T>(
	result: T,
): asserts result is Exclude<T, symbol> {
	if (isCancel(result)) {
		onCancel();
	}
}

export function onCancel() {
	console.log();
	// prettier-ignore
	console.log(`  ${pc.bold(pc.red('Exited'))} ${pc.blue(pc.dim('create-ghost'))}`);
	process.exit(0);
}

export async function checkForce(file: string, dir = false) {
	// prettier-ignore
	const message = `Is it ok to ${pc.red('OVERWRITE')} ${dir ? 'some files in ' : ''}${file}`;

	const value = await confirm({
		message,
	});

	handleCancel(value);
}
