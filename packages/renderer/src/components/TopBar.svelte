<script>
    // No scripting here... yet! :)
</script>

<main class="bg">
    <!-- <button on:click={() => {
        window.please.send("window","resize");
        console.log("executed");
    }}>❏</button> -->
    <button on:click={() => window.please.send("window","minimize")}>🗕</button>
    <button on:click={() => window.please.send("window","destroy")}>❌</button>
</main>

<style>
button {
    -webkit-app-region: no-drag;
}
main {
    display: flex;
    justify-content: right;
    align-items:center;
    flex-wrap: wrap;
    color: white;
    font-size: 1.5rem;
    margin-right: 6px;
    margin-top: 4.4px;
}

button {
    border-radius: 8px;
    background-color: brown;
    width: 30px;
    height: 30px;
    display: block;
    text-align: center;
    line-height: 1em;
    margin-left: 4.4px;
}
</style>
