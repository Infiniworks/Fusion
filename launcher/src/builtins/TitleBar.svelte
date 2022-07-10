
<main>
    <button class="launch" on:click={() => window.api.titlebar("resize")}>+</button>
    <button on:click={() => window.api.titlebar("destroy")}>X</button>
</main> 

<style>
button {
    border-radius: 5px;
    float: right;
    text-align: center;
    padding:15px;
    -webkit-app-region: no-drag;
}
</style>