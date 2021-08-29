<script>
  import { fly } from "svelte/transition";
  import { cubicOut } from "svelte/easing";
  export let open = false;
  export let toggleOpen;
</script>

<div class="toolbar-wrapper">
  <button class="query-open" on:click={toggleOpen}>&lsaquo;</button>

  {#if open}
    <div
      transition:fly={{
        duration: 500,
        x: 600,
        opacity: 0.5,
        easing: cubicOut,
      }}
      class="toolbar"
    >
      <button on:click={toggleOpen}>&rsaquo;</button>
      <slot />
    </div>
  {/if}
</div>

<style>
  .query-open {
    margin: 10px;
  }
  .toolbar-wrapper {
    position: absolute;
    top: 0;
    right: 0;
  }

  .toolbar {
    padding: 10px;
    position: absolute;
    top: 0;
    right: 0;
    width: 600px;
    height: 100vh;
    background-color: var(--background-secondary);
  }
</style>
