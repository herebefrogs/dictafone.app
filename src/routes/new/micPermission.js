import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const micPermission = writable("prompt");

if (browser) {
  navigator.permissions.query({ name: 'microphone' })
    .then(permissionStatus => {
      permissionStatus.onchange = () => {
        // we want to know right away if the user denies acces to their microphone
        if (permissionStatus.state === 'denied') {
          micPermission.set(permissionStatus.state);
        }
        // however, we want to let audioRecorder and micLevel stores complete their
        // initializations when the user grants access to their microphone before
        // setting the micPermission store to "granted"
      }
    })
}