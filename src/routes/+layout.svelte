<script>
    import "../app.css";
    const currentYear = new Date().getFullYear();
</script>

<header>
    <title>Geofencing Test</title>
    <nav class="bg-gray-700 drop-shadow-md px-6 mb-6 items-center align-middle grid grid-cols-2 h-14">
        <h1 class="text-2xl heading-title"><a href="/">Geofencing Test</a></h1>
        <a href="about" class="col-end-7">About</a>
    </nav>
</header>

<main>
    <slot></slot>
</main>
<div class="absolute bottom-0 w-full bg-gray-700 px-6 items-center align-middle grid grid-cols-2 h-14 drop-shadow-md">
    <footer>&copy; {currentYear}</footer>
</div>

<style>
    @import url('https://fonts.googleapis.com/css2?family=Roboto&display=swap');
</style>