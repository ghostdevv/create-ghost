#!/usr/bin/env node
import { checkForUpdate } from './utils/version.js';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import pc from 'picocolors';
import sade from 'sade';

import { run as boilerplateCommand } from './commands/boilerplate/bp.js';
import { run as createCommand } from './commands/create/create.js';

const pkgPath = join(import.meta.dirname, '../package.json');
const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));

const program = sade('create-ghost');

program.version(pkg.version);

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
	pc.dim(`  v${pkg.version}`),
	update?.available
		? // prettier-ignore
		  `=> ${pc.reset(pc.green(`v${update.version}`))} ${pc.dim('(Update Available)')}`
		: '',
);

console.log(`  ${pc.bold(pc.blue('create-ghost'))}\n`);

program.parse(process.argv);
