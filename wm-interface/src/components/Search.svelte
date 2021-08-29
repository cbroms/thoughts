<script>
  import { onMount } from "svelte";

  import { makeSearch } from "../lib/db";

  export let toggleOpen;

  let query;
  let inputElt;
  let results = null;

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      results = makeSearch(query);
    } else if (e.key === "Escape") {
      toggleOpen();
    }
  };

  onMount(() => {
    inputElt.focus();
  });
</script>

<input
  bind:this={inputElt}
  placeholder="enter a query..."
  bind:value={query}
  on:keydown={onKeyDown}
/>
<div class="search-wrapper">
  {#await results}
    <div>searching...</div>
  {:then value}
    {#if value}
      {#if value.results.length === 0}
        <div>no results</div>
      {:else}
        {#each value.results as result}
          <div><b>{result.file}:</b> <span>{@html result.match}</span></div>
        {/each}
      {/if}
    {/if}
  {/await}
</div>

<style>
  input {
    width: 400px;
  }
  .search-wrapper {
    margin-top: 20px;
    margin-left: 42px;
  }
</style>
