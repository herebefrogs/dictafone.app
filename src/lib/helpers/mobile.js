export const isAndroid = /Android/i.test(navigator.userAgent);

export const isIOS = /iPhone|iPad/i.test(navigator.userAgent);

export const isMobile = isAndroid || isIOS;