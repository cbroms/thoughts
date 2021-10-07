<script>
  import { slide } from "svelte/transition";
  import { info } from "../store/info";

  const handleClick = () => {
    navigator.clipboard.writeText($info);
    info.set("Copied!");

    // reset once copied
    setTimeout(() => {
      info.set(null);
    }, 5000);
  };
</script>

{#if $info}
  <div transition:slide on:click={handleClick} class="message-banner">
    {$info}
  </div>
{/if}

<style>
  .message-banner {
    border-radius: 6px;
    position: absolute;
    top: 10px;
    left: 50%;
    transform: translate(-50%, 0);
    background-color: black;
    padding: 10px;
    max-width: 400px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    cursor: pointer;
  }
</style>
