<script>
  import { formatDuration } from '$lib/helpers/format';

  export let value;
</script>

<div class="container bg-base-100 p-4 rounded-lg shadow-md">
  <div>Duration</div>
  <div class="text-3xl font-mono text-right">{formatDuration(value)}</div>
</div>