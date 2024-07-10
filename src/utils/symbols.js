import process from 'node:process';
import pc from 'picocolors';

/**
 * Check if unicode is supported on the current system.
 *
 * Based on MIT Licenced code from is-unicode-supported
 * https://www.npmjs.com/package/is-unicode-supported
 * @returns {boolean}
 */
function isUnicodeSupported() {
    if (process.platform !== 'win32') {
        return process.env.TERM !== 'linux'; // Linux console (kernel)
    }

    return (
        Boolean(process.env.WT_SESSION) || // Windows Terminal
        Boolean(process.env.TERMINUS_SUBLIME) || // Terminus (<0.2.27)
        process.env.ConEmuTask === '{cmd::Cmder}' || // ConEmu and cmder
        process.env.TERM_PROGRAM === 'Terminus-Sublime' ||
        process.env.TERM_PROGRAM === 'vscode' ||
        process.env.TERM === 'xterm-256color' ||
        process.env.TERM === 'alacritty' ||
        process.env.TERMINAL_EMULATOR === 'JetBrains-JediTerm'
    );
}

// Based on MIT Licenced code from log-symbols
// https://www.npmjs.com/package/log-symbols
export const logSymbols = isUnicodeSupported()
    ? {
          info: pc.blue('ℹ'),
          success: pc.green('✔'),
          warning: pc.yellow('⚠'),
          error: pc.red('✖'),
      }
    : {
          info: pc.blue('i'),
          success: pc.green('√'),
          warning: pc.yellow('‼'),
          error: pc.red('×'),
      };
