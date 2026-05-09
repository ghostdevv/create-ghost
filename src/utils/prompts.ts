import { confirm, isCancel, outro } from '@clack/prompts';
import { styleText } from 'node:util';

export function handleCancel<T>(
	result: T,
): asserts result is Exclude<T, symbol> {
	if (isCancel(result)) {
		onCancel();
	}
}

export function onCancel() {
	// prettier-ignore
	outro(`${styleText(['bold', 'red'], 'Exited')} ${styleText(['blue', 'dim'], 'create-ghost')}`);
	process.exit(0);
}

export async function checkForce(file: string, dir = false) {
	// prettier-ignore
	const message = `Is it ok to ${styleText('red', 'OVERWRITE')} ${dir ? 'some files in ' : ''}${file}`;
	const value = await confirm({ message });
	handleCancel(value);
}
