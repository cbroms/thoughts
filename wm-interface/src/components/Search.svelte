<script>
  import { onDestroy, onMount } from "svelte";
  import hotkeys from "hotkeys-js";

  import { makeSearch } from "../lib/db";
  import SearchResult from "./SearchResult.svelte";

  export let toggleOpen;

  let query;
  let inputElt;
  let results = null;

  let focusedIdx = null;

  const onKeyDown = (e) => {
    console.log(e);
    if (e.key === "Enter") {
      results = makeSearch(query);
    } else if (e.key === "Escape") {
      toggleOpen();
    } else if (e.key === "ArrowDown") {
      inputElt.blur();
      focusedIdx = 0;
    }
  };

  hotkeys("up,down", (e, handler) => {
    e.preventDefault();
    switch (handler.key) {
      case "up":
        focusedIdx -= 1;
        if (focusedIdx < 0) {
          inputElt.focus();
        }
        break;
      case "down":
        focusedIdx += 1;
        break;
    }
  });

  hotkeys("escape", (e) => {
    e.preventDefault();
    toggleOpen();
  });

  onMount(() => {
    inputElt.focus();
  });

  onDestroy(() => {
    hotkeys.unbind("up,down,escape");
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
    <div>Searching...</div>
  {:then value}
    {#if value}
      {#if value.results.length === 0}
        <div>No results</div>
      {:else}
        {#each value.results as result, idx}
          <SearchResult focused={focusedIdx === idx} {...result} />
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
    margin-left: 32px;
  }
</style>
