<svelte:options tag="page-preview" />

<script>
	export let href;
	export let content;

	let visible = false;
	let top;
	let left;

	const height = 150;
	const width = 300;

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
	{#if visible}
		<div
			class="preview"
			style="position:absolute; top:{top}px; left:{left}px; height:{height}px; width:{width}px;"
		>
			{@html content}
		</div>
	{/if}
</span>

<style>
	.preview {
		background-color: white;
		padding: 10px;
		border: 1px solid black;
	}
</style>
