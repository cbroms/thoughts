<script>
  export let file;
  export let match;
  export let focused = false;
</script>

<div class:focused><b>{file}:</b> <span>{@html match}</span></div>

<style>
  div {
    padding: 10px;
  }
  .focused {
    background-color: var(--background);
  }
</style>
