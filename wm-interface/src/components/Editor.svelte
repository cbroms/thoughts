<script>
  export let open;

  let content;
</script>

<textarea placeholder="Form a thought..." class:open bind:value={content} />

<style>
  :root {
    --width: 600px;
    --half-width: 300px;
  }
  textarea {
    height: 100vh;
    margin: 0 calc(50vw - var(--half-width)) 0 calc(50vw - var(--half-width));
    padding: 50px 0 20px 0;
    color: var(--primary);
    background-color: var(--background);
    width: var(--width);
    font-family: monospace;
    border: none;
    outline: none;
    font-size: 16px;
    line-height: 22px;
    resize: none;
    display: block;
    transition: margin 0.5s;
  }

  textarea.open {
    margin-right: 700px;
    margin-left: calc(100vw - calc(700px + var(--width)));
  }
</style>
