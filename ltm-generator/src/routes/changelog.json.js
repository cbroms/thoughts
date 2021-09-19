import getPage from '$lib/db';

export async function get() {
	const changes = await getPage(`/changes`);

	if (changes) {
		return {
			body: [...changes]
		};
	}
}
