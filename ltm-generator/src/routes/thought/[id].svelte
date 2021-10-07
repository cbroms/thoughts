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

	const timestamp = thought.data.updated
		? new Date(thought.data.updated).toDateString()
		: thought.data.created
		? new Date(thought.data.created).toDateString()
		: '';
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
	<h1 class="node">{thought.data.node}</h1>

	<main>{@html thought.content}</main>
</article>

<div class="footer">
	<div class="footer-desc">
		<span
			>Linked by {thought.backlinks.length} thought{thought.backlinks.length !== 1
				? 's '
				: ' '}<span class="link-arrow">&seArr;</span></span
		><span
			><a href="/changelog#{timestamp.replaceAll(' ', '-')}">Last revisited {timestamp}</a></span
		>
	</div>

	<div class="backlinks-container">
		{#each thought.backlinks as backlink}
			<a class="pointer" href="/thought/{backlink.link}"
				><div class="link">
					<div class="link-node">{backlink.data.node}</div>
				</div></a
			>
		{/each}
	</div>
</div>

<style>
	.node {
		margin-top: 25vh;
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
		padding: 20px 0;
		font-size: 16px;
		font-family: var(--sans);
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		border-bottom: 1px solid;
	}

	.backlinks-container > a {
		text-decoration: none;
	}

	.link {
		width: 100%;
		padding: 10px 0;
		border-bottom: 1px solid #000;
	}

	.link-arrow {
		height: 16px;
	}

	.link-node {
		transition: all 0.3s;
		font-family: var(--sans);
		font-weight: bold;
	}
</style>
