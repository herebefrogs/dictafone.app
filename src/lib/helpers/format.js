import { lang } from '../lang';

let numberFormatter;

lang.subscribe(lang => {
  numberFormatter = new Intl.NumberFormat(lang, { minimumIntegerDigits: 2, minimumFractionDigits:1, maximumFractionDigits: 1 });
});

const parseTime = (time) => {
  time /= 1000;
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time - hours * 3600) / 60);
  const seconds = Math.floor((time - hours * 3600 - minutes * 60))
  return { hours, minutes, seconds };
}

const formatDigit = d => numberFormatter.format(d);

export const formatTime = (time) => {
  const { hours, minutes, seconds } = parseTime(time);
  return `[${hours ? formatDigit(hours) + ':' : ''}${formatDigit(minutes)}:${formatDigit(seconds)}]`;
}

export const formatDuration = (time) => {
  const { hours, minutes, seconds } = parseTime(time);
  return `${hours ? formatDigit(hours) + 'h ' : ''}${minutes ? formatDigit(minutes) + 'min ': ''}${formatDigit(seconds)}sec`;
}