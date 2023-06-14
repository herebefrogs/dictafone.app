import { lang } from './lang';
import { readable } from 'svelte/store';
import { recordings } from './recordings';
import { time } from './time';
import { id, name, transcript } from './transcript';

let speech_start_time = 0;
let time_value = 0;
let restart_recognition = false;

let id_value;
let name_value;
let transcript_value;

const onSpeechStart = () => {
  speech_start_time = time_value;
};

const onResults = event => {
  const result = event.results[event.resultIndex];
  
  if (!result[0].transcript) {
    return;
  }

  transcript.update(transcript => [
    ...transcript.filter(t => t.end_time),
    {
      start_time: speech_start_time,
      end_time: result.isFinal ? time_value : null,
      text: result[0].transcript
    }
  ])

  if (result.isFinal) {
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
  else if (id_value) {
    recordings.upsert({ id: id_value, name: name_value, transcript: transcript_value });
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
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.continuous = true;
  recognition.onspeechstart = onSpeechStart;
  recognition.onresult = onResults;
  recognition.onend = onEnd;

  lang.subscribe(lang => { recognition.lang = lang; });
  time.subscribe(t => { time_value = t; });
  id.subscribe(i => { id_value = i; });
  name.subscribe(n => { name_value = n; });
  transcript.subscribe(t => { transcript_value = t; });

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
