import { lang } from '$lib/stores/lang';

let number;
let secondLong;
let secondShort;
let date;

lang.subscribe(lang => {
  number = new Intl.NumberFormat(lang, { minimumIntegerDigits: 2 });
  secondLong = new Intl.NumberFormat(lang, { minimumIntegerDigits: 2, minimumFractionDigits: 3, maximumFractionDigits: 3 });
  secondShort = new Intl.NumberFormat(lang, { minimumIntegerDigits: 2, minimumFractionDigits: 1, maximumFractionDigits: 1 });
  date = new Intl.DateTimeFormat(lang, { dateStyle: "long", timeStyle: "medium" });
});

const parseTime = (time) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time - hours * 3600) / 60);
  const seconds = Math.floor((time - hours * 3600 - minutes * 60) * 1000) / 1000
  return { hours, minutes, seconds };
}

export const formatTimestamp = (time) => {
  const { hours, minutes, seconds } = parseTime(time);
  return `${number.format(hours)}:${number.format(minutes)}:${secondLong.format(seconds)}`;
}

export const formatDuration = (time) => {
  const { hours, minutes, seconds } = parseTime(time);
  return `${hours ? number.format(hours) + 'h ' : ''}${minutes ? number.format(minutes) + 'm ' : ''}${secondShort.format(seconds)}s`;
}

export const formatDate = (timestamp) => date.format(timestamp);