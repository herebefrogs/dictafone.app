import { writable } from 'svelte/store';

export const started = writable(false);

export const paused = writable(false);