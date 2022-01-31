import getPage from '$lib/db';

export async function get() {
	const daily = await getPage(`/daily`);
	const indexed = await getPage(`/indexed`);
	const counts = await getPage('/counts');

	if (indexed && daily) {
		const data = [];
		for (const page of indexed) {
			const res = await getPage(`/thought/${page}/preview`);
			data.push({ ...res, link: page });
		}
		data.sort((a, b) => Date.parse(b.data.updated) - Date.parse(a.data.updated));

		let dailyData = [];
		for (const page of daily) {
			const res = await getPage(`/thought/${page}/preview`);
			dailyData.push({ ...res, link: page });
		}
		dailyData.sort((a, b) => Date.parse(b.data.created) - Date.parse(a.data.created));

		if (dailyData.length > 10) {
			dailyData = dailyData.splice(0, 10);
		}

		return {
			body: { indexed: [...data], daily: [...dailyData], counts }
		};
	}
}
