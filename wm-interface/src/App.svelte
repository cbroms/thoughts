<script>
  import hotkeys from "hotkeys-js";
  import { toFileName } from "./lib/file";

  import { open } from "./store/sidebar";
  import { active } from "./store/active";

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

<Toolbar open={$open} {toggleOpen}>
  <Search {toggleOpen} />
</Toolbar>
<Editor open={$open} {toggleOpen} />

<div class="thought-name">{toFileName($active)}</div>

<style>
  .thought-name {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
</style>
