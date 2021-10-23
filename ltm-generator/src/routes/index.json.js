import getPage from '$lib/db';

export async function get() {
	const indexed = await getPage(`/indexed`);

	if (indexed) {
		const data = [];
		for (const page of indexed) {
			const res = await getPage(`/thought/${page}/preview`);
			data.push({ ...res, link: page });
		}
		data.sort((a, b) => Date.parse(b.data.updated) - Date.parse(a.data.updated));
		return {
			body: [...data]
		};
	}
}
