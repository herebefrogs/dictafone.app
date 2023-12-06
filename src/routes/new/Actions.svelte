<script>
  import { id, name, started, paused, lines } from '$lib/stores/transcript';
  import { speechRecognition } from './speechRecognition';
  import { audioRecorder } from './audioRecorder'
  import { time } from './time';
  import { micPermission } from './micPermission';

  const start_dictation = () => {
    $started = true;
    time.start();
    speechRecognition.start();
    $audioRecorder.start();
    $id = null;
    $name = null;
    $lines = [];
  }

  const pause_dictation = () => {
    $paused = true;
    time.pause();
    speechRecognition.pause();
    $audioRecorder.pause();
  }

  const resume_dictation = () => {
    $paused = false;
    time.resume();
    speechRecognition.resume();
    $audioRecorder.resume();
  }

  const stop_dictation = () => {
    $started = false;
    $paused = false;
    time.stop();
    speechRecognition.stop();
    $audioRecorder.stop();
    name_modal.showModal();
  }

  micPermission.subscribe((value) => {
    if (value === 'granted') {
      start_dictation();
    }
  });
</script>

<!-- HACK: add enough padding at the bottom of the page that the
  Actions bottom nav won't mask the last lines of the Transcript -->
<div class="h-24" />

<footer class="footer flex fixed justify-evenly bottom-0 left-0 w-full bg-base-100 border-t-2  py-2">
  <button on:click={pause_dictation} class:hidden={!$started || $paused} class="flex flex-col items-center rounded-md bg-base-200 hover:bg-base-300 py-2 w-32">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
    </svg>
    <span class="text-base-content text-center">Pause</span>
  </button>
  <button on:click={resume_dictation} class:hidden={!$paused} class="flex flex-col items-center rounded-md bg-base-200 hover:bg-base-300 py-2 w-32">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
      <span class="text-base-content text-center">Resume</span>
  </button>
  <button on:click={stop_dictation} class:hidden={!$started} class="flex flex-col items-center rounded-md bg-base-200 hover:bg-base-300 py-2 w-32">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
    </svg>
    <span class="text-base-content text-center">Stop</span>
  </button>
</footer>