import getPage from '$lib/db';

export async function get() {
	const daily = await getPage(`/daily`);

	if (daily) {
		const data = [];
		for (const page of daily) {
			const res = await getPage(`/thought/${page}/preview`);
			data.push({ ...res, link: page });
		}
		data.sort((a, b) => Date.parse(b.data.updated) - Date.parse(a.data.updated));
		return {
			body: { daily: [...data] }
		};
	}
}
