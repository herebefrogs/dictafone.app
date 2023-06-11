import { lang } from './lang';
import { readable } from 'svelte/store';
import { time } from './time';
import { transcript } from './transcript';

let speech_start_time = 0;
let current_time = 0;
let restart_recognition = false;

const onSpeechStart = () => {
  speech_start_time = current_time;
};

const onResults = event => {
  const result = event.results[event.resultIndex];
  
  if (result.isFinal && result[0].transcript) {
    transcript.update(transcript => [
      ...transcript,
      {
        start_time: speech_start_time,
        end_time: current_time,
        text: result[0].transcript
      }
    ]);

    // "speechstart" event is only fired once, so manually restart SpeechRecognition after each result
    // hoping we won't miss any speech in between the stop() and start() calls
    speechRecognition.stop(true);
  }
}

const onEnd = () => {
  if (restart_recognition) {
    speechRecognition.start();
    restart_recognition = false;
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
  recognition.onspeechstart = onSpeechStart;
  recognition.onresult = onResults;
  recognition.onend = onEnd;

  lang.subscribe(lang => { recognition.lang = lang; });
  time.subscribe(t => { current_time = t; });

  const { subscribe } = readable(recognition, () => () => { recognition.stop(); });

  return {
    subscribe,
    start: () => {
      recognition.start();
    },
    pause: () => {
      recognition.stop();
      restart_recognition = false;
    },
    resume: () => {
      recognition.start();
    },
    stop: (restart = false) => {
      recognition.stop();
      restart_recognition = restart;
    }
  }
}

export const speechRecognition = createSpeechRecognition();
