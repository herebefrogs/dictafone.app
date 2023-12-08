<script>
	import { page } from '$app/stores';
  import Alert from '$lib/components/Alert.svelte';
</script>

<Alert message="{page.status} {page.error.message}" klass="mt-8" />

<a href="/" class="link">Back to homepage</a>