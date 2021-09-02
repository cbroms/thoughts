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
</script>

<div class="thought">
	<h1 class="node">{thought.data.node}</h1>

	<main>{@html thought.content}</main>

	<div class="backlinks">
		<details>
			<summary
				>Linked by {thought.backlinks.length} thought{thought.backlinks.length > 1
					? 's'
					: ''}</summary
			>
			<div class="backlinks-container">
				{#each thought.backlinks as backlink}
					<a href="/thought/{backlink.link}"
						><div class="link">
							<div class="link-content">{@html backlink.content}</div>
							<div class="link-node">{backlink.data.node} &rarr;</div>
						</div></a
					>
				{/each}
			</div>
		</details>
	</div>
</div>

<style>
	.thought {
		max-width: 600px;
		width: 100%;
		margin: 0 auto;
		padding: 15px;
		box-sizing: border-box;
	}

	.node {
		margin-top: 20vh;
		font-size: 4rem;
		font-family: var(--sans);
		padding-bottom: 10px;
		margin-bottom: 50px;
		border-bottom: 2px solid;
	}

	.backlinks {
		border-top: 2px solid;
		padding-top: 10px;
		margin-top: 80px;
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
		font-size: 16px;
		font-family: var(--sans);
	}

	.link {
		max-width: 250px;
		background-color: white;
		padding: 10px;
		height: 150px;
		margin: 20px 0;
		border: 1px solid;
		border-radius: 15px;
	}

	.link-content {
		display: inline-block;
		position: relative;
		height: 120px;
		overflow: hidden;
	}

	.link-node {
		border-top: 1px solid;
		font-family: var(--sans);
		padding-top: 5px;
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
		background-image: linear-gradient(transparent, white);
	}
</style>
