/* eslint-disable no-undef */ 
// ^ Needed since localStorage is available, but not properly found.
// src/stores/content.js
import { writable } from "svelte/store";
// import { database } from "./dataTools.js";

// let settings = new database("C:\\Files\\Coding\\local.json");
// const initialSettingsState = await settings.get();
// const fullData = initialSettingsState;

export const data = writable(JSON.parse(localStorage.data));

data.subscribe((value) => {
    console.log(value);
    localStorage.data = JSON.stringify(value);
});