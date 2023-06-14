<script>
  import { volume } from "./microphoneVolume";

  $: width = ($volume / 100 * 13 + 2) + "px";
</script>

<div>
  <div style:border-width={width}>
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
    width: 10px;
    height: 10px;
    background-color: #2962FF;  /* Material Design Blue A700 */
    color: #E3F2FD; /* Material Design Blue 50 */

    border-radius: 50%;
    border: solid #BBDEFB; /* Material Design Blue 100 */
    /* border-color:  #B0BEC5; /* Material Design Blue Gray 200 */
  }
</style>

