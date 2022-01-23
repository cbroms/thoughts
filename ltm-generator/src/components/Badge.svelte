<script>
	export let title;
	export let icon;
</script>

<div class="badge">
	<span class="badge-icon">{icon}</span>
	<span class="badge-title">{title}</span>
</div>

<style>
	.badge {
		font-family: var(--sans);
		padding: 8px 0;
		display: inline-flex;
		border-top: 1px solid;
	}

	.badge-title {
		margin-left: 4px;
		font-size: 16px;
	}

	.badge-icon {
		font-size: 20px;
		font-weight: bold;
	}
</style>
