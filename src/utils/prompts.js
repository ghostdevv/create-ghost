import k from 'kleur';

export const onCancel = () => {
    console.log();
    console.log(`  ${k.bold().red('Exited')} ${k.blue().dim('create-ghost')}`);
    process.exit(0);
};
