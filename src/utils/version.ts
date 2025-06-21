/**
 * Check whether an update is available
 */
export async function checkForUpdate(currentVersion: string) {
	try {
		const res = await fetch('https://npm.antfu.dev/create-ghost');
		const { version }: { version: string } = await res.json();

		return {
			available: compare(version, currentVersion) === 1,
			version,
		};
	} catch {
		return null;
	}
}

/**
 * Compare two semver versions
 *
 * Based on MIT Licenced code from semver-compare
 * https://www.npmjs.com/package/semver-compare
 */
function compare(a: string, b: string) {
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
