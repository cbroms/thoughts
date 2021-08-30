import { get } from "svelte/store";

import { thought, saved } from "../store/thought";

export const isOkToErase = () => {
  if (get(thought) !== get(saved)) {
    const res = confirm(
      "You have unsaved changes. Are you sure you want to erase them?"
    );
    return res;
  }
  return true;
};
