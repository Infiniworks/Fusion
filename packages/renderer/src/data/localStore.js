/* eslint-disable no-undef */ 
// ^ Needed since localStorage is available, but not properly found.
// src/stores/content.js
import { writable } from "svelte/store";
import { database } from "./dataTools.js";

let settings = new database("C:\\Files\\Coding\\local.json");

export const data = writable(await settings.get());

data.subscribe((value) => {
    console.log(value);
    settings.set(JSON.stringify(value));
    window.dbTools.overwriteJSON("C:\\Files\\Coding\\local.json", value);
});