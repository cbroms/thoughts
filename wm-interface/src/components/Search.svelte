<script>
  import { onDestroy, onMount } from "svelte";
  import hotkeys from "hotkeys-js";

  import { makeSearch } from "../lib/db";
  import SearchResult from "./SearchResult.svelte";

  export let toggleOpen;

  let query;
  let inputElt;
  let results = null;
  let resultElts = [];

  let focusedIdx = null;
  let commandIdx = 0;

  const setHoveredIdx = (val) => {
    focusedIdx = val;
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      results = makeSearch(query);
    } else if (e.key === "Escape") {
      e.preventDefault();
      toggleOpen();
    } else if (e.key == "/" && e.metaKey) {
      e.preventDefault();
      toggleOpen();
    } else if (e.key === "ArrowDown") {
      inputElt.blur();
      focusedIdx = 0;
    }
  };

  hotkeys("up,down,left,right", (e, handler) => {
    e.preventDefault();
    switch (handler.key) {
      case "up":
        focusedIdx -= 1;
        if (focusedIdx < 0) {
          inputElt.focus();
        } else {
          resultElts[focusedIdx].scrollIntoView({ behavior: "smooth" });
        }
        break;
      case "down":
        if (focusedIdx + 1 <= resultElts.length - 1) {
          focusedIdx += 1;
          resultElts[focusedIdx].scrollIntoView({ behavior: "smooth" });
        }

        break;
      case "left":
        commandIdx = 0;
        break;
      case "right":
        commandIdx = 1;
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
    hotkeys.unbind("up,down,left,right,escape");
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
          <div
            bind:this={resultElts[idx]}
            on:mouseover={() => setHoveredIdx(idx)}
            on:focus={() => setHoveredIdx(idx)}
          >
            <SearchResult
              {toggleOpen}
              {commandIdx}
              focused={focusedIdx === idx}
              {...result}
            />
          </div>
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
