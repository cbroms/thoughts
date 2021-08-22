const ce = 'http://localhost:3000/thought';

export async function get({ params }) {
	// the `slug` parameter is available because this file
	// is called [slug].json.js
	const { id } = params;

	const getPage = async (page) => {
		return await (await fetch(page)).json();
	};

	const thought = await getPage(`${ce}/${id}`);

	if (thought) {
		const forwardlinkPreviewData = {};
		// get the data for tooltip page previews
		for (const link of thought.data.forwardlinks) {
			const res = await getPage(`${ce}/${link}/preview`);
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
			previewContent = preview.content.replaceAll('"', "'");

			return `<page-preview content="${previewContent}" href="${href}">${text}</page-preview>`;
		});

		return {
			body: {
				...thought
			}
		};
	}
}
