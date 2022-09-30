/* eslint-disable no-undef */ 
// ^ Needed since localStorage is available, but not properly found.
// src/stores/content.js
import { writable } from "svelte/store";

export const versions = writable(localStorage.version);
export const memory = writable(localStorage.memory || "2048");
export const selectedUser = writable(localStorage.selected || "e");
export const modDisabling = writable(localStorage.skipMods || false);
// export const options = writable(JSON.parse(localStorage.getItem("options") || JSON.stringify({})));

versions.subscribe((value) => localStorage.version = value);
memory.subscribe((value) => localStorage.memory = value);
selectedUser.subscribe((value) => localStorage.selected = value);
modDisabling.subscribe((value) => localStorage.skipMods = String(value));
// options.subscribe((value) => localStorage.setItem("options",JSON.stringify(value)));