<script>
  import { makeSearch } from "../lib/db";
  let query;

  let results = null;

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      // make the search
      results = makeSearch(query);
    }
  };
</script>

<input bind:value={query} on:keydown={onKeyDown} />

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
