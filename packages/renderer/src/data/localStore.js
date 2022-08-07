// src/stores/content.js
import { writable } from "svelte/store";

export const versions = writable(localStorage.version);
export const maxMemory = writable(localStorage.maxMemory || "2048");
export const minMemory = writable(localStorage.minMemory || "128");
export const selectedUser = writable(localStorage.selected || "e");

/*
// Local is dangy-wous
export const local = writable(localStorage); 
local.subscribe(data => localStorage = data);
Uncaught TypeError: Cannot set property localStorage of #<Window> which has only a getter
    at localStore.js?t=1659819313190:13:38
    at Object.subscribe2 [as subscribe] (index.mjs:50:9)
    at localStore.js?t=1659819313190:13:7
*/

versions.subscribe((value) => localStorage.version = value);
maxMemory.subscribe((value) => localStorage.maxMemory = value);
minMemory.subscribe((value) => localStorage.minMemory = value);
selectedUser.subscribe((value) => localStorage.selected = value);