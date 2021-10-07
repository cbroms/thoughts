import getPage from '$lib/db';

export async function get({ params }) {
	const { id } = params;

	const thought = await getPage(`/thought/${id}`);
	console.log(`GET page: thought/${id}`);

	if (thought) {
		const backlinks = [];

		for (const link of thought.data.backlinks) {
			console.log(`GET page preview: thought/${link}`);
			const res = await getPage(`/thought/${link}/preview`);
			backlinks.push({ ...res, link });
		}

		thought.content = thought.content.replaceAll('.md', '');

		return {
			body: {
				...thought,
				backlinks
			}
		};
	}
}
