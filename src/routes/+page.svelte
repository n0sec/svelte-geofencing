<script lang="ts">
	import { browser } from '$app/environment';
	import { createStore } from '$lib/points';
	import type { PlotCircle } from '$lib/types/PlotCircle';
	let L: typeof import('leaflet');
	let map: L.Map;

	async function loadMap(node: HTMLElement) {
		// Import the library
		L = await import('leaflet');

		// Create the Google Sat Layer
		// let googleSatLayer = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
		// 	maxZoom: 20,
		// 	attribution: '&copy; <a href="https://google.com">Google</a>',
		// 	subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
		// });

		// Create the OpenStreet Tile Layer
		let openStreetLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		});

		// Create the map
		map = L.map('map', {
			center: [42.614689, -71.324092],
			zoom: 15,
			layers: [openStreetLayer]
		});

		// Create the Layer Names in UI
		let baseMaps = {
			// 'Google Satelite': googleSatLayer,
			'Open Street Map': openStreetLayer
		};

		L.control.layers(baseMaps).addTo(map);

		return {
			destroy() {
				// the node has been removed from the DOM
				map.remove();
			}
		};
	}

	if (browser) {
	}
	// Define the values used in the bind for the inputs
	// We need the Union Types here so that it plays nice in the script and in the UI
	// The inputs render
	let latitude: number | string;
	let longitude: number | string;
	let radius: number | string;
	let note: string;
	let color: string = '#ff0000';

	let plottedPoints: PlotCircle[] = [];

	function addPoint(point: PlotCircle) {
		plottedPoints = [...plottedPoints, point];
	}

	/**
	 * Draws a circle on the map from the entered coordinates
	 * Sets the view to the coordinates
	 */
	function plot(): void {
		let plottedPoint: PlotCircle = {
			latitude: latitude as number,
			longitude: longitude as number,
			radius: radius as number,
			note: note,
			color: color
		};
		// Draw the circle given the latitude, longitude, color and radius and add it to the map
		L.circle([plottedPoint.latitude, plottedPoint.longitude], {
			color: plottedPoint.color,
			radius: plottedPoint.radius
		}).addTo(map);

		// Set the current view to the latitude and longitude
		map.setView([plottedPoint.latitude, plottedPoint.longitude]).setZoom(15);

		// Add the point to the plottedPoints Array
		addPoint(plottedPoint);

		// Add the plottedPoint to Local Storage
		// This will be used to persist the data across refreshes
		plottedPoints.forEach(($point, index) => {
			createStore($point, index.toString());
		});

		/* ! Debugging */
		console.log(plottedPoints);
	}

	function clearMap(): void {}

	/**
	 * Resets the form
	 */
	function resetForm(): void {
		latitude = '';
		longitude = '';
		radius = '';
		note = '';
		color = '#ff0000'; // Leave this red as the default
	}
</script>

<div
	class="md:grid md:grid-cols-5 md:grid-rows-2 md:grid-flow-dense h-screen md:gap-x-3 md:gap-y-28 mx-6"
>
	<form method="post" class="col-span-2 justify-self-center">
		<div class="rounded-md shadow-sm">
			<label for="latitude" class="text-sm font-medium text-gray-400 block">Latitude:</label>
			<input
				type="number"
				bind:value={latitude}
				id="latitude"
				name="latitude"
				placeholder="28.582816"
				class="rounded-md shadow-sm text-sm px-3 py-1 w-full text-neutral-700 hover:ring-1 focus:ring-1 ring-gray-500"
				required
			/>
		</div>

		<div class="rounded-md shadow-sm mt-3">
			<label for="longitude" class="text-sm font-medium text-gray-400 block">Longitude:</label>
			<input
				type="number"
				bind:value={longitude}
				id="longitude"
				name="longitude"
				placeholder="-81.339941"
				class="rounded-md shadow-sm text-sm px-3 py-1 w-full text-neutral-700 hover:ring-1 focus:ring-1 ring-gray-500"
				required
			/>
		</div>

		<div class="rounded-md shadow-sm mt-3">
			<label for="radius" class="text-sm font-medium text-gray-400 block">Radius:</label>
			<input
				type="number"
				bind:value={radius}
				id="radius"
				name="radius"
				placeholder="200"
				class="rounded-md shadow-sm text-sm px-3 py-1 w-full text-neutral-700 hover:ring-1 focus:ring-1 ring-gray-500"
				required
			/>
		</div>

		<div class="rounded-md shadow-sm mt-3">
			<label for="note" class="text-sm font-medium text-gray-400 block">Note:</label>
			<input
				type="text"
				bind:value={note}
				id="note"
				name="note"
				placeholder="Known Place"
				class="rounded-md shadow-sm text-sm px-3 py-1 w-full text-neutral-700 hover:ring-1 focus:ring-1 ring-gray-500"
			/>
		</div>

		<div class="rounded-md shadow-sm mt-3">
			<label for="color" class="text-sm font-medium text-gray-400 block">Color:</label>
			<input
				type="color"
				bind:value={color}
				id="color"
				name="color"
				class="rounded-md shadow-sm text-sm px-3 py-1 w-full text-neutral-700 hover:ring-1 focus:ring-1 ring-gray-500"
			/>
		</div>

		<div class="items-center justify-center align-middle">
			<input
				type="submit"
				on:click|preventDefault={plot}
				value="Plot"
				class="bg-gray-600 rounded-md text-sm shadow-sm hover:bg-gray-700 focus:ring-gray-300 focus:ring-2 p-1 w-full mt-6 cursor-pointer"
			/>
			<button
				type="button"
				on:click={resetForm}
				value="Reset Form"
				name="resetForm"
				class="bg-gray-600 rounded-md text-sm shadow-sm hover:bg-gray-700 focus:ring-gray-300 focus:ring-2 p-1 w-full mt-6 cursor-pointer"
				>Reset Form</button
			>
			<button
				type="button"
				value="Clear Map"
				name="clearMap"
				class="bg-gray-600 rounded-md text-sm shadow-sm hover:bg-gray-700 focus:ring-gray-300 focus:ring-2 p-1 w-full mt-6 cursor-pointer"
				>Clear Map</button
			>
			<button
				type="button"
				value="Share"
				name="share"
				class="bg-gray-600 rounded-md text-sm shadow-sm hover:bg-gray-700 focus:ring-gray-300 focus:ring-2 p-1 w-full mt-6 cursor-pointer"
				>Share</button
			>
		</div>
	</form>
	<div
		class="overflow-x-auto relative md:rounded-tl-md md:rounded-tr-md col-start-1 col-span-2 self-start border border-gray-400"
	>
		<table class="w-full text-sm table-auto border-collapse text-left">
			<thead class="uppercase text-xs bg-gray-600">
				<tr>
					<th class="py-2 px-6" scope="col">Latitude</th>
					<th class="py-2 px-6" scope="col">Longitude</th>
					<th class="py-2 px-6" scope="col">Radius</th>
					<th class="py-2 px-6" scope="col">Note</th>
					<th class="py-2 px-6" scope="col">Color</th>
					<th />
				</tr>
			</thead>
			<tbody class="text-sm">
				{#each plottedPoints as { latitude, longitude, radius, note, color }}
					<tr class="text-sm bg-gray-700 border-b">
						<td class="py-3 px-6">{latitude}</td>
						<td class="py-3 px-6">{longitude}</td>
						<td class="py-3 px-6">{radius}</td>
						<td class="py-3 px-6">{note ?? 'None'}</td>
						<td class="py-3 px-6">{color}</td>
						<td
							><svg
								width="20"
								height="20"
								viewBox="0 0 24 24"
								class="fill-red-600 hover:fill-red-700"
								><path
									d="M6.4 19L5 17.6l5.6-5.6L5 6.4L6.4 5l5.6 5.6L17.6 5L19 6.4L13.4 12l5.6 5.6l-1.4 1.4l-5.6-5.6Z"
								/></svg
							></td
						>
					</tr>
				{/each}
			</tbody>
		</table>
	</div>
	<div id="map" class="overflow-hidden col-span-3 row-span-2" use:loadMap />
</div>

<svelte:head>
	<link
		rel="stylesheet"
		href="https://unpkg.com/leaflet@1.9.2/dist/leaflet.css"
		integrity="sha256-sA+zWATbFveLLNqWO2gtiw3HL/lh1giY/Inf1BJ0z14="
		crossorigin=""
	/>
	<script
		src="https://unpkg.com/leaflet@1.9.2/dist/leaflet.js"
		integrity="sha256-o9N1jGDZrf5tS+Ft4gbIK7mYMipq9lqpVJ91xHSyKhg="
		crossorigin=""
	></script>
</svelte:head>
