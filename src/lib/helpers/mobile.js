import { browser } from '$app/environment';

let isAndroid = false;
let isIOS = false;
let isMobile = false;

if (browser) {
  isAndroid = /Android/i.test(navigator.userAgent);
  isIOS = /iPhone|iPad/i.test(navigator.userAgent);
  isMobile = isAndroid || isIOS;
}

export {
  isAndroid,
  isIOS,
  isMobile,
}