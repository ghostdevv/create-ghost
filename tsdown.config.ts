import { defineConfig } from 'tsdown';
import { cp } from 'node:fs/promises';
import { join } from 'node:path';

export default defineConfig({
	entry: 'src/bin.ts',
	hooks: {
		'build:done': async () => {
			await cp(
				join(import.meta.dirname, './files'),
				join(import.meta.dirname, './dist/files'),
				{ recursive: true },
			);
		},
	},
});
