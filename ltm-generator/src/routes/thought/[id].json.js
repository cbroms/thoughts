import getPage from '$lib/db';

export async function get({ params }) {
	const { id } = params;

	const thought = await getPage(`/thought/${id}`);

	if (thought) {
		const forwardlinkPreviewData = {};
		const backlinks = [];
		// get the data for tooltip page previews
		for (const link of thought.data.forwardlinks) {
			const res = await getPage(`/thought/${link}/preview`);
			forwardlinkPreviewData[link + '.md'] = res;
		}

		for (const link of thought.data.backlinks) {
			const res = await getPage(`/thought/${link}/preview`);
			backlinks.push({ ...res, link });
		}

		// replace all <a> tags with <page-preview> tags
		thought.content = thought.content.replace(/<\s*a[^>]*>(.*?)<\s*\/\s*a>/g, (a) => {
			// get the href
			const href = a.split('"')[1];
			// get the contents between the tags
			const text = a.match(/(?<=>)(.*?)(?=<\/)/g);

			const preview = forwardlinkPreviewData[href];

			if (preview) {
				// replace " with ' since the html will have to be passed as a string
				const previewContent = preview.content.replaceAll('"', "'");

				return `<page-preview style="font-size: 0" content="${previewContent}" node="${
					preview.data.node
				}" href="/thought/${href.replace('.md', '')}">${text}</page-preview>`;
			} else {
				return `<a href="${href}" target="blank">${text} <span class="link-arrow">&#8663;</span></a>`;
			}
		});

		return {
			body: {
				...thought,
				backlinks
			}
		};
	}
}
