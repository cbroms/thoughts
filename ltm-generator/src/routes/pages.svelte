<script context="module">
	export async function load({ page, fetch, session, context }) {
		const url = `pages.json`;
		const res = await fetch(url);

		if (res.ok) {
			return {
				props: {
					thoughts: await res.json()
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
	export let thoughts;
</script>

<ul>
	<li><a href="/">index</a></li>
	{#each thoughts as thought}
		<li><a href="/thought/{thought}">{thought}</a></li>
	{/each}
</ul>
