<script context="module">
	export async function load({ page, fetch, session, context }) {
		const url = `daily.json`;
		const res = await fetch(url);

		if (res.ok) {
			const { daily } = await res.json();

			return {
				props: {
					pages: daily
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
</script>

<svelte:head>
	<title>Daily Pages - One Dimension</title>
	<meta property="og:title" content="Daily Pages - One Dimension" />
	<meta property="og:site_name" content="Daily Pages - One Dimension" />
</svelte:head>

<div class="wrapper">
	<div style="margin-top: 50px;">
		<div class="list-title">
			<Badge title="Daily pages" icon="𓅰" />
		</div>
		<LinkList {pages} date title="Daily pages" />
	</div>

	<div class="footer">
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

	.list-title {
		max-width: 600px;
		width: 100%;
		margin: 0 auto;
		margin-top: 5rem;
	}
</style>
