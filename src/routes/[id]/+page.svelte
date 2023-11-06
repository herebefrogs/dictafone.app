<script>
  import { page } from '$app/stores';
  import { formatDate } from '$lib/helpers/format'
  import { transcripts } from '$lib/stores/persistence';
  import Transcript from '$lib/components/Transcript.svelte';
  import Actions from './Actions.svelte';

  let transcript;

  transcripts.subscribe(() => transcript = transcripts.get($page.params.id));
</script>

{#if transcript}
<h1>{transcript.name}</h1>
<h2>{formatDate(transcript.date)}</h2>

duration, audioplayer

<Transcript transcript={transcript.transcript} />

<Actions id={transcript.id} />
{:else}
<span class="loading loading-dots loading-lg"></span>
{/if}