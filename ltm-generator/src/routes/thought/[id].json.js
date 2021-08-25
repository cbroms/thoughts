import getPage from '$lib/db';

export async function get({ params }) {
	const { id } = params;

	const thought = await getPage(`/thought/${id}`);

	if (thought) {
		const forwardlinkPreviewData = {};
		// get the data for tooltip page previews
		for (const link of thought.data.forwardlinks) {
			const res = await getPage(`/thought/${link}/preview`);
			forwardlinkPreviewData[link] = res;
		}

		// replace all <a> tags with <page-preview> tags
		thought.content = thought.content.replace(/<\s*a[^>]*>(.*?)<\s*\/\s*a>/g, (a) => {
			// get the href
			const href = a.split('"')[1];
			// get the contents between the tags
			const text = a.match(/(?<=>)(.*?)(?=<\/)/g);

			const preview = forwardlinkPreviewData[href];
			// replace " with ' since the html will have to be passed as a string
			const previewContent = preview.content.replaceAll('"', "'");

			return `<page-preview content="${previewContent}" href="/thought/${href}">${text}</page-preview>`;
		});

		return {
			body: {
				...thought
			}
		};
	}
}
