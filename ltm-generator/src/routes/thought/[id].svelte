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
		? `Updated ${new Date(thought.data.updated).toDateString()}`
		: thought.data.created
		? `Created ${new Date(thought.data.created).toDateString()}`
		: '';
</script>

<svelte:head>
	<title>{thought.data.node}</title>
</svelte:head>

<article>
	<h1 class="node">{thought.data.node}</h1>

	<main>{@html thought.content}</main>

	<div class="backlinks">
		<div class="dates">{timestamp}</div>
		<details>
			<summary>
				Linked by {thought.backlinks.length} thought{thought.backlinks.length !== 1 ? 's' : ''}
			</summary>
			<div class="backlinks-container">
				{#each thought.backlinks as backlink}
					<a href="/thought/{backlink.link}"
						><div class="link">
							<div class="link-content">{@html backlink.content}</div>
							<div class="link-node">{backlink.data.node}</div>
						</div></a
					>
				{/each}
			</div>
		</details>
	</div>
</article>

<style>
	.node {
		margin-top: 20vh;
		font-size: 3.5rem;
		line-height: 120%;
		font-family: var(--sans);
		padding-bottom: 10px;
		margin-bottom: 50px;
		/* border-bottom: 2px solid; */
	}

	.backlinks {
		margin-top: 80px;
		margin-bottom: 40px;
		padding: 20px 0;
	}

	.dates {
		padding: 20px 0;
		border-bottom: 2px solid;
		font-size: 16px;
		font-family: var(--sans);
	}

	.backlinks-container {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}

	.backlinks-container > a {
		color: inherit;
		text-decoration: none;
	}

	summary {
		padding-top: 20px;
		font-size: 16px;
		font-family: var(--sans);
	}

	.link {
		--link-background: #f5f5f5;
		width: 250px;
		background-color: var(--link-background);
		padding: 10px;
		min-height: 150px;
		margin: 20px 0;
		border: 2px solid #000;
		transition: border 0.3s;
		/* border-left: 3px solid; */
		border-radius: 10px;
	}

	.link:hover {
		--link-background: #fff;
		border: 2px solid #253bff;
		border-bottom: 4px solid #253bff;
		background-color: var(--link-background);
	}

	.link:hover > .link-node {
		color: #253bff;
		border-top: 1px solid #253bff;
	}

	.link-content {
		font-size: 16px;
		line-height: 110%;
		display: inline-block;
		position: relative;
		height: 120px;
		overflow: hidden;
	}

	.link-node {
		transition: all 0.3s;
		color: #000;
		border-top: 1px solid;
		font-family: var(--sans);
		padding-top: 5px;
		font-weight: bold;
	}

	:global(.link-content p) {
		margin: 0;
	}

	:global(.link-content a) {
		color: black;
		pointer-events: none;
		text-decoration: none;
	}

	.link-content::after {
		content: '';
		position: absolute;
		bottom: 0;
		left: 0;
		width: 275px;
		height: 50px;
		background: linear-gradient(transparent, var(--link-background));
	}
</style>
