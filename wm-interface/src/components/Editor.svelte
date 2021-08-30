<script>
  import { thought, saved } from "../store/thought";
  import { active } from "../store/active";

  import { open } from "../store/sidebar";

  export let toggleOpen;

  let element;

  const onKeyDown = (e) => {
    if (e.key == "/" && e.metaKey) {
      e.preventDefault();
      toggleOpen();
    } else if (e.key === "s" && e.metaKey) {
      e.preventDefault();
      if ($active === "unsaved thought") {
        const name = prompt("Enter a name for the thought");
        // save the new file
      }
      // set the filename
      saved.set($thought);
    } else if (e.key === "e" && e.metaKey) {
      e.preventDefault();
      if ($saved !== $thought) {
        if (
          confirm(
            "You have unsaved changes. Are you sure you want to erase them?"
          )
        ) {
          thought.set("");
          saved.set("");
          active.set("unsaved thought");
        }
      }
    }
  };

  $: {
    if (!$open && element) {
      element.focus();
    }
  }
</script>

<textarea
  bind:this={element}
  placeholder="Form a thought..."
  bind:value={$thought}
  on:keydown={onKeyDown}
/>

<style>
  :root {
    --width: 600px;
    --half-width: 300px;
  }
  textarea {
    height: 100vh;
    margin: 0 auto;
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
  }
</style>
