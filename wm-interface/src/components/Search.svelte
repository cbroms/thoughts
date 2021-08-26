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
      <div>{value.results}</div>
    {/if}
  {/if}
{/await}
