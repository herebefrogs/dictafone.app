import { writable } from 'svelte/store';

export const lang = writable('en-US');

export const LANGUAGES = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'fr-FR', label: 'French (FR)' },
];