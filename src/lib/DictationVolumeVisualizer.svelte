<script>
  import { volume } from "./microphoneVolume";
  import { paused, started } from "./dictation";

  $: enabled = $started && !$paused;
  $: borderWidth = ($volume / 100 * 13 + 2) + "px";
  $: size = (20 - $volume / 100 * 5) + "px";
</script>

<div>
  <div
    class:enabled
    style:border-width={borderWidth}
    style:width={size}
    style:height={size}
  >
    &nbsp;
  </div>
</div>

<style>
  div {
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  div div {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    color: #E3F2FD; /* Material Design Blue 50 */
    background-color: #455A64;  /* Material Design Blue Gray 700 */
    border: solid #B0BEC5; /* Material Design Blue Gray 200 */
  }
  .enabled {
    background-color: #2962FF;  /* Material Design Blue A700 */
    border: solid #BBDEFB; /* Material Design Blue 100 */
  }
</style>

