import { confirm, isCancel } from '@clack/prompts';
import { bold, red, blue, dim } from 'picocolors';

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
	console.log(`  ${bold(red('Exited'))} ${blue(dim('create-ghost'))}`);
	process.exit(0);
}

export async function checkForce(file: string, dir = false) {
	// prettier-ignore
	const message = `Is it ok to ${red('OVERWRITE')} ${dir ? 'some files in ' : ''}${file}`;

	const value = await confirm({
		message,
	});

	handleCancel(value);
}
