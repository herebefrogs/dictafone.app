<script>
  import { time } from './time';
  import { lang } from './lang';

  const timeFormater = Intl.NumberFormat($lang, { maximumFractionDigits: 1, minimumFractionDigits: 1 })
</script>

<div>
  <section>Duration: {timeFormater.format($time)}</section>
</div>

<style>

</style>
