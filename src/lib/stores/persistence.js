import { writable } from 'svelte/store';
import { browser } from '$app/environment';

const { subscribe, set, update } = writable([]);

// IndexedDB logic
const DB_VERSION = 1;
let db;
let transcripts_value = [];

subscribe(value => { transcripts_value = value });

if (browser) {
  // open/create the database
  const request = window.indexedDB.open('dictafone.app', DB_VERSION);

  request.onerror = e => {
    throw new Error('IndexedDB open database error: ' + e.target.errorCode, { cause: e });
  }
  // create schema for transcripts on first run
  request.onupgradeneeded = e => {
    db = e.target.result;

    db.createObjectStore('transcripts', { keyPath: 'id' });
  }
  // load all transcripts into store
  request.onsuccess = e => {
    db = e.target.result;

    db.onerror = e => {
      console.error('IndexedDB access database error: ' + e.target.errorCode, { cause: e });
    }

    db.transaction('transcripts', 'readonly')
    .objectStore('transcripts')
    .getAll()
    .onsuccess = e => set(e.target.result);
  }
}

// Svelte store logic
const remove = id => new Promise((resolve, reject) => {
  const request = db.transaction('transcripts', 'readwrite', { durability: 'strict' })
    .objectStore('transcripts')
    .delete(id);

  request.onsuccess = () => {
      update(transcripts => transcripts.filter(r => r.id !== id));
      resolve();
  }
  request.onerror = () => reject(`Failed to delete transcript from indexedDB (id: ${id})`);
});

const get = async (id) => db ?
  await new Promise((resolve, reject) => {
    const request = db.transaction('transcripts', 'readonly')
      .objectStore('transcripts')
      .get(id);

    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = () => reject(`Failed to get transcript from indexedDB (id: ${id})`);
  })
  : undefined;

const insert = async (transcript) => {
  set(
    await new Promise((resolve, reject) => {
      const request = db.transaction('transcripts', 'readwrite', { durability: 'strict' })
        .objectStore('transcripts')
        .add(transcript);

      request.onsuccess = (e) => resolve([...transcripts_value, transcript]);
      request.onerror = () => reject(`Failed to insert transcript in indexedDB (id: ${transcript.id})`);
    })
  );
};

export const transcripts = {
  subscribe,
  delete: remove,
  get,
  insert: insert,
};
