<script>
  import Actions from './Actions.svelte';
  import Transcript from './Transcript.svelte';
  import { transcript } from './dictation';
  import { time } from './time';
  import { formatDuration } from '$lib/helpers/format';
</script>
<!--
  p>there will all the components for a new transcript</p>
transcript,
duration counter,
volume meter,

language selector
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
</svg>
-->
<div class="stats shadow w-64">
  <div class="stat">
    <div class="stat-title">Duration</div>
    <div class="stat-value">{formatDuration($time)}</div>
  </div>
</div>

<Transcript transcript={$transcript} />
 
<Actions />
