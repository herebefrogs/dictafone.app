import { browser } from '$app/environment';
import { writable } from 'svelte/store';

export const micPermission = writable('prompt');

if (browser) {
  navigator.permissions.query({ name: 'microphone' })
    .then(permissionStatus => {
      micPermission.set(permissionStatus.state);

      permissionStatus.onchange = () => {
        micPermission.set(permissionStatus.state);
      }
    });
}