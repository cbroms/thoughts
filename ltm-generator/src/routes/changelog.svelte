<script context="module">
	export async function load({ page, fetch, session, context }) {
		const url = `changelog.json`;
		const res = await fetch(url);

		if (res.ok) {
			return {
				props: {
					changes: await res.json()
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
	export let changes;
</script>

<div class="changelog-wrapper">
	<h1>Changelog</h1>
	<details>
		<summary>Jump to day</summary>
		<ul>
			{#each changes as day}
				<li><a href="#{day.id}">{day.date}</a></li>
			{/each}
		</ul>
	</details>

	{#each changes as day}
		<h3 id={day.id}>{day.date}</h3>
		<ul>
			{#each day.changes as change}
				<li>
					{#if change.node.from}
						<a href="/thought/{change.id.from}">{change.node.from}</a>
						<span title={change.type.action}>{change.type.symbol}</span>
						<a href="/thought/{change.id.to}">{change.node.to}</a>
					{:else}
						<span title={change.type.action}>{change.type.symbol}</span>
						<a href="/thought/{change.id}">{change.node}</a>
					{/if}
				</li>
			{/each}
		</ul>
	{/each}
</div>

<style>
	.changelog-wrapper {
		max-width: 600px;
		margin: 0 auto;
	}

	details {
		border-bottom: 1px solid;
		padding-bottom: 20px;
		margin: 40px 0;
	}

	h1 {
		margin-top: 60px;
	}
</style>
