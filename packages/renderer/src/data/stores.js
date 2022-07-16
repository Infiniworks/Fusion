import { writable } from 'svelte/store';

export const serverUrl = writable('Waiting for Server to Start!');
export const cliStats = writable('Waiting for Client to Start!');
