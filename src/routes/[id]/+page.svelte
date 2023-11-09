<script>
  import { page } from '$app/stores';
  import { formatDate, formatTime } from '$lib/helpers/format'
  import { transcripts } from '$lib/stores/persistence';
  import Transcript from '$lib/components/Transcript.svelte';
  import Loading from '$lib/components/Loading.svelte';
  import Actions from './Actions.svelte';

  let transcript;

  transcripts.subscribe(() => transcript = transcripts.get($page.params.id));
</script>

{#if !transcript}
<Loading />
{:else}
<div class="card mt-4 w-full bg-base-100 shadow-md">
  <div class="card-body">
    <h2 class="card-title">
      {transcript.name}
    </h2>
    <h3>
      <span class="text-xs">{formatDate(transcript.date)} - {formatTime(transcript.duration)} long</span>
    </h3>
    audioplayer
    <Transcript lines={transcript.lines} />
  </div>
</div>

<Actions transcript={transcript} />
{/if}