<script>
</script>

<main class="bg-cyan-800">
    <button on:click={() => window.please.send("resize") }>❏</button>
    <button on:click={() => window.please.send("destroy")}>🞭</button>
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
