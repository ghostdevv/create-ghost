export function handleCancel<T>(
	result: T,
): asserts result is Exclude<T, symbol>;
