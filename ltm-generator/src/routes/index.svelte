<script context="module">
	export async function load({ page, fetch, session, context }) {
		const url = `index.json`;
		const res = await fetch(url);

		// const meUrl = `/thought/me.json`;
		// const meRes = await fetch(meUrl);

		if (res.ok) {
			const { indexed, counts } = await res.json();
			// let me = null;

			// if (meRes.ok) me = await meRes.json();
			return {
				props: {
					pages: indexed,
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
	export let pages;
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
	<pre>
        _______            _____________                              _____                            _____ 
__  __ \______________  __ \__(_)______ _________________________(_)____________   ______________  /_
_  / / /_  __ \  _ \_  / / /_  /__  __ `__ \  _ \_  __ \_  ___/_  /_  __ \_  __ \  __  __ \  _ \  __/
/ /_/ /_  / / /  __/  /_/ /_  / _  / / / / /  __/  / / /(__  )_  / / /_/ /  / / /___  / / /  __/ /_  
\____/ /_/ /_/\___//_____/ /_/  /_/ /_/ /_/\___//_/ /_//____/ /_/  \____//_/ /_/_(_)_/ /_/\___/\__/  
                                                                                                     
    </pre>

	<div class="links">
		{#each pages as page}
			<a class="pointer" href="/thought/{page.link}"
				><div class="link">
					<div class="link-node">{page.data.node}</div>
				</div></a
			>
		{/each}
	</div>

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

	pre {
		max-width: 600px;
		font-size: 0.6rem;
		line-height: 0.6rem;
		background-color: inherit;
		font-weight: 900;
	}

	/* .intro {
		margin: 0 auto;
		margin-top: 150px;
	} */

	.footer {
		display: flex;
		justify-content: space-between;
		flex-wrap: wrap;
		font-size: 16px;
		font-family: var(--sans);
		padding-top: 20px;
		max-width: 600px;
		margin: 0 auto;
	}

	.links {
		max-width: 600px;
		width: 100%;
		margin: 0 auto;
		border-top: 1px solid;
		margin-top: 50px;
	}
	.link {
		width: 100%;
		padding: 10px 0;
		border-bottom: 1px solid #000;
	}

	.link-node {
		transition: all 0.3s;
		font-family: var(--sans);
		font-weight: bold;
		/* font-size: 2rem; */
		line-height: 120%;
	}

	a.pointer {
		text-decoration: none;
	}

	/* h1 {
		font-size: 6rem;
		line-height: 120%;
		word-break: break-word;
	} */

	@media (max-width: 1231px) {
		.links {
			margin-top: 20px;
		}
	}
</style>
