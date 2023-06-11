<script>
  import { lang, LANGUAGES } from "./lang";
</script>

<select bind:value={$lang}>
  {#each LANGUAGES as lang_code}
    <option value={lang_code} selected={lang_code === $lang}>{lang_code}</option>
  {/each}
</select>