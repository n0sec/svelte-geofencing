<script lang="ts">
	import '$lib/app.css';
	import type { PageData } from './$types';

	export let data: PageData;
</script>

<title>Shared Plotted Points</title>

<main>
	<slot />
</main>

<style>
	@import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
</style>
