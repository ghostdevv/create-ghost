import { cp, rename, readdir } from 'node:fs/promises';
import { join } from 'node:path';

/**
 * Copy a directory to a new location.
 * Files that bein with _ will have it replaced with a period.
 */
export async function copy(from: string, to: string) {
	await cp(from, to, { recursive: true });

	const files = await readdir(to, {
		withFileTypes: true,
		recursive: true,
	});

	for (const file of files) {
		if (file.name.startsWith('_')) {
			await rename(
				join(file.parentPath, file.name),
				join(file.parentPath, `.${file.name.slice(1)}`),
			);
		}
	}
}
