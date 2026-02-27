export default {
	name: 'Oxlint Config',
	file: 'config.json',
	out: '.oxlintrc.json',
	dependencies: [
		{ specifier: 'oxlint', dev: true },
		{ specifier: 'oxlint-tsgolint', dev: true },
		{ specifier: '@rlly/pedantic', dev: true },
		{ specifier: '@e18e/eslint-plugin', dev: true },
	],
};
