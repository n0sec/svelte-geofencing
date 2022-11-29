<script lang="ts">
	import '$lib/app.css';
	import type { LayoutData, PageData } from './$types';

	export let data: PageData;
</script>

<!-- ? Why is there an error here?-->
{#if data.result}
	<title>Geolocation - {data.result.id}</title>
{:else}
	<title>Geolocation - Error</title>
{/if}

<main>
	<slot />
</main>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
</style>
