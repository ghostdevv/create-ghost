import { onCancel, checkForce } from '../../utils/prompts.js';
import { existsSync, statSync, rmSync } from 'fs';
import { join as desmJoin } from 'desm';
import logSymbols from 'log-symbols';
import { resolve } from 'path';
import prompts from 'prompts';
import kleur from 'kleur';
import cpy from 'cpy';

export const meta = {
    description: 'Common templates',
};

const templates = [{ name: 'Changesets Monorepo', path: 'monorepo' }];

export const run = async (args) => {
    const { template, out } = await prompts([
        {
            name: 'template',
            type: 'select',
            message: 'Select a template',
            choices: templates.map((t) => ({
                title: t.name,
                value: desmJoin(import.meta.url, 'templates/', t.path),
            })),
        },
        {
            name: 'out',
            type: 'text',
            message: 'What folder should we put the template in?'
        }
    ], { onCancel });

    const outPath = resolve(out);

    if (existsSync(outPath) && !args.force) {
        await checkForce(outPath);

        const stat = statSync(outPath);
        
        if (!stat.isDirectory()) {
            rmSync(outPath);
        }
    };

    await cpy(`${template}/**`, outPath);

    console.log(`${logSymbols.success} Created a folder called ${kleur.gray(out)}`);
};
