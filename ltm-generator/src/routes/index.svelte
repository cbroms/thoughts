<script context="module">
	export async function load({ page, fetch, session, context }) {
		const url = `index.json`;
		const res = await fetch(url);

		// const meUrl = `/thought/me.json`;
		// const meRes = await fetch(meUrl);

		if (res.ok) {
			const { indexed, daily, counts } = await res.json();
			// let me = null;

			// if (meRes.ok) me = await meRes.json();
			return {
				props: {
					pages: indexed,
					dailyPages: daily,
					counts
					// me
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
	import LinkList from '../components/LinkList.svelte';
	import Badge from '../components/Badge.svelte';

	export let pages;
	export let dailyPages;
	export let counts;
	// export let me;
</script>

<svelte:head>
	<title>One Dimension</title>
	<meta property="og:title" content="One Dimension" />
	<!-- <meta property="og:description" content={me.excerpt.text} /> -->
	<meta property="og:site_name" content="One Dimension" />
</svelte:head>

<div class="wrapper">
	<!-- <div class="intro">
		{#if me.content}
			{@html me.content}
		{/if}
	</div> -->
	<!-- <pre>
        _______            _____________                              _____                            _____ 
__  __ \______________  __ \__(_)______ _________________________(_)____________   ______________  /_
_  / / /_  __ \  _ \_  / / /_  /__  __ `__ \  _ \_  __ \_  ___/_  /_  __ \_  __ \  __  __ \  _ \  __/
/ /_/ /_  / / /  __/  /_/ /_  / _  / / / / /  __/  / / /(__  )_  / / /_/ /  / / /___  / / /  __/ /_  
\____/ /_/ /_/\___//_____/ /_/  /_/ /_/ /_/\___//_/ /_//____/ /_/  \____//_/ /_/_(_)_/ /_/\___/\__/  
                                                                                                     
    </pre> -->

	<h1>One Dimension &#10132; &#10132; &#10132;</h1>

	<!-- <div class="list-title">
		<Badge title="Highlighted thoughts" icon="𓄀" />
	</div>
	<LinkList {pages} />

	<div class="list-title">
		<Badge title="Daily pages" icon="𓅰" />
	</div>
	<LinkList pages={dailyPages} date more="/daily" /> -->

	<div class="footer">
		<div>
			{counts.thoughts.toLocaleString('en-US')} thoughts, {counts.links.toLocaleString('en-US')} links,
			and {counts.words.toLocaleString('en-US')} words.
		</div>
		<div>
			Visit this page <a href="gemini://gemini.onedimension.net"
				>on Gemini <span class="link-arrow">&neArr;</span></a
			>
		</div>
	</div>
</div>

<style>
	.wrapper {
		max-width: 2000px;
	}

	/* pre {
		max-width: 600px;
		font-size: 0.6rem;
		line-height: 0.6rem;
		background-color: inherit;
		font-weight: 900;
	} */

	.list-title {
		max-width: 600px;
		width: 100%;
		margin: 0 auto;
		margin-top: 5rem;
	}

	h1 {
		font-size: 6rem;
		/* text-align: right; */
		line-height: 6rem;
		word-wrap: break-word;
	}

	.footer {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		font-size: 16px;
		font-family: var(--sans);
		padding-top: 20px;
		max-width: 600px;
		margin: 0 auto;
		margin-bottom: 4rem;
	}
</style>
