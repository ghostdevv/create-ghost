import { existsSync, readdirSync, mkdirSync, copyFileSync } from 'fs';
import { onCancel } from '../../utils/prompts.js';
import { dirname, join, resolve } from 'path';
import { join as desmJoin } from 'desm';
import logSymbols from 'log-symbols';
import prompts from 'prompts';
import kleur from 'kleur';
import cpy from 'cpy';

export const meta = {
    description: 'Get common boilerplate code such as configs',
};

const loadItem = async (path) => {
    const { default: meta } = await import(join(path, 'meta.js'));

    return {
        ...meta,
        path,
    };
};

async function checkForce(file, dir = false) {
    const message = `Is it ok to ${kleur.red('OVERWRITE')} ${
        dir ? 'some files in' : ''
    } ${file}`;

    const { check } = await prompts({
        type: 'confirm',
        name: 'check',
        message,
    });

    if (!check) onCancel();
}

export const run = async (args) => {
    const itemsDirectory = desmJoin(import.meta.url, './items');
    const dirs = readdirSync(itemsDirectory);

    const items = new Map();
    const choices = [];

    for (const dir of dirs) {
        const path = join(itemsDirectory, dir);
        const item = await loadItem(path);

        items.set(dir, item);

        choices.push({
            title: item.name,
            value: dir,
        });
    }

    const { itemDirs } = await prompts(
        {
            type: 'multiselect',
            message: 'Select an bp item',
            name: 'itemDirs',
            choices,
        },
        { onCancel },
    );

    for (const dir of itemDirs) {
        console.log();

        const item = items.get(dir);

        if (item.file) {
            const file = join(item.path, item.file);
            const out = resolve(item.out);

            if (existsSync(out) && !args.force) await checkForce(item.file);

            mkdirSync(dirname(out), { recursive: true });
            copyFileSync(file, out);
        } else {
            const dir = join(item.path, item.dir);
            const out = resolve(item.out);

            const exists = existsSync(out);

            if (exists && !args.force) await checkForce(item.out, true);

            await cpy(`${dir}/**`, out);
        }
    }

    console.log();
    console.log(`${logSymbols.success} ${kleur.green('Done')}`);
};
