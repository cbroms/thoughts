import { writable } from "svelte/store";

export const thought = writable(localStorage.getItem("thought") || "");
export const saved = writable(localStorage.getItem("saved-thought") || "");
export const indexed = writable(localStorage.getItem("indexed") || "");
export const daily = writable(localStorage.getItem("daily") || "");

thought.subscribe((value) => {
  localStorage.setItem("thought", value);
});

saved.subscribe((value) => {
  localStorage.setItem("saved-thought", value);
});

indexed.subscribe((value) => {
  localStorage.setItem("indexed", value);
});

daily.subscribe((value) => {
  localStorage.setItem("daily", value);
});
