<script>
  import hotkeys from "hotkeys-js";
  import { toFileName } from "./lib/file";

  import { open } from "./store/sidebar";
  import { active } from "./store/active";

  import Editor from "./components/Editor.svelte";
  import Search from "./components/Search.svelte";
  import Toolbar from "./components/Toolbar.svelte";

  const toggleOpen = () => {
    console.log($open);
    open.set(!$open);
  };

  hotkeys("ctrl+/, command+/", () => {
    toggleOpen();
    return false;
  });
</script>

<Toolbar {toggleOpen}>
  <Search {toggleOpen} />
</Toolbar>
<div class="editor-wrapper" class:open={$open}>
  <Editor {toggleOpen} />
</div>

<div class="thought-name">{toFileName($active)}</div>

<style>
  .thought-name {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }

  .editor-wrapper {
    width: 100%;
    transition: width 0.3s;
  }

  .editor-wrapper.open {
    width: calc(100% - 700px);
  }
</style>
