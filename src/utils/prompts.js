import prompts from 'prompts';
import k from 'kleur';

export const onCancel = () => {
    console.log();
    console.log(`  ${k.bold().red('Exited')} ${k.blue().dim('create-ghost')}`);
    process.exit(0);
};

export async function checkForce(file, dir = false) {
    const message = `Is it ok to ${k.red('OVERWRITE')} ${
        dir ? 'some files in' : ''
    } ${file}`;

    const { check } = await prompts({
        type: 'confirm',
        name: 'check',
        message,
    });

    if (!check) onCancel();
}