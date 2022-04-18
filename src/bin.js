#!/usr/bin/env node
import updateNotifier from 'update-notifier';
import { readFile } from 'fs/promises';
import { run } from '../src/index.js';
import minimist from 'minimist';

const args = minimist(process.argv.slice(2));

run({ args });

try {
    const pkg = await readFile('../package.json', 'utf-8');
    updateNotifier({ pkg: JSON.parse(pkg) }).notify();
} catch {}
