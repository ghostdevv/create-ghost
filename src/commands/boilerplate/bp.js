import { existsSync, readdirSync, mkdirSync, copyFileSync } from 'fs';
import { onCancel, checkForce } from '../../utils/prompts.js';
import { dirname, join, resolve } from 'path';
import { join as desmJoin } from 'desm';
import logSymbols from 'log-symbols';
import prompts from 'prompts';
import kleur from 'kleur';
import cpy from 'cpy';

async function load() {
    const itemsPath = desmJoin(import.meta.url, './items');
    const dirs = readdirSync(itemsPath);

    const items = new Map();
    const choices = [];

    for (const dir of dirs) {
        const itemPath = join(itemsPath, dir);
        const metaPath = join(itemPath, 'meta.js');

        const { default: meta } = await import(metaPath);

        items.set(itemPath, { ...meta, path: itemPath });
        choices.push({ title: meta.name, value: itemPath });
    }

    return { items, choices };
}

/** @type {import('sade').Handler} */
export const run = async ({ force }) => {
    const { items, choices } = await load();

    const { directories } = await prompts(
        {
            type: 'multiselect',
            message: 'Select an bp item',
            name: 'directories',
            choices,
        },
        { onCancel },
    );

    for (const dir of directories) {
        console.log();

        const item = items.get(dir);

        if (item.file) {
            const file = join(item.path, item.file);
            const out = resolve(item.out);

            if (existsSync(out) && !force) await checkForce(item.file);

            mkdirSync(dirname(out), { recursive: true });
            copyFileSync(file, out);
        } else {
            const dir = join(item.path, item.dir);
            const out = resolve(item.out);

            const exists = existsSync(out);

            if (exists && !force) await checkForce(item.out, true);

            await cpy(`${dir}/**`, out);
        }
    }

    console.log();
    console.log(`${logSymbols.success} ${kleur.green('Done')}`);
};
