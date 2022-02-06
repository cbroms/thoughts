<script context="module">
	export async function load({ page, fetch, session, context }) {
		const url = `/thought/${page.params.id}.json`;
		const res = await fetch(url);

		if (res.ok) {
			return {
				props: {
					thought: await res.json(),
					id: page.params.id
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
	import LinkList from '../../components/LinkList.svelte';
	import Badge from '../../components/Badge.svelte';
	import History from '../../components/History.svelte';

	import toDateString from '$lib/date';

	export let thought;
	// export let id;

	let timestamp = toDateString(thought.data.updates[thought.data.updates.length - 1]);

	const place = thought.data.places[thought.data.places.length - 1];

	if (thought.data.daily) {
		timestamp = toDateString(thought.data.updates[0]);
	}
</script>

<svelte:head>
	<title>{thought.data.node}</title>
	<meta property="og:title" content={thought.data.node} />
	<meta property="og:description" content={thought.excerpt.text} />
	{#if thought.excerpt.image}
		<meta property="og:image" content="https://onedimension.net/{thought.excerpt.image}" />
	{/if}
	<meta property="og:site_name" content="One Dimension" />

	{#if thought.content.indexOf('hljs') !== -1}
		<link rel="stylesheet" href="/highlight.css" />
	{/if}

	{#if thought.data.daily}
		<link rel="stylesheet" href="/daily.css" />
	{/if}
</svelte:head>

<article>
	<div class="node-header">
		{#if thought.data.daily}
			<Badge title="Daily page" icon="𓅰" />
		{:else if thought.data.indexed}
			<Badge title="Highlighted thought" icon="𓄀" />
		{/if}
	</div>

	<h1 class="node">{thought.data.node}</h1>
	<main>{@html thought.content}</main>
</article>

<div class="footer">
	<div class="footer-desc">
		{#if thought.backlinks.length > 0}
			<span
				>Linked by {thought.backlinks.length} thought{thought.backlinks.length !== 1
					? 's '
					: ' '}</span
			>
		{/if}
	</div>
	<LinkList pages={thought.backlinks} />

	<div class="links-container">
		{#if !thought.data.daily}
			<details>
				<summary>
					Revisted {thought.data.updates.length} time{thought.data.updates.length > 1 ? 's' : ''},
					last on {toDateString(thought.data.updates[thought.data.updates.length - 1])} in {thought
						.data.places[thought.data.places.length - 1]}
				</summary>
				<History updates={thought.data.updates} places={thought.data.places} />
			</details>
		{:else}
			<span>
				{timestamp} in {place}
			</span>
		{/if}
	</div>
</div>

<style>
	article {
		margin-top: 25vh;
	}

	.node-header {
		max-width: 600px;
		width: 100%;
		margin: 0 auto;
	}

	.node {
		font-size: 3.5rem;
		line-height: 120%;
		font-family: var(--sans);
		padding-bottom: 10px;
		margin-bottom: 50px;
	}

	.footer {
		margin: 0 auto;
		margin-top: 80px;
		margin-bottom: 40px;
		padding: 20px 0;
		max-width: 600px;
	}

	.footer-desc {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
	}

	.links-container {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		padding-top: 20px;
	}

	summary {
		margin-bottom: 30px;
	}
</style>
