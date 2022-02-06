<script>
	import toDateString from '$lib/date';

	export let pages;
	export let date = false;
	export let more = null;
</script>

<div class="links">
	{#each pages as page}
		<a class="pointer" href="/thought/{page.link}"
			><div class="link">
				<div class="link-node">
					<span>{page.data.node}</span>
					{#if date}
						<span class="link-date">{toDateString(page.data.updates[0])}</span>{/if}
				</div>
			</div></a
		>
	{/each}
	{#if more}
		<a class="pointer" href={more}
			><div class="link">
				<div class="link-node more">More...</div>
			</div></a
		>
	{/if}
</div>

<style>
	.links {
		max-width: 600px;
		width: 100%;
		margin: 0 auto;
		border-top: 1px dotted;
		margin-top: 1rem;
	}

	.link {
		width: 100%;
		padding: 10px 0;
		border-bottom: 1px dotted #000;
	}

	.link-node {
		transition: all 0.3s;
		font-family: var(--sans);
		font-weight: bold;
		line-height: 120%;
		display: flex;
		justify-content: space-between;
		width: 100%;
	}

	.link-date {
		min-width: 140px;
		font-size: 16px;
		font-weight: 400;
		text-align: right;
	}

	.more {
		font-weight: 400;
	}

	a.pointer {
		text-decoration: none;
	}

	/* @media (max-width: 1231px) {
		.links {
			margin-top: 20px;
		}
	} */
</style>
