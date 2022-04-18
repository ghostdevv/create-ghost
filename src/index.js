import logSymbols from 'log-symbols';
import k from 'kleur';

import * as bp from './commands/boilerplate/bp.js';

const commands = {
    bp,
};

export const createHelpText = () => `  npm init ghost <command>
  
  Global Flags:
   -h, --help          get the help menu

  Commands:
   ${Object.entries(commands)
       .map(([name, command]) => ` ${name} \t - ${command.meta.description}`)
       .join('\n')}`;

export const run = async ({ args }) => {
    console.log(`  ${k.dim(`v${'1.0.0'}`)}`);
    console.log(`  ${k.bold().blue('create-ghost')}`);
    console.log();

    const [commandName] = args._;

    if (!commandName || args.h || args.help) {
        return console.log(createHelpText());
    }

    const command = commands[commandName];

    if (!command)
        return console.log(
            ' ',
            logSymbols.error,
            k.red(`Command "${k.bold(commandName)}" not found`),
        );

    await command.run(args);
};
