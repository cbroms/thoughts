import { writable } from "svelte/store";

export const active = writable(localStorage.getItem("active") || "new thought");

active.subscribe((value) => {
  localStorage.setItem("active", value);
});
