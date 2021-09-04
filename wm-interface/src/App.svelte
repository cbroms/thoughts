<script>
  import hotkeys from "hotkeys-js";

  import { open } from "./store/sidebar";

  import Editor from "./components/Editor.svelte";
  import Search from "./components/Search.svelte";
  import Toolbar from "./components/Toolbar.svelte";

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
<Toolbar {toggleOpen}>
  <Search {toggleOpen} />
</Toolbar>
<div class="editor-wrapper" class:open={$open}>
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
