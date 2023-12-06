<script>
  import Alert from '$lib/components/Alert.svelte';
  import Transcript from '$lib/components/Transcript.svelte';
  import Duration from '$lib/components/Duration.svelte';
  import Actions from './Actions.svelte';
  import LanguageSelector from './LanguageSelector.svelte';
  import MicLevel from './MicLevel.svelte';
  import NameModal from './NameModal.svelte';
  import { isAndroid } from '$lib/helpers/mobile';
  import { lines } from '$lib/stores/transcript';
  import { micPermission } from './micPermission';
  import { time } from './time';
</script>

{#if $micPermission === "denied"}
  <div class="container p-4">
    <Alert message="Dictafone requires access to your microphone, which is currently blocked. Please grant or reset the microphone permission." />
  </div>
{/if}

<div class="container flex flex-col sm:flex-row p-4 gap-5">
  <Duration value={$time} />

  <LanguageSelector />

  {#if !isAndroid}
    <!-- prevent audio recorder to block speech recognition from working on Chrome for Android -->
    <MicLevel />
  {/if}
</div>

<Transcript lines={$lines} />

<NameModal />

<Actions />
