/**
 * Check whether an update is available
 * @param {string} currentVersion
 */
export async function checkForUpdate(currentVersion) {
	try {
		const res = await fetch('https://npm.antfu.dev/create-ghost');

		/** @type {{ version: string; }} */
		const { version } = await res.json();

		return {
			available: compare(version, currentVersion) === 1,
			version,
		};
	} catch (e) {
		return null;
	}
}

/**
 * Compare two semver versions
 *
 * Based on MIT Licenced code from semver-compare
 * https://www.npmjs.com/package/semver-compare
 * @param {string} a
 * @param {string} b
 * @returns
 */
function compare(a, b) {
	const pa = a.split('.');
	const pb = b.split('.');

	for (let i = 0; i < 3; i++) {
		const na = Number(pa[i]);
		const nb = Number(pb[i]);
		if (na > nb) return 1;
		if (nb > na) return -1;
		if (!Number.isNaN(na) && Number.isNaN(nb)) return 1;
		if (Number.isNaN(na) && !Number.isNaN(nb)) return -1;
	}

	return 0;
}
