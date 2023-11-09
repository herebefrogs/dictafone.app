<script>
  import { micLevel } from './micLevel';
  import { paused, started } from '$lib/stores/transcript';

  $: enabled = $started && !$paused;
  // clamp micLevel between 0 and ~40
  $: height = 2 + 8*Math.log1p($micLevel) + 'px';
  $: width = 50 - 8*Math.log1p($micLevel) + 'px';
</script>

<div class="stats shadow w-32 h-26">
  <div class="stat">
    <div class="stat-title">Mic Level</div>
    <div class="flex justify-around">
      <div
        class:bg-accent={enabled}
        style:width
        style:height
      >
    </div>
    </div>
  </div>
</div>