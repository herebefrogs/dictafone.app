<script>
  import { transcripts } from '$lib/stores/persistence';
  import Loading from '$lib/components/Loading.svelte';
  import TranscriptSummary from './TranscriptSummary.svelte';

  let transcripts_value;

  transcripts.subscribe(tv => transcripts_value = tv);
</script>

{#if !transcripts_value}
<Loading />
{:else if transcripts_value.length === 0}
<div class="flex justify-center content-stretch mt-12">
  <p>No transcripts yet.</p>
</div>
{:else}
  {#each transcripts_value as transcript}
  <TranscriptSummary transcript={transcript} />
  {/each}
{/if}


<!-- HACK: add enough padding at the bottom of the page that the
  Actions bottom nav won't mask the last lines of the Transcript -->
<div class="h-36" />

<footer class="flex flex-col fixed bottom-0 left-0 w-full bg-base-100 border-t-2">
  <nav class="self-center py-2">
    <a href="/new" class="flex flex-col items-center rounded-md bg-base-200 hover:bg-base-300 py-2 w-36">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
      </svg>
      <span class="text-base-content">New transcript</span>
    </a>
  </nav>
  <aside class="grid grid-cols-3 items-center bg-neutral text-neutral-content p-4">
    <p class="block">© 2023 <a href="https://herebefrogs.com" class="link">Jerome&nbsp;Lecomte</a></p>
    <a href="https://github.com/herebefrogs/dictafone.app" class="justify-self-center">
      <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" class="w-5 h-6" aria-hidden="true" role="img" >
        <path fill-rule="evenodd" d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"></path>
      </svg>
    </a>
    <a href="https://paypal.me/herebefrogs" class="link justify-self-end">Tip</a>
  </aside>
</footer>
