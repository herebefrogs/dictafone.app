<script>
  import Actions from './Actions.svelte';
  import NameModal from './NameModal.svelte';
  import Transcript from '$lib/components/Transcript.svelte';
  import MicLevel from './MicLevel.svelte';
  import LanguageSelector from './LanguageSelector.svelte';
  import Duration from '$lib/components/Duration.svelte';
  import { lines } from '$lib/stores/transcript';
  import { time } from './time';
  import { formatDuration } from '$lib/helpers/format';
  import { isAndroid } from '$lib/helpers/mobile';
</script>

<div class="container flex flex-col sm:flex-row m-4 gap-5">
  <Duration value={$time} />

  <LanguageSelector />

  {#if !isAndroid}
    <!-- this causes speech recognition to stop working on Chrome for Android -->
    <MicLevel />
  {/if}
</div>

<Transcript lines={$lines} />

<!-- HACK: add enough padding at the bottom of the page that the
  Actions bottom nav won't mask the last lines of the Transcript -->
<div class="h-16" />

<NameModal />

<Actions />
