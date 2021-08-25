import getPage from '$lib/db';

export async function get() {
	const thoughts = await getPage(`/`);

	if (thoughts) {
		return {
			body: [...thoughts]
		};
	}
}
