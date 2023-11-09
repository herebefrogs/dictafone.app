import { writable } from 'svelte/store';

// holds properties of the current transcripting session

export const started = writable(false);

export const paused = writable(false);

export const id = writable(null);

export const audio = writable(null);

export const name = writable(null);

export const transcript = writable([]);
