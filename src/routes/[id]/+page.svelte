<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	let points = JSON.parse(data.result.point_string);
	console.log(typeof points);
</script>

<h1>{points}</h1>
