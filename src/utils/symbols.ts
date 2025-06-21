import { blue, green, yellow, red } from 'picocolors';
import process from 'node:process';

/**
 * Check if unicode is supported on the current system.
 *
 * Based on MIT Licenced code from is-unicode-supported
 * https://www.npmjs.com/package/is-unicode-supported
 */
function isUnicodeSupported(): boolean {
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
			info: blue('ℹ'),
			success: green('✔'),
			warning: yellow('⚠'),
			error: red('✖'),
		}
	: {
			info: blue('i'),
			success: green('√'),
			warning: yellow('‼'),
			error: red('×'),
		};
