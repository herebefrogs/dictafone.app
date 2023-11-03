import { writable } from 'svelte/store';

export const lang = writable('en-US');

export const LANGUAGES = [
  'en-US',
  'fr-FR',
]