<script>
import { data } from "../data/localStore.js";
import { InlineLoading } from "carbon-components-svelte";

let globalData;
data.subscribe((thing) => globalData = thing);
let progressBar = false;

const getGameOpts = async () => {
    return { 
        clientName: globalData.client,
        memory: globalData["memory"]+"M",
        authentication: getAuth(),
        maxSockets: 10,
        online: !globalData["skipMods"] || true,
    }
}

const getAuth = () => {
    return globalData["users"][globalData.selectedIndex].data;
}
</script>

<main>
    {#if globalData.selected == "e"}
        <button class="disabled inline">Login First!</button>
    {:else}
        <button class="launch inline" on:click={async () => {
            progressBar = true;
            const opts = await getGameOpts();
            window.please.get("startClient", [opts, globalData]).then(() => {
                progressBar = false;
            });
        }}>LAUNCH {globalData.client}
        </button>
    {/if}

    {#if progressBar}
        <InlineLoading status="active" description="Loading..." />
    {/if}
</main>

<style>
main {
    display: flex;
    align-items: center;
    justify-content: center;
}
.inline {
    padding: 25px;
    width: 350px;
    height: 65px;
    background-color: #1f2020;
    transition-timing-function: ease-in-out;
    color: rgba(255, 255, 255, 0.503);
    border-radius: 10px;
    transition: all .8s;
}

button.launch {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #1f2020;
    color: rgba(237, 252, 232, 0.868);
    font-size: 25px;
    font-weight: bold;
    transition: all .8s;
    box-shadow: 0 5px 42px rgba(105, 255, 133, 0.743);
    background-color: rgb(52, 164, 93);
    transition: all 0.3s ease-in-out;
    text-shadow: 0 .1em 0.2em rgba(0,0,0,0.35);
}

button.launch:hover {
    background-color:rgb(3, 156, 47);
    color:rgba(255, 255, 255, 0.911);
    box-shadow: 0 3px 22px rgba(105, 255, 133, 0.743);
    transform: scale(1.0333);
}
</style>