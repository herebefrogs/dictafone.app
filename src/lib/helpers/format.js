import { lang } from '../lang';

let number;
let second;

lang.subscribe(lang => {
  number = new Intl.NumberFormat(lang, { minimumIntegerDigits: 2 });
  second = new Intl.NumberFormat(lang, { minimumIntegerDigits: 2, minimumFractionDigits: 1, maximumFractionDigits: 1 });
});

const parseTime = (time) => {
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time - hours * 3600) / 60);
  const seconds = Math.floor((time - hours * 3600 - minutes * 60) * 10) / 10
  return { hours, minutes, seconds };
}

export const formatTime = (time) => {
  const { hours, minutes, seconds } = parseTime(time);
  return `[${hours ? number.format(hours) + ':' : ''}${number.format(minutes)}:${second.format(seconds)}]`;
}

export const formatDuration = (time) => {
  const { hours, minutes, seconds } = parseTime(time);
  return `${hours ? number.format(hours) + 'h ' : ''}${minutes ? number.format(minutes) + 'm ' : ''}${second.format(seconds)}s`;
}
