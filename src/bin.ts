#!/usr/bin/env node
import { version } from '../package.json' with { type: 'json' };
import { dim, green, bold, blue, reset } from 'picocolors';
import { checkForUpdate } from './utils/version.js';
import sade from 'sade';

import { run as boilerplateCommand } from './commands/boilerplate/bp.js';
import { run as createCommand } from './commands/create/create.js';

const program = sade('create-ghost');

program.version(version);

program
	.command('bp')
	.alias('boilerplate')
	.describe('Get common boilerplate snippets')
	.option('-f, --force', 'Skip the confirmation for overwriting files', false)
	.action(boilerplateCommand);

program
	.command('create')
	.describe('Deprecated, please use `create-ghost template` instead')
	.option('-f, --force', 'Skip the confirmation for overwriting files', false)
	.action(createCommand);

program
	.command('template')
	.describe('Use a template to create a new project')
	.option('-f, --force', 'Skip the confirmation for overwriting files', false)
	.action(createCommand);

const update = await checkForUpdate(pkg.version);

console.log(
	dim(`  v${pkg.version}`),
	update?.available
		? `=> ${reset(green(`v${update.version}`))} ${dim('(Update Available)')}`
		: '',
);

console.log(`  ${bold(blue('create-ghost'))}\n`);

program.parse(process.argv);
