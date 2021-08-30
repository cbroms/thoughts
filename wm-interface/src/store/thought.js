import { writable } from "svelte/store";

export const thought = writable(localStorage.getItem("thought") || "");
export const saved = writable(localStorage.getItem("saved-thought") || "");

thought.subscribe((value) => {
  localStorage.setItem("thought", value);
});

saved.subscribe((value) => {
  localStorage.setItem("saved-thought", value);
});
