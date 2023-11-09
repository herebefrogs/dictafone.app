<script>
  import Actions from './Actions.svelte';
  import NameModal from './NameModal.svelte';
  import Transcript from '$lib/components/Transcript.svelte';
  import MicLevel from './MicLevel.svelte';
  import LanguageSelector from './LanguageSelector.svelte';
  import { lines } from '$lib/stores/transcript';
  import { time } from './time';
  import { formatDuration } from '$lib/helpers/format';
  import { isAndroid } from '$lib/helpers/mobile';
</script>

<div class="card mt-4 w-full bg-base-100 shadow-md">
  <div class="card-body">

    <div class="flex">
      <div class="stats shadow w-80 mr-8">
        <div class="stat ">
          <div class="stat-title">Duration</div>
          <div class="stat-value font-mono">{formatDuration($time)}</div>
        </div>
      </div>

      <LanguageSelector />

      {#if !isAndroid}
        <!-- this causes speech recognition to stop working on Chrome for Android -->
        <MicLevel />
      {/if}
    </div>

    <Transcript lines={$lines} />
  </div>
</div>
<NameModal />

<Actions />
