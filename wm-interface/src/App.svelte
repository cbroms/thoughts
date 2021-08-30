<script>
  import hotkeys from "hotkeys-js";

  import Editor from "./components/Editor.svelte";
  import Search from "./components/Search.svelte";
  import Toolbar from "./components/Toolbar.svelte";

  let open = false;

  const toggleOpen = () => {
    open = !open;
  };

  hotkeys("ctrl+l, command+l", function () {
    toggleOpen();
    return false;
  });
</script>

<Toolbar {open} {toggleOpen}>
  <Search {toggleOpen} />
</Toolbar>
<Editor {open} {toggleOpen} />

<style>
</style>
