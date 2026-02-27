export default {
	name: 'Prettier Config Svelte',
	file: 'prettier.json',
	out: '.prettierrc',
	dependencies: [
		{ specifier: 'prettier', dev: true },
		{ specifier: 'prettier-plugin-svelte', dev: true },
	],
};
