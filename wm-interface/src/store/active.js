import { writable } from "svelte/store";

export const active = writable(
  localStorage.getItem("active") || "unsaved thought"
);

active.subscribe((value) => {
  console.log(value);
  localStorage.setItem("active", value);
});
