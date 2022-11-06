<script>
import { data } from "../data/localStore.js";
import { InlineLoading } from "carbon-components-svelte";

let globalData;
data.subscribe((thing) => globalData = thing);
let progressBar = false;

const getGameOpts = async () => {
    const version = globalData.version;
    return { 
        modloader: version.modloader,
        clientName: version.version,
        version: version.version,
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
            window.please.get("startClient", opts).then(() => {
                progressBar = false;
            });
        }}>LAUNCH {globalData.version.version}
        </button>
    {/if}

    {#if progressBar}
        <InlineLoading status="active" description="Loading..." />
    {/if}
</main>

<style>
.inline {
    padding: 7px;
    background-color: #1f2020;
    transition-timing-function: ease-in-out;
    color: rgba(255, 255, 255, 0.503);
    transition: all .8s;
}
button.launch {
    background-color: #1f2020;
    color: rgb(197, 197, 197);
    font-size: 18px;
    font-weight: bold;
    width: 100%;
    height: 100%;
    transition-timing-function: ease-in-out;
    transition: all .8s;
}
.body {
    width:50%;
}
button {
    padding: 30px;
    transition-timing-function: ease-in-out;
}


button.launch:hover {
    background-color: #0b8fb4;
    color: #ffffff;
}

button.disabled {
    background-color: #a31616;
    color: rgb(197, 197, 197);
}
</style>