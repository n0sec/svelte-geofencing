<script>

</script>

<div class="grid grid-flow-col auto-cols-max col-auto">
    <form action="post">
        <label for="latitude" class="text-sm font-medium text-gray-400">Latitude:</label>
        <div class="rounded-md shadow-sm hover:ring-1 focus:ring-1 ring-gray-500">
            <input type="text" id="latitude" name="latitude" placeholder="Latitude" class="rounded-md shadow-sm px-3 py-1 text-neutral-700 focus:ring-gray-500" required>
        </div>

        <label for="longitude" class="text-sm font-medium text-gray-400">Longitude:</label>
        <div class="rounded-md shadow-sm hover:ring-1 focus:ring-1 ring-gray-500">
            <input type="text" id="longitude" name="longitude" placeholder="Longitude" class="rounded-md shadow-sm px-3 py-1 text-neutral-700 focus:ring-gray-500" required>
        </div>

        <label for="radius" class="text-sm font-medium text-gray-400">Radius:</label>
        <div class="rounded-md shadow-sm hover:ring-1 focus:ring-1 ring-gray-500">
            <input type="text" id="radius" name="radius" placeholder="Radius" class="rounded-md shadow-sm px-3 py-1 text-neutral-700 focus:ring-gray-500" required>
        </div>

        <label for="note" class="text-sm font-medium text-gray-400">Note:</label>
        <div class="rounded-md shadow-sm hover:ring-1 focus:ring-1 ring-gray-500">
            <input type="text" id="note" name="note" placeholder="Note" class="rounded-md shadow-sm px-3 py-1 text-neutral-700 focus:ring-gray-500">
        </div>


        <input type="submit" value="Plot" class="bg-gray-600 rounded-full shadow-sm hover:bg-gray-700 px-4 cursor-pointer">
    </form>    
</div>
