<script>
  import { thought, saved } from "../store/thought";
  import { active } from "../store/active";
  import { isOkToErase } from "../lib/safety";
  import { saveThought } from "../lib/db";
  import { toId } from "../lib/file";

  import { open } from "../store/sidebar";

  export let toggleOpen;

  let element;

  const onKeyDown = async (e) => {
    if (e.key == "/" && e.metaKey) {
      e.preventDefault();
      toggleOpen();
    } else if (e.key === "s" && e.metaKey) {
      // save the thought
      e.preventDefault();

      if ($active === "new thought") {
        // this is an unnamed thought, set a new name
        const name = prompt("Enter a name for the thought");
        // set the new file name
        active.set(name);
      }

      const res = await saveThought(toId($active), {
        content: $thought,
        node: $active,
      });

      if (res.ok) {
        saved.set($thought);
      } else {
        alert("Something went wrong saving; check the logs.");
      }
    } else if (e.key === "e" && e.metaKey) {
      // erase/create a new thought
      e.preventDefault();
      if (isOkToErase()) {
        thought.set("");
        saved.set("");
        active.set("new thought");
      }
    }
  };

  $: {
    if (!$open && element) {
      element.focus();
    }
  }
</script>

<div class="editor-wrapper">
  <h1>
    {$active}<sup class:visible={$thought !== $saved}>*</sup>
  </h1>
  <textarea
    bind:this={element}
    placeholder="Form a thought..."
    bind:value={$thought}
    on:keydown={onKeyDown}
  />
</div>

<style>
  :root {
    --width: 600px;
    --half-width: 300px;
  }

  h1 {
    margin: 0;
    font-size: 24px;
    color: var(--secondary);
  }

  sup {
    opacity: 0;
    transition: opacity 0.3s;
  }

  sup.visible {
    opacity: 1;
  }

  .editor-wrapper {
    height: 100vh;
    padding: 50px 10px 20px 10px;
    margin: 0 auto;
    width: var(--width);
    box-sizing: border-box;
  }
  textarea {
    padding: 0;
    margin-top: 40px;
    color: var(--primary);
    background-color: var(--background);
    /* background-color: royalblue; */
    width: 100%;
    height: calc(100% - 65px);
    font-family: monospace;
    border: none;
    outline: none;
    font-size: 16px;
    line-height: 22px;
    resize: none;
    display: block;
  }
</style>
