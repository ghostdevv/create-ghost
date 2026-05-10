#!/usr/bin/env node
import { version } from '../package.json' with { type: 'json' };
import { checkForUpdate } from './utils/version.js';
import { intro, outro } from '@clack/prompts';
import pc from 'picocolors';
import sade from 'sade';

import { run as boilerplateCommand } from './commands/bp.js';
import { run as createCommand } from './commands/create.js';

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

const update = await checkForUpdate(version);

// prettier-ignore
intro(`${pc.bold(pc.blue('create-ghost'))} ${pc.dim(`v${version}`)} ${update?.available ? `=> ${pc.reset(pc.green(`v${update.version}`))} ${pc.dim('(Update Available)')}`: ''}`);

await (program.parse(process.argv) as unknown as Promise<void>);

outro('(☆•ー•☆)');
