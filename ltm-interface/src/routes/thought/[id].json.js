export async function get({ params }) {
	// the `slug` parameter is available because this file
	// is called [slug].json.js
	const { id } = params;

	const thought = await (await fetch('http://localhost:3000/thought/' + id)).json();

	if (thought) {
		return {
			body: {
				...thought
			}
		};
	}
}
