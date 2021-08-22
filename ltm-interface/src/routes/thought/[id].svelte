<script context="module">
	export async function load({ page, fetch, session, context }) {
		const url = `/thought/${page.params.id}.json`;
		const res = await fetch(url);

		if (res.ok) {
			return {
				props: {
					thought: await res.json()
				}
			};
		}

		return {
			status: res.status,
			error: new Error(`Could not load ${url}`)
		};
	}
</script>

<script>
	export let thought;
</script>

<div>{thought.data.node}</div>

<!-- <div>{@html thought.content}</div> -->

<div>{@html `<page-preview></page-preview>`}</div>
