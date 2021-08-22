<svelte:options tag="page-preview" />

<script>
	export let content;
</script>

<div>hey there</div>
<div>{@html content}</div>
