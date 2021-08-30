<script>
  import { thought, saved } from "../store/thought";
  import { active } from "../store/active";

  export let open;
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
    } else if (e.key === "u" && e.metaKey) {
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
    if (!open && element) {
      element.focus();
    }
  }
</script>

<textarea
  bind:this={element}
  placeholder="Form a thought..."
  class:open
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
