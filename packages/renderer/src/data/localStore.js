/* eslint-disable no-undef */ 
// ^ Needed since localStorage is available, but not properly found.
// src/stores/content.js
import { writable } from "svelte/store";
import { database } from "./dataTools.js";

const settingsFile = await window.please.get("ensure", "store.json");
console.log(settingsFile);

let settings = new database(settingsFile);

export const data = writable(await settings.get());

data.subscribe((value) => {
    console.log(value);
    settings.set(JSON.stringify(value));
    window.dbTools.overwriteJSON(settingsFile, value);
});