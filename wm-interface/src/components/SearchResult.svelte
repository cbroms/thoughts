<script>
  import { fade } from "svelte/transition";
  import { isOkToErase } from "../lib/safety";
  import { getThought } from "../lib/db";
  import { thought, saved, indexed } from "../store/thought";
  import { active } from "../store/active";

  export let file;
  export let match;
  export let focused = false;
  export let commandIdx = 0;
  export let toggleOpen;

  const commands = ["open", "copy"];
  const elements = {};

  const onClick = async () => {
    if (commands[commandIdx] === "open") {
      if (isOkToErase()) {
        const openId = file.replace("/", "").replace(".md", "");
        const res = await getThought(openId);
        thought.set(res.content);
        saved.set(res.content);
        active.set(res.title);
        indexed.set(res.indexed);
        toggleOpen();
      }
    } else if (commands[commandIdx] === "copy") {
      const openId = file.replace("/", "");
      navigator.clipboard.writeText(openId);
      toggleOpen();
    }
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
