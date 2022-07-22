<script>
</script>

<main class="bg-cyan-800">
    <button on:click={() => {window.api.titlebar("resize");} }>❏</button>
    <button on:click={() => window.api.titlebar("destroy")}>🞭</button>
</main>

<style>
button {
    -webkit-app-region: no-drag;
}
main {
    display: flex;
    justify-content: right;
    flex-wrap: wrap;
    color: white;
    /* background-color: #000000; */
}
</style>
