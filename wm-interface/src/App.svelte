<script>
  import hotkeys from "hotkeys-js";

  import { open } from "./store/sidebar";
  import { active } from "./store/active";
  import { info } from "./store/info";

  import { saveFile } from "./lib/db";
  import { toId } from "./lib/file";

  import Editor from "./components/Editor.svelte";
  import Search from "./components/Search.svelte";
  import Toolbar from "./components/Toolbar.svelte";
  import Info from "./components/Info.svelte";

  const handleDrop = async (e) => {
    let file;

    if (e.dataTransfer.items) {
      for (const item of e.dataTransfer.items) {
        if (item.kind === "file") {
          file = item.getAsFile();
        }
      }
    }

    if ($active !== "new thought" && file) {
      const res = await saveFile(toId($active), file);
      if (res.ok) {
        const { image } = await res.json();
        info.set(`![](${image} "")`);
      } else {
        alert("Something went wrong saving; check the logs.");
      }
    } else {
      alert("Save the thought before adding an image.");
    }
  };

  const handleOver = (e) => {
    // console.log("file in");
  };

  const toggleOpen = () => {
    open.set(!$open);
  };

  hotkeys("ctrl+/, command+/", () => {
    toggleOpen();
    return false;
  });
</script>

<svelte:head>
  <title>Thoughts Editor</title>
</svelte:head>

<Info />
<Toolbar {toggleOpen}>
  <Search {toggleOpen} />
</Toolbar>
<div
  class="editor-wrapper"
  on:drop|preventDefault={handleDrop}
  on:dragover|preventDefault={handleOver}
  class:open={$open}
>
  <Editor {toggleOpen} />
</div>

<style>
  .editor-wrapper {
    width: 100%;
    transition: width 0.3s;
  }

  .editor-wrapper.open {
    width: calc(100% - 700px);
  }
</style>
