<script lang="ts">
	import '$lib/app.css';
	import type { LayoutData } from './$types';

	export let data: LayoutData;
</script>

<title>Geolocation - {data.result.id}</title>

<main>
	<slot />
</main>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
</style>
