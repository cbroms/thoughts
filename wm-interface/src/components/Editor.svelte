<script>
  import { thought, saved, indexed, daily } from "../store/thought";
  import { active } from "../store/active";
  import { isOkToErase } from "../lib/safety";
  import {
    saveThought,
    indexThought,
    dailyThought,
    renameThought,
  } from "../lib/db";
  import { toId } from "../lib/file";

  import { open } from "../store/sidebar";

  import Bookmark from "./icons/Bookmark.svelte";
  import Clock from "./icons/Clock.svelte";

  export let toggleOpen;

  let element;

  const toggleIndex = async () => {
    if ($active !== "new thought") {
      const res = await indexThought(toId($active), !$indexed);
      if (res.ok) {
        const json = await res.json();
        indexed.set(json.indexed);
      }
    }
  };

  const toggleDaily = async () => {
    if ($active !== "new thought") {
      const res = await dailyThought(toId($active), !$daily);
      if (res.ok) {
        const json = await res.json();
        daily.set(json.daily);
      }
    }
  };

  const onKeyDown = async (e) => {
    if (e.key == "/" && e.metaKey) {
      // SEARCH
      e.preventDefault();
      toggleOpen();
    } else if (e.key === "s" && e.metaKey && e.shiftKey) {
      console.log("renaming");
      // RENAME
      e.preventDefault();
      const name = prompt("Enter a new name for the thought");

      if (name !== null && $active === "new thought") {
        active.set(name);
        // save the thought as a standard save
        const res = await saveThought(toId(name), {
          content: $thought,
          node: name,
        });

        if (res.ok) {
          saved.set($thought);
        } else {
          alert("Something went wrong saving; check the logs.");
        }
      } else if (name !== null) {
        // the thought has already been saved; rename it
        const res = await renameThought(toId($active), {
          node: name,
          id: toId(name),
          content: {
            content: $thought,
            node: $active,
          },
        });

        if (res.ok) {
          active.set(name);
          console.log(res);
          saved.set($thought);
        } else {
          alert("Something went wrong renaming; check the logs.");
        }
      }
    } else if (e.key === "s" && e.metaKey) {
      // SAVE
      e.preventDefault();

      if ($active === "new thought") {
        // this is an unnamed thought, set a new name
        const name = prompt("Enter a name for the thought");
        if (name !== null) {
          // set the new file name
          active.set(name);
        }
      }

      if ($active !== "new thought") {
        // save it
        const res = await saveThought(toId($active), {
          content: $thought,
          node: $active,
        });

        if (res.ok) {
          saved.set($thought);
        } else {
          alert("Something went wrong saving; check the logs.");
        }
      }
    } else if (e.key === "e" && e.metaKey) {
      // ERASE
      e.preventDefault();
      if (isOkToErase()) {
        thought.set("");
        saved.set("");
        indexed.set(false);
        active.set("new thought");
      }
    } else if (e.key === "b" && e.metaKey) {
      // INDEX
      e.preventDefault();
      toggleIndex();
    } else if (e.key === "d" && e.metaKey) {
      // MAKE DAILY
      e.preventDefault();
      toggleDaily();
    }
  };

  $: {
    if (!$open && element) {
      element.focus();
    }
  }
</script>

<div class="editor-wrapper">
  <div class="actions">
    <button on:click={toggleIndex} class:filled={$indexed}>
      <Bookmark />
    </button>
    <button on:click={toggleDaily} class:filled={$daily}>
      <Clock />
    </button>
  </div>
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
    --overhang: 50px;
    --width: 600px;
    --half-width: 300px;
  }

  h1 {
    margin: 0;
    font-size: 24px;
    color: var(--secondary);
    margin-left: 50px;
    margin-top: 20px;
    font-size: 3rem;
  }

  .actions {
    margin-left: 50px;
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
    width: calc(var(--width) + var(--overhang));
    box-sizing: border-box;
  }
  textarea {
    padding: 0;
    margin-top: 40px;
    color: var(--primary);
    background-color: var(--background);
    /* background-color: royalblue; */
    width: 100%;
    height: calc(100% - 155px);
    font-family: monospace;
    border: none;
    outline: none;
    font-size: 16px;
    line-height: 22px;
    resize: none;
    display: block;
    margin-left: var(--overhang);
  }

  button {
    background-color: var(--background);
    border: none;
    width: var(--overhang);
    color: var(--secondary);
    fill: none;
    display: inline-flex;
    align-content: center;
    justify-content: center;
    margin-left: -15px;
  }

  .filled {
    fill: var(--secondary);
  }
</style>
