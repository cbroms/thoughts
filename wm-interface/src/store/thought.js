import { writable } from "svelte/store";

export const thought = writable(localStorage.getItem("thought") || "");
export const saved = writable(localStorage.getItem("saved-thought") || "");
export const indexed = writable(
  localStorage.getItem("indexed") === "true" || false
);
export const daily = writable(
  localStorage.getItem("daily") === "true" || false
);

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
