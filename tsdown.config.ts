import { defineConfig } from 'tsdown';
import { cp } from 'node:fs/promises';
import { join } from 'node:path';

export default defineConfig({
	entry: 'src/bin.ts',
	hooks: {
		'build:done': async () => {
			const SOURCE_DIR = join(import.meta.dirname, './src');
			const BUILD_DIR = join(import.meta.dirname, './dist');

			await cp(
				join(SOURCE_DIR, './commands/boilerplate/items'),
				join(BUILD_DIR, './items'),
				{ recursive: true },
			);

			await cp(
				join(SOURCE_DIR, './commands/create/templates'),
				join(BUILD_DIR, './templates'),
				{ recursive: true },
			);
		},
	},
});
