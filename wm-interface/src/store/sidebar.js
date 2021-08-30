import { writable } from "svelte/store";

export const open = writable(localStorage.getItem("open") === "true");

open.subscribe((value) => localStorage.setItem("open", value));
