<script lang="ts">
	import type { PageData } from './$types';
	import { onDestroy, onMount } from 'svelte';
	import type { PlotCircle } from '$lib/types/PlotCircle';

	export let data: PageData;

	let points = JSON.parse(data.result.point_string);

	let mapElement: HTMLElement;
	let map: L.Map;

	onMount(async () => {
		const L = await import('leaflet');

		let openStreetLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		});

		let googleSat = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
			maxZoom: 19,
			subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
			attribution: '&copy; <a href="http://www.google.com">Google</a>'
		});

		let googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
			maxZoom: 15,
			subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
			attribution: '&copy; <a href="http://www.google.com">Google</a>'
		});

		map = L.map(mapElement, {
			center: [42.614689, -71.324092],
			zoom: 15
		});

		L.control
			.layers(
				{
					'Open Street Map': openStreetLayer,
					'Google Satellite': googleSat,
					'Google Streets': googleStreets
				},
				undefined,
				{
					collapsed: false
				}
			)
			.addTo(map);
		openStreetLayer.addTo(map);

		points.forEach((point: PlotCircle) => {
			L.circle([point.latitude as number, point.longitude as number], {
				color: point.color as string,
				radius: point.radius as number
			}).addTo(map);
			map.fitWorld();
		});
	});

	onDestroy(async () => {
		if (map) {
			console.log('Unloading Leaflet map.');
			map.remove();
		}
	});
</script>

<svelte:head>
	{#if !data || data === undefined}
		<title>Geolocation - Error</title>
	{:else}
		<title>Geolocation - {data.result?.id}</title>
	{/if}
</svelte:head>

<div class="grid grid-cols-2 gap-3 mx-6 h-screen">
	<!-- * Table Component * -->
	<div class="overflow-x-auto relative col-start-1 border-gray-400">
		<table class="w-full text-sm table-auto border-collapse border text-left">
			<thead class="uppercase text-xs bg-gray-600">
				<tr>
					<th class="py-2 px-6" scope="col">Latitude</th>
					<th class="py-2 px-6" scope="col">Longitude</th>
					<th class="py-2 px-6" scope="col">Radius</th>
					<th class="py-2 px-6" scope="col">Note</th>
					<th class="py-2 px-6" scope="col">Color</th>
				</tr>
			</thead>
			<tbody class="text-sm">
				{#each points as mapPoint}
					<tr class="text-sm bg-gray-700 hover:bg-gray-800">
						<td class="py-3 px-6">{mapPoint.latitude}</td>
						<td class="py-3 px-6">{mapPoint.longitude}</td>
						<td class="py-3 px-6">{mapPoint.radius}</td>
						<td class="py-3 px-6">{mapPoint.note ?? 'None'}</td>
						<td class="py-3 px-6"
							><div class="w-4 h-4" style:background-color={mapPoint.color} />
							({mapPoint.color})</td
						>
						<td /></tr
					>
				{/each}
			</tbody>
		</table>
	</div>

	<div id="map" class="overflow-hidden col-start-2" bind:this={mapElement} />
</div>
