import { lang } from './lang';
import { get, readable } from 'svelte/store';
import { time } from './time';
import { transcript } from './transcript';


const onResults = event => {
  const result = event.results[event.resultIndex];
  
  if (result.isFinal) {
    // TODO it's a bit odd to use get(time) bevause $time doesn't work
    transcript.update(transcript => transcript + '[' + get(time) + '] ' + result[0].transcript + '\n');
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

  // TODO recognition.lang = $lang ?
  lang.subscribe(lang => { recognition.lang = lang; });

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
