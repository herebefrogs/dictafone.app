import { lang } from './lang';
import { readable } from 'svelte/store';
import { time } from './time';
import { transcript } from './transcript';

let time_value = 0;

const onResults = event => {
  const result = event.results[event.resultIndex];
  
  if (result.isFinal) {
    transcript.update(transcript => transcript + '[' + time_value + '] ' + result[0].transcript + '\n');
  }
}

const createSpeechRecognition = () => {
  // @ts-ignore
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  // TODO handle
  if (!SpeechRecognition) {
    throw new Error('SpeechRecognition not supported on this browser.');
  }

  const recognition = new SpeechRecognition();
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  recognition.continuous = true;
  recognition.onresult = onResults;

  lang.subscribe(lang => { recognition.lang = lang; });
  time.subscribe(t => time_value = t);

  const { subscribe } = readable(recognition, () => () => { recognition.stop(); });

  return {
    subscribe,
    start: () => {
      recognition.start();
      transcript.set('');
    },
    pause: () => {
      recognition.stop();
    },
    resume: () => {
      recognition.start();
    },
    stop: () => {
      recognition.stop();
    }
  }
}

export const speechRecognition = createSpeechRecognition();
