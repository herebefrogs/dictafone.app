import { findRecording, saveRecording } from "./storage.js";

const punctuation = {
  'en-US': {
    'full stop': '.',
    'comma': ',',
    'question mark': '?',
    'exclamation mark': '!',
    'semicolon': ';',       // must be before colon to avoid getting semi: ahaha
    'colon': ':',
    'dash': '-',
    'hyphen': '-',
    'ellipsis': '...',
    'open parenthesis': '(',
    'close parenthesis': ')',
    'open quote': '"',
    'close quote': '"',
    'open square bracket': '[',
    'close square bracket': ']',
    'open curly bracket': '{',
    'close curly bracket': '}',
    'ampersand': '&',
    'percent sign': '%',
    'dollar sign': '$',
    'pound sign': '£',
    'euro sign': '€',
    'yen sign': '¥',
  }
}

export class Transcripter extends EventTarget {
  #recognition
  #lang = 'en-US'
  #transcript = [];
  #transcriptName;

  #speechStartTime = 0;
  #lastTime = 0;
  #elapsedTime = 0;
  #restartRecognition = false;

  // public interface
  constructor() {
    super();

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      throw new Error('SpeechRecognition not supported on this browser.');
    }

    this.#recognition = new SpeechRecognition();
    this.#recognition.interimResults = false;
    this.#recognition.maxAlternatives = 1;
    this.#recognition.continuous = true;
    this.#recognition.onresult = this.#onResults.bind(this);
    this.#recognition.onspeechstart = this.#onSpeechStart.bind(this);
    this.#recognition.onend = this.#onend.bind(this);
  }

  get lang() {
    return this.#lang;
  }

  set lang(lang) {
    this.#recognition.lang = lang;
    this.#lang = lang;
  }

  start() {
    this.#recognition.start();
    this.#transcript = [];
    this.#transcriptName = undefined;
    this.#lastTime = performance.now();
    this.#elapsedTime = 0;
  }

  pause() {
    this.#recognition.stop();
    this.#restartRecognition = false;
    this.#elapsedTime += performance.now() - this.#lastTime;
  }

  resume() {
    this.#recognition.start();
    this.#lastTime = performance.now();
  }

  stop(name) {
    this.#recognition.stop();
    this.#restartRecognition = false;
    this.#transcriptName = name;
  }

  get text() {
    return this.#transcript.join('\n');
  }

  // event handlers
  #onSpeechStart() {
    this.#tick();

    this.#speechStartTime = this.#elapsedTime;
  }

  #onResults(event) {
    const result = event.results[event.resultIndex];
  
    if (result.isFinal) {
      this.#tick();

      const fragment = this.#replacePunctuation(result[0].transcript, punctuation[this.lang]);
      this.#transcript.push(`${this.#formatTime(this.#speechStartTime)} ${fragment}`);

      // unfortunately, "speechstart" event is fired only once after SpeechRecognition is started,
      // so we need to manually restart SpeechRecognition after each result
      // and hope it won't miss any speech in between
      this.#restartRecognition = true;
      this.#recognition.stop();

      this.dispatchEvent(new CustomEvent('transcript_updated', { detail: { text: this.text }}));
    }
  }

  async #onend() {
    if (this.#restartRecognition) {
      this.#recognition.start();
      this.#restartRecognition = false;
    }
    else if (this.#transcriptName) {
      const recording = findRecording(this.#transcriptName);
      recording.transcript = this.text;
      await saveRecording(recording);

      this.dispatchEvent(new CustomEvent('transcript_finalized', { detail: { recording }}));

      this.#transcriptName = undefined;
    }
  }

  // private helpers

  #tick() {
    const now = performance.now();
    this.#elapsedTime += now - this.#lastTime;
    this.#lastTime = now;
  }

  #replacePunctuation(text, punctuation) {
    Object.entries(punctuation).forEach(([command, sign]) => {
      text = text.replace(new RegExp(command, 'ig'), sign);
    });
    return text;
  }

  #formatDigit(d) {
    return d < 10 ? '0' + d : d;
  }
  
  #formatTime(time) {
    time = time / 1000;
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time - hours * 3600) / 60);
    const seconds = Math.floor((time - hours * 3600 - minutes * 60))
    return `[${hours ? this.#formatDigit(hours) + ':' : ''}${this.#formatDigit(minutes)}:${this.#formatDigit(seconds)}]`;
  }
}