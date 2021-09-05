<svelte:options tag="page-preview" />

<script>
	import { fade } from 'svelte/transition';
	import { cubicIn } from 'svelte/easing';

	export let href;
	export let content;
	export let node;

	let visible = false;
	let top;
	let left;

	const height = 172;
	const width = 272;

	let element;

	const positionPreview = () => {
		const rect = element.getBoundingClientRect();

		// keep the previews a bit away from the sides
		const fullWidth = width + 40;
		const fullHeight = height + 40;

		const windowWidth = window.innerWidth;
		const windowHeight = window.innerHeight;

		if (windowWidth - rect.x < fullWidth) {
			left = windowWidth - fullWidth;
		} else {
			left = rect.x;
		}

		if (windowHeight - (rect.y + rect.height) < fullHeight) {
			top = windowHeight - fullHeight;
		} else {
			top = rect.y + rect.height;
		}
	};

	const toggleOn = () => {
		positionPreview();
		visible = true;
	};
	const toggleOff = () => {
		visible = false;
	};
</script>

<span on:mouseover={toggleOn} on:focus={toggleOn} on:mouseout={toggleOff} on:blur={toggleOff}>
	<a {href} bind:this={element}><slot /></a>
</span>
{#if visible}
	<a {href}>
		<div
			transition:fade={{ duration: 150, easing: cubicIn }}
			class="preview"
			style="position:fixed; top:{top}px; left:{left}px; height:{height}px; width:{width}px;"
		>
			<style>
				.link-content p {
					margin: 0;
				}

				.link-content a {
					color: black;
					pointer-events: none;
					text-decoration: none;
				}
			</style>
			<div class="link">
				<div class="link-content">{@html content}</div>
				<div class="link-node">{node} &rarr;</div>
			</div>
		</div>
	</a>
{/if}

<style>
	.preview {
		z-index: 1000;
	}

	.link {
		max-width: 250px;
		background-color: white;
		color: black;
		text-decoration: none;
		padding: 10px;
		height: 150px;
		border: 2px solid #253bff;
		border-bottom: 4px solid #253bff;
		margin-top: 5px;
		border-radius: 10px;
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
		border-top: 1px solid #253bff;
		color: #253bff;
		font-family: var(--sans);
		padding-top: 5px;
		font-weight: bold;
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

	a {
		color: #253bff;
	}

	a:visited {
		color: #253bff;
	}
</style>
