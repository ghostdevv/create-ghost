#!/usr/bin/env node
import updateNotifier from 'update-notifier';
import { readFileSync } from 'fs';
import { join } from 'desm';
import pc from 'picocolors';
import sade from 'sade';

import { run as boilerplateCommand } from './commands/boilerplate/bp.js';
import { run as createCommand } from './commands/create/create.js';

const pkgPath = join(import.meta.url, '../package.json');
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
    .describe('Common templates')
    .option('-f, --force', 'Skip the confirmation for overwriting files', false)
    .action(createCommand);

function run() {
    console.log(`  ${pc.dim(`v${pkg.version}`)}`);
    console.log(`  ${pc.bold(pc.blue('create-ghost'))}`);

    program.parse(process.argv);
    updateNotifier({ pkg }).notify();
}

run();
