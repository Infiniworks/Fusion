import { writable } from "svelte/store";
import { database } from "./dataTools.js";

const settingsFile = await window.please.get("ensure", "store.json");
console.log(settingsFile);

let settings = new database(settingsFile);

export const data = writable(await settings.get());

data.subscribe(async (value) => {
    await settings.set(JSON.stringify(value));
});