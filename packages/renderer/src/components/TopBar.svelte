<script>
</script>

<main class="bg">
    <h2 class="centered">FUSION CLIENT</h2>
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
.centered {
    display: inline-block;
    position: absolute;
    justify-content: left;
    width: 100%;
    text-align: center;
    font-size: 22px;
    font-weight: bold;
}
.bg {
    background: linear-gradient(-45deg, #ee7752, #e73c7e, #23a6d5, #23d5ab);
    background-size: 400% 400%;
    padding: 0.5rem 1.5rem;
    animation: gradient 15s ease infinite;
    font-variation-settings: 'wght' 500;
    height: auto;
    border-radius: 0px 0px 0px 0px;
    border: none;
    color: white;
    font-size: 1.25rem;
    box-shadow: none;
    transform: scale(1);
    margin: 0 0 0rem 0rem;
}
@keyframes gradient {
    0% {
        background-position: 0% 50%;
    }
    50% {
        background-position: 100% 50%;
    }
    100% {
        background-position: 0% 50%;
    }
}
</style>
