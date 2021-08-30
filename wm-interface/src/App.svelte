<script>
  import Editor from "./components/Editor.svelte";
  import Search from "./components/Search.svelte";
  import Toolbar from "./components/Toolbar.svelte";

  let open = false;

  const toggleOpen = () => {
    open = !open;
  };
</script>

<Toolbar {open} {toggleOpen}>
  <Search {toggleOpen} />
</Toolbar>
<Editor {open} />

<style>
</style>
