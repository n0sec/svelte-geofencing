<script>
    import "../app.css";
    const currentYear = new Date().getFullYear();
</script>

<header>
    <title>PlotD</title>
    <nav class="bg-gray-700 drop-shadow-md px-6 mb-6 items-center align-middle justify-between flex h-14 gap-5">
        <h1 class="text-2xl heading-title"><a href="/">PlotD</a></h1>
        <div class="space-x-8">
            <a href="about">About</a>
            <!-- TODO: Implement dark mode toggle-->
            <input type="checkbox" name="darkMode" id="darkMode">
        </div>
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