<script lang="ts">
	import type { PlotCircle } from '$lib/types/PlotCircle';
	let L: typeof import('leaflet');
	let map: L.Map;

	async function loadMap(node: HTMLElement) {
		// Import the library
		L = await import('leaflet');

		// Create the Google Sat Layer
		let googleSatLayer = L.tileLayer('http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}', {
			maxZoom: 20,
			attribution: '&copy; <a href="https://google.com">Google</a>',
			subdomains: ['mt0', 'mt1', 'mt2', 'mt3']
		});

		// Create the OpenStreet Tile Layer
		let openStreetLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
			maxZoom: 19,
			attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
		});

		// Create the map
		map = L.map('map', {
			center: [42.614689, -71.324092],
			zoom: 15,
			layers: [googleSatLayer, openStreetLayer]
		});

		// Create the Layer Names in UI
		let baseMaps = {
			'Google Satelite': googleSatLayer,
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

	let latitude: any;
	let longitude: any;
	let radius: any;
	let note: any;
	let color = '#ff0000';

	let plottedPoints: PlotCircle[];

	/**
	 * Draws a circle on the map from the entered coordinates
	 * Sets the view to the coordinates
	 */
	function plot(): void {
		let plottedPoint: PlotCircle = {
			latitude: latitude,
			longitude: longitude,
			radius: radius,
			color: color,
			note: note
		};
		// Draw the circle given the latitude, longitude, color and radius and add it to the map
		L.circle([plottedPoint.latitude, plottedPoint.longitude], {
			color: plottedPoint.color,
			radius: plottedPoint.radius
		}).addTo(map);

		// Set the current view to the latitude and longitude
		map.setView([plottedPoint.latitude, plottedPoint.longitude]);

		plottedPoints.push(plottedPoint);
	}

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

<div class=" md:flex h-[88vh] mx-6">
	<form method="post" class="mx-6">
		<div class="rounded-md shadow-sm">
			<label for="latitude" class="text-sm font-medium text-gray-400 block">Latitude:</label>
			<input
				type="number"
				bind:value={latitude}
				id="latitude"
				name="latitude"
				placeholder="51.505"
				class="rounded-md shadow-sm text-sm px-3 py-1 text-neutral-700 hover:ring-1 focus:ring-1 ring-gray-500"
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
				placeholder="-35.603"
				class="rounded-md shadow-sm text-sm px-3 py-1 text-neutral-700 hover:ring-1 focus:ring-1 ring-gray-500"
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
				class="rounded-md shadow-sm text-sm px-3 py-1 text-neutral-700 hover:ring-1 focus:ring-1 ring-gray-500"
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
				class="rounded-md shadow-sm text-sm px-3 py-1 text-neutral-700 hover:ring-1 focus:ring-1 ring-gray-500"
			/>
		</div>

		<div class="rounded-md shadow-sm mt-3">
			<label for="color" class="text-sm font-medium text-gray-400 block">Color:</label>
			<input
				type="color"
				bind:value={color}
				id="color"
				name="color"
				class="rounded-md shadow-sm text-sm px-3 w-full py-1 text-neutral-700 hover:ring-1 focus:ring-1 ring-gray-500"
			/>
		</div>

		<div class="items-center justify-center align-middle">
			<input
				type="submit"
				on:click|preventDefault={plot}
				value="Plot"
				class="bg-gray-600 rounded-full text-sm shadow-sm hover:bg-gray-700 focus:ring-gray-300 focus:ring-2 p-1 w-full mt-6 cursor-pointer"
			/>
			<button
				type="button"
				on:click={resetForm}
				value="Reset Form"
				class="bg-gray-600 rounded-full text-sm shadow-sm hover:bg-gray-700 focus:ring-gray-300 focus:ring-2 p-1 w-full mt-6 cursor-pointer"
				>Reset Form</button
			>
			<button
				type="button"
				value="Clear Map"
				name="clearMap"
				class="bg-gray-600 rounded-full text-sm shadow-sm hover:bg-gray-700 focus:ring-gray-300 focus:ring-2 p-1 w-full mt-6 cursor-pointer"
				>Clear Map</button
			>
		</div>
	</form>
	<table class="table-auto">
		<thead>
			<tr>
				<th>Latitude</th>
				<th>Longitude</th>
				<th>Radius</th>
				<th>Color</th>
				<th>Note</th>
			</tr>
		</thead>
	</table>
	<div id="map" class="overflow-hidden flex w-full" use:loadMap />
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
