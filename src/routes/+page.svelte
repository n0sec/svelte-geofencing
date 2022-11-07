<script lang="ts">
    import type { PageData } from './$types';
    export let data: PageData;
</script>
<div class="container mx-auto">
    <form action="post" class="grid grid-flow-col cols-auto items-center justify-evenly">
        <div class="rounded-md shadow-sm">
            <label for="latitude" class="text-sm font-medium text-gray-400 block">Latitude:</label>
            <input type="text" id="latitude" name="latitude" placeholder="Latitude" class="rounded-md shadow-sm px-3 py-1 text-neutral-700 hover:ring-1 focus:ring-1 ring-gray-500" required>
        </div>

        <div class="rounded-md shadow-sm ">
            <label for="longitude" class="text-sm font-medium text-gray-400 block">Longitude:</label>
            <input type="text" id="longitude" name="longitude" placeholder="Longitude" class="rounded-md shadow-sm px-3 py-1 text-neutral-700 hover:ring-1 focus:ring-1 ring-gray-500" required>
        </div>

        <div class="rounded-md shadow-sm ">
            <label for="radius" class="text-sm font-medium text-gray-400 block">Radius:</label>

            <input type="text" id="radius" name="radius" placeholder="Radius" class="rounded-md shadow-sm px-3 py-1 text-neutral-700 hover:ring-1 focus:ring-1 ring-gray-500" required>
        </div>

        <div class="rounded-md shadow-sm ">
            <label for="note" class="text-sm font-medium text-gray-400 block">Note:</label>
            <input type="text" id="note" name="note" placeholder="Note" class="rounded-md shadow-sm px-3 py-1 text-neutral-700 hover:ring-1 focus:ring-1 ring-gray-500">
        </div>

        <div class="items-center justify-center align-middle">
            <input type="submit" value="Plot" class="bg-gray-600 rounded-full shadow-sm hover:bg-gray-700 px-4 cursor-pointer">
        </div>
    </form>      
</div>

<div class="container mx-auto mt-10">
    <h1>Placeholder for Map</h1>
    <div id="map"></div>
</div>

<svelte:head>
    <script src={data.mapUrl} defer></script>
</svelte:head>
