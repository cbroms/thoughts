<script>
  import { fade } from "svelte/transition";
  import { cubicOut } from "svelte/easing";

  import { open } from "../store/sidebar";

  export let toggleOpen;
</script>

<div class="toolbar-wrapper">
  <button class="query-open" on:click={toggleOpen}>&lsaquo;</button>
  <div class:open={$open} class="toolbar">
    {#if $open}
      <div in:fade={{ delay: 300, duration: 100 }} out:fade={{ duration: 50 }}>
        <button on:click={toggleOpen}>&rsaquo;</button>
        <slot />
      </div>
    {/if}
  </div>
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
    overflow: scroll;
    padding: 0;
    position: fixed;
    top: 0;
    right: 0;
    width: 0px;
    height: 100vh;
    box-sizing: border-box;
    background-color: var(--background-secondary);
    transition: width 0.3s, padding 0.3s;
  }

  .toolbar.open {
    width: 600px;
    padding: 10px;
  }

  button {
    font-size: 24px;
  }
</style>
