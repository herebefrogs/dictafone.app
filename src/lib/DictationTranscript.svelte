<script>
  import { transcript } from "./transcript";
  import { formatTime } from "./helpers/format";
</script>

<section>
  {#each $transcript as line}
    <ul>
      <li>{formatTime(line.start_time)}</li>
      <li>{line.text}</li>
      <li>{formatTime(line.end_time)}</li>
    </ul>
  {/each}
</section>

<style>
  ul, li {
    list-style: none;
  }
</style>