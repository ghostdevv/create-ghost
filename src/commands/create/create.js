import { existsSync, statSync, rmSync, readdirSync } from 'fs';
import { onCancel, checkForce } from '../../utils/prompts.js';
import { logSymbols } from '../../utils/symbols.js';
import { copy } from '../../utils/copy.js';
import { join as desmJoin } from 'desm';
import { join, resolve } from 'path';
import prompts from 'prompts';
import pc from 'picocolors';

async function loadTemplates() {
    const path = desmJoin(import.meta.url, './templates');
    const dirs = readdirSync(path);

    return dirs.map((name) => ({
        path: join(path, name),
        name: name
            .split('-')
            .map((x) => x[0].toUpperCase() + x.slice(1))
            .join(' '),
    }));
}

/** @type {import('sade').Handler} */
export const run = async ({ force }) => {
    const templates = await loadTemplates();

    const { template, out } = await prompts(
        [
            {
                name: 'template',
                type: 'select',
                message: 'Select a template',
                choices: templates.map((t) => ({
                    title: t.name,
                    value: t.path,
                })),
            },
            {
                name: 'out',
                type: 'text',
                message: 'What folder should we put the template in?',
            },
        ],
        { onCancel },
    );

    const outPath = resolve(out);

    if (existsSync(outPath) && !force) {
        await checkForce(outPath);

        const stat = statSync(outPath);

        if (!stat.isDirectory()) {
            rmSync(outPath);
        }
    }

    await copy(template, outPath);

    console.log(
        `${logSymbols.success} Created a folder called ${pc.gray(out)}`,
    );
};
