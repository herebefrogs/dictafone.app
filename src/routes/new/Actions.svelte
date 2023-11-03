<script>
  import { onMount } from 'svelte';
  import { started, paused, transcript } from "./dictation";
  import { speechRecognition } from "./speechRecognition";
  import { time } from "./time";

  onMount(() => {
    speechRecognition.init();
  })

  const start_dictation = () => {
    $started = true;
    time.start();
    speechRecognition.start();
    $transcript = [];
  }

  const pause_dictation = () => {
    $paused = true;
    time.pause();
    speechRecognition.pause();
  }

  const resume_dictation = () => {
    $paused = false;
    time.resume();
    speechRecognition.resume();
  }

  const stop_dictation = () => {
    $started = false;
    $paused = false;
    time.stop();
    speechRecognition.stop();
  }

</script>

<div class="btm-nav sticky bottom-0">
  <button on:click={start_dictation} class:hidden={$started}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="red" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M22 12 a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
    <span class="btm-nav-label">Start</span>
  </button>
  <button on:click={pause_dictation} class:hidden={!$started || $paused}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
    </svg>
    <span class="btm-nav-label">Pause</span>
  </button>
  <button on:click={resume_dictation} class:hidden={!$paused}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
      <span class="btm-nav-label">Resume</span>
  </button>
  <button on:click={stop_dictation} class:hidden={!$started}>
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" />
    </svg>
    <span class="btm-nav-label">Stop</span>
  </button>
</div>