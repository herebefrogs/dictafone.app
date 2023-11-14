<script>
  import { page } from '$app/stores';
  import { formatDate } from '$lib/helpers/format'
  import { transcripts } from '$lib/stores/persistence';
  import Loading from '$lib/components/Loading.svelte';
  import Transcript from '$lib/components/Transcript.svelte';
  import Duration from '$lib/components/Duration.svelte';
  import Actions from './Actions.svelte';
  
  let transcript;

  transcripts.subscribe(() => { transcript = transcripts.get($page.params.id) });
</script>

{#if !transcript}
<Loading />
{:else}
<h2 class="text-xl font-bold mx-4 mt-4 capitalize">
  {transcript.name}
</h2>
<h3>
  <span class="text-xs m-4">{formatDate(transcript.date)}</span>
</h3>

<div class="container flex flex-col sm:flex-row p-4 gap-5">
  <Duration value={transcript.duration} />

  {#if transcript.audio}
  <div class="container rounded-lg p-4 shadow-md">
    <h2 class="mb-2">Audio</h2>
    <audio src={URL.createObjectURL(transcript.audio)} controls></audio>
  </div>
  {/if}
</div>

<Transcript lines={transcript.lines} />

<Actions transcript={transcript} />
{/if}
