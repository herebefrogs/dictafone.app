<script>
  import { micLevel } from './micLevel';
  import { paused, started } from '$lib/stores/transcript';

  $: enabled = $started && !$paused;
  // clamp micLevel between 0 and ~40
  $: height = 2 + 8*Math.log1p($micLevel) + 'px';
  $: width = 50 - 8*Math.log1p($micLevel) + 'px';
</script>

<div class="container bg-base-100 p-4 rounded-lg shadow-md w-80">
  <div>Mic Level</div>
    <div class="flex justify-center h-12 items-center">
      <div
        class:bg-accent={enabled}
        style:width
        style:height
      >
    </div>
  </div>
</div>
