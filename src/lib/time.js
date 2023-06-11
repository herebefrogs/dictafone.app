import { derived, writable } from 'svelte/store';


const createTime = () => {
  const { subscribe, set, update } = writable(0);
  let lastTime = 0;
  let intervalId;

  const tick = () => {
    const now = performance.now();
    update(elapsedTime => elapsedTime + (now - lastTime) / 1000);
    lastTime = now;
  };

  return {
    subscribe,
    start: () => {
      set(0);
      lastTime = performance.now();
      intervalId = setInterval(tick, 100);
    },
    pause: () => {
      update(elapsedTime => elapsedTime + (performance.now() - lastTime) / 1000);
      clearInterval(intervalId);
    },
    resume: () => {
      lastTime = performance.now();
      intervalId = setInterval(tick, 100);
    },
    stop: () => {
      clearInterval(intervalId);
    }
  }
}

export const time = createTime();