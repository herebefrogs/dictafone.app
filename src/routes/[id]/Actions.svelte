<script>
  import { transcripts } from '$lib/stores/persistence';
  import { formatTimestamp } from '$lib/helpers/format'
  import { isAndroid } from '$lib/helpers/mobile';
  import { fireEvent } from '$lib/helpers/analytics';
  import { browser } from '$app/environment';

  export let transcript;

  const transcript2blob = (lines) => new Blob(
    lines.map(({start_time, end_time, text}, i) => `${i+1}\n${formatTimestamp(start_time)} --> ${formatTimestamp(end_time)}\n${text}\n\n`),
    {type: 'text/plain'}
  );

  const audioExt = isAndroid ? null : /audio\/(\w+)/.exec(transcript.audio.type)[1];
  const audioFilename = `${transcript.name}.${audioExt}`;

  const data = {
    title: transcript.name,
    files: [
      new File(
          [transcript2blob(transcript.lines)],
          // this must be .txt rather than .srt to be shareable by the API
          `${transcript.name}.txt`,
          {type: 'text/plain'}
        )
    ]
  };

  // audio recording is disabled on Android
  if (!isAndroid) {
    data.files.push(
      new File(
        [transcript.audio],
        audioFilename,
        {type: transcript.audio.type}
      )
    )
  }

  const canShare = browser && navigator.canShare && navigator.canShare(data);

  const share = async () => {
    try {
      await navigator.share(data);
      fireEvent('transcript_share', transcript)
    } catch (e) {
      console.error('Web Share API error', e)
    }
  }

  const remove = async () => {
    await transcripts.delete(transcript.id);
    fireEvent('transcript_delete', transcript)
    window.location.href = '/';
  }
</script>


<!-- HACK: add enough padding at the bottom of the page that the
  Actions bottom nav won't mask the last lines of the Transcript -->
<div class="h-24" />

<footer class="footer flex fixed justify-evenly bottom-0 left-0 w-full bg-base-100 border-t-2  py-2">
  <a href="/" class="flex flex-col items-center rounded-md bg-base-200 hover:bg-base-300 py-2 w-32">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
    </svg>
    <span class="text-base-content">Back</span>
  </a>
  <a download={`${transcript.name}.srt`} href={URL.createObjectURL(transcript2blob(transcript.lines))} type="text/plain" class="flex flex-col items-center rounded-md bg-base-200 hover:bg-base-300 py-2 w-32 download-text">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
    <span class="text-base-content">Download Text</span>
  </a>
  {#if !isAndroid}
  <a download={audioFilename} href={URL.createObjectURL(transcript.audio)} type={transcript.audio.type} class="flex flex-col items-center rounded-md bg-base-200 hover:bg-base-300 py-2 w-32 download-audio">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
    <span class="text-base-content">Download Audio</span>
  </a>
  {/if}
  {#if canShare}
  <button on:click={share} class="flex flex-col items-center rounded-md bg-base-200 hover:bg-base-300 py-2 w-32">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
    </svg>
    <span class="text-base-content">Share</span>
  </button>
  {/if}
  <button on:click={remove} class="flex flex-col items-center rounded-md bg-base-200 hover:bg-base-300 py-2 w-32">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </svg>
    <span class="text-base-content">Delete</span>
  </button>
</footer>