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
<div class="h-16" />

<div class="btm-nav shadow">
  <a href="/new">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
    </svg>
    <span class="btm-nav-label">New transcript</span>
  </a>
</div>