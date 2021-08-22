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

		return {
			body: {
				...thought,
				forwardlinkPreviewData
			}
		};
	}
}
