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

	export let thought;
	export let id;

	let timestamp = new Date(thought.data.updated).toDateString() || '';

	if (thought.data.daily) {
		timestamp = new Date(thought.data.created).toDateString();
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
</svelte:head>

<article>
	{#if thought.data.daily}
		<p class="node-header">𓅰 Daily page</p>
	{:else if thought.data.indexed}
		<p class="node-header">𓄀 Highlighted thought</p>
	{/if}
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
		<span
			>{#if !thought.data.daily} Last revisited {/if}
			{timestamp.replaceAll('-', ' ')} in {thought.data.place}</span
		>
		<span>
			Visit this page <a href="gemini://gemini.onedimension.net/thought/{id}.gmi"
				>on Gemini <span class="link-arrow">&neArr;</span></a
			>
		</span>
	</div>
</div>

<style>
	article {
		margin-top: 25vh;
	}

	.node-header {
		font-family: var(--sans);
		font-size: 16px;
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
		font-size: 16px;
		font-family: var(--sans);
		padding-top: 20px;
	}

	.link-arrow {
		height: 16px;
	}
</style>
