<svelte:options tag="page-preview" />

<script>
	export let href;
	export let content;

	let visible = false;

	const toggleOn = () => {
		visible = true;
	};
	const toggleOff = () => {
		visible = false;
	};
</script>

<a {href} on:mouseover={toggleOn} on:focus={toggleOn} on:mouseout={toggleOff} on:blur={toggleOff}
	><slot /></a
>

{#if visible}
	<div>{@html content}</div>
{/if}
