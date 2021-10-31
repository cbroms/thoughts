<script context="module">
	export async function load({ page, fetch, session, context }) {
		const url = `index.json`;
		const res = await fetch(url);

		// const meUrl = `/thought/me.json`;
		// const meRes = await fetch(meUrl);

		if (res.ok) {
			const pages = await res.json();
			// let me = null;

			// if (meRes.ok) me = await meRes.json();
			return {
				props: {
					pages
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

	<div class="links">
		{#each pages as page}
			<a class="pointer" href="/thought/{page.link}"
				><div class="link">
					<div class="link-node">{page.data.node}</div>
				</div></a
			>
		{/each}
	</div>
</div>

<style>
	.wrapper {
		display: flex;
		flex-wrap: wrap;
		max-width: 2000px;
	}

	/* .intro {
		margin: 0 auto;
		margin-top: 150px;
	} */

	.links {
		max-width: 600px;
		width: 100%;
		margin: 0 auto;
		border-top: 1px solid;
		margin-top: 150px;
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
		font-size: 2rem;
		line-height: 120%;
	}

	a {
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
