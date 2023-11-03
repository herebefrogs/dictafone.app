import { /*id, name,*/ paused, started, transcript } from './dictation';
// import { lang } from './lang';
import { readable } from 'svelte/store';
// import { recordings } from './recordings';
import { time } from './time';

let speech_start_time = 0;
let restart_recognition = false;
let recognition;

// let id_value;
// let name_value;
let paused_value;
let started_value;
let time_value = 0;
let transcript_value;

// id.subscribe(i => { id_value = i; });
// lang.subscribe(lang => { recognition.lang = lang; });
// name.subscribe(n => { name_value = n; });
paused.subscribe(p => { paused_value = p; });
started.subscribe(s => { started_value = s; });
time.subscribe(t => { time_value = t; });
transcript.subscribe(t => { transcript_value = t; });

const { subscribe } = readable(recognition, () => () => { recognition.stop(); });


const init = () => {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    throw new Error('SpeechRecognition API not available on this browser.');
  }

  recognition = new SpeechRecognition();
  recognition.interimResults = true;
  recognition.maxAlternatives = 1;
  recognition.continuous = true;
  recognition.onspeechstart = onSpeechStart;
  recognition.onresult = onResults;
  recognition.onend = onEnd;
  // NOTE: from empirical results, error events don't seem to be actionable so they are best ignored.
}

const onSpeechStart = e => {
  // record the starting time of a new line in the transcription
  speech_start_time = time_value;
};

const onResults = event => {
  const result = event.results[event.resultIndex];

  // don't append a new transcript if empty
  if (!result[0].transcript) {
    return;
  }

  // in Chrome for Android, every result is final :facepalm:
  // but it seems interim results always have a confidence of 0
  const resultFinal = (result.isFinal && result[0].confidence);

  transcript.update(transcript => [
    ...transcript.filter(t => t.end_time),
    {
      start_time: speech_start_time,
      end_time: resultFinal ? time_value : null,
      text: result[0].transcript
    }
  ])

  if (resultFinal) {
    // "speechstart" event is only fired once, so it's not possible to know the start time
    // of results after the first one without manually restarting the SpeechRecognition
    // engine after each result (if dictation is not paused nor stopped)
    // hope we won't miss any speech in between stop() and start() calls
    speechRecognition.stop(started_value && !paused_value);
  }
}

const onEnd = () => {
  // on Android, the SpeechRecognition engine stops automatically a few seconds after the last result
  // so we need to restart it manually if dictation is not paused nor stopped (treating the user to
  // a mic shutdown sound followed by a mic startup sound every time a restart happens... oh well)
  if (restart_recognition || (started_value && !paused_value)) {
    restart_recognition = false;
    speechRecognition.start();
  }
  // else if (id_value) {
  //   recordings.upsert({ id: id_value, name: name_value, transcript: transcript_value });
  // }
}

export const speechRecognition = {
  init,
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
};
