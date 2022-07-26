<script>
</script>

<main class="bg-cyan-800">
    <button on:click={() => window.please.send("window","resize") }>❏</button>
    <button on:click={() => window.please.send("window","destroy")}>🞭</button>
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
    box-shadow: 0 0 5px rgba(0,0,0,0.75);
	clip-path: inset(0px 0px -5px 0px);
}
</style>
