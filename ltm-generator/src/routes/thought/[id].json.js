import getPage from '$lib/db';

export async function get({ params }) {
	const { id } = params;

	const thought = await getPage(`/thought/${id}`);
	// console.log(`GET page: thought/${id}`);

	if (thought) {
		const backlinks = [];

		for (const link of thought.data.backlinks) {
			// console.log(`GET page preview: thought/${link}`);
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
