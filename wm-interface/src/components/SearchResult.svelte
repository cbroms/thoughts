<script>
  import { fade } from "svelte/transition";

  export let file;
  export let match;
  export let focused = false;
  export let commandIdx = 0;

  const commands = ["open", "copy"];
  const elements = {};

  const onClick = () => {
    console.log(commands[commandIdx]);
  };

  $: {
    const elt = elements[commands[commandIdx]];
    if (focused && elt) {
      elt.focus();
    }
  }
</script>

<div class="result" class:focused>
  <div class="result-header">
    {file}
    {#if focused}
      <div
        class="commands"
        transition:fade={{
          duration: 200,
        }}
      >
        {#each commands as command, idx}
          <button
            bind:this={elements[command]}
            on:click={onClick}
            class:active={commandIdx === idx}>{command}</button
          >
        {/each}
      </div>
    {/if}
  </div>
  <div>{@html match}</div>
</div>

<style>
  .result {
    padding: 10px;
    background-color: var(--background-secondary);
    transition: background-color 0.3s;
    border-radius: var(--border);
  }

  .result-header {
    height: 26px;
    display: flex;
    justify-content: space-between;
  }

  button {
    padding: 5px;
    margin-left: 10px;
  }

  button.active {
    border: 1px solid var(--primary);
  }
  .focused {
    background-color: var(--background);
  }
</style>
