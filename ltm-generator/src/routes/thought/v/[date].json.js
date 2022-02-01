import getPage from '$lib/db';

export async function get({ params }) {
	const { id, date } = params;

	const thought = await getPage(`/thought/${id}/v/${date}`);

	if (thought) {
		const backlinks = [];

		for (const link of thought.data.backlinks) {
			// TODO: get the preview of the old link version
			const res = await getPage(`/thought/${link}/preview`);
			backlinks.push({ ...res, link });
		}

		thought.content = thought.content.replaceAll(
			/<\s*a href="(.*?)"[^>]*>(.*?)<\s*\/\s*a>/g,
			(match, href, content) => {
				if (href.indexOf('http') !== -1) {
					return `<a href="${href}">${content} <span class='link-arrow'>&neArr;</span></a>`;
				} else {
					return `<a href="/thought/${href.replace('.md', '')}">${content}</a>`;
				}
			}
		);

		return {
			body: {
				...thought,
				backlinks
			}
		};
	}
}
