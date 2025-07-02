export function to(promise: any) {
	return promise
		.then((res: Record<string, any>) => {
			if (res && res.code) {
				return res.code === 0 ? [null, res] : [res, null];
			} else {
				return [null, res];
			}
		})
		.catch((err: any) => [err, null]);
}
