<script lang="ts">
    import {onMount} from 'svelte';

    onMount(async () => {
        const L  = await import('leaflet');
        const map = L.map('map').setView([51.505, -0.09], 13);
        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);
    });
</script>
<div class="container mx-auto flex h-[82vh]">
    <form action="post" class="mx-6">
        <div class="rounded-md shadow-sm">
            <label for="latitude" class="text-sm font-medium text-gray-400 block">Latitude:</label>
            <input type="text" id="latitude" name="latitude" placeholder="51.505" class="rounded-md shadow-sm px-3 py-1 text-neutral-700 hover:ring-1 focus:ring-1 ring-gray-500" required>
        </div>

        <div class="rounded-md shadow-sm mt-3">
            <label for="longitude" class="text-sm font-medium text-gray-400 block">Longitude:</label>
            <input type="text" id="longitude" name="longitude" placeholder="-35.603" class="rounded-md shadow-sm px-3 py-1 text-neutral-700 hover:ring-1 focus:ring-1 ring-gray-500" required>
        </div>

        <div class="rounded-md shadow-sm mt-3">
            <label for="radius" class="text-sm font-medium text-gray-400 block">Radius:</label>

            <input type="text" id="radius" name="radius" placeholder="200" class="rounded-md shadow-sm px-3 py-1 text-neutral-700 hover:ring-1 focus:ring-1 ring-gray-500" required>
        </div>

        <div class="rounded-md shadow-sm mt-3">
            <label for="note" class="text-sm font-medium text-gray-400 block">Note:</label>
            <input type="text" id="note" name="note" placeholder="Known Place" class="rounded-md shadow-sm px-3 py-1 text-neutral-700 hover:ring-1 focus:ring-1 ring-gray-500">
        </div>

        <div class="items-center justify-center align-middle">
            <input type="submit" value="Plot" class="bg-gray-600 rounded-full shadow-sm hover:bg-gray-700 focus:ring-gray-300 focus:ring-2 p-1 w-full mt-6 cursor-pointer">
            <input type="reset" value="Reset" class="bg-gray-600 rounded-full shadow-sm hover:bg-gray-700 focus:ring-gray-300 focus:ring-2 p-1 w-full mt-6 cursor-pointer">
            <button type="button" value="Clear Map" name="clearMap" class="bg-gray-600 rounded-full shadow-sm hover:bg-gray-700 focus:ring-gray-300 focus:ring-2 p-1 w-full mt-6 cursor-pointer">Clear Map</button>

        </div>
    </form>
    <div id="map" class="overflow-hidden flex w-full"></div>
</div>

<svelte:head>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.2/dist/leaflet.css"
    integrity="sha256-sA+zWATbFveLLNqWO2gtiw3HL/lh1giY/Inf1BJ0z14="
    crossorigin=""/>
    <script src="https://unpkg.com/leaflet@1.9.2/dist/leaflet.js"
    integrity="sha256-o9N1jGDZrf5tS+Ft4gbIK7mYMipq9lqpVJ91xHSyKhg="
    crossorigin=""></script>
</svelte:head>
