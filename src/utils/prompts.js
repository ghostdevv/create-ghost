import prompts from 'prompts';
import pc from 'picocolors';

export function onCancel() {
    console.log();
    // prettier-ignore
    console.log(`  ${pc.bold(pc.red('Exited'))} ${pc.blue(pc.dim('create-ghost'))}`);
    process.exit(0);
}

/**
 * @param {string} file
 * @param {boolean=} dir
 */
export async function checkForce(file, dir = false) {
    const message = `Is it ok to ${pc.red('OVERWRITE')} ${
        dir ? 'some files in' : ''
    } ${file}`;

    const { check } = await prompts({
        type: 'confirm',
        name: 'check',
        message,
    });

    if (!check) onCancel();
}
