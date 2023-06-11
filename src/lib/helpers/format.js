import { lang } from '../lang';
import { get } from 'svelte/store';

const parseTime = (time) => {
  time /= 1000;
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time - hours * 3600) / 60);
  const seconds = Math.floor((time - hours * 3600 - minutes * 60))
  return { hours, minutes, seconds };
}

const formatDigit = d => new Intl.NumberFormat(get(lang), { minimumIntegerDigits: 2, minimumFractionDigits:1, maximumFractionDigits: 1 }).format(d);
//const formatDigit = d => d < 10 ? '0' + d : d;

export const formatTime = (time) => {
  const { hours, minutes, seconds } = parseTime(time);
  return `[${hours ? formatDigit(hours) + ':' : ''}${formatDigit(minutes)}:${formatDigit(seconds)}]`;
}

export const formatDuration = (time) => {
  const { hours, minutes, seconds } = parseTime(time);
  return `${hours ? formatDigit(hours) + 'h ' : ''}${minutes ? formatDigit(minutes) + 'min ': ''}${formatDigit(seconds)}sec`;
}