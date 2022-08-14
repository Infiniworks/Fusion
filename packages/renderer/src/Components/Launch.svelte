<script>
import { selectedUser, versions, modDisabling } from "../data/localStore";
import { InlineLoading } from "carbon-components-svelte";
import Login from "./Login.svelte";

let selected, version, modsDisabled;
selectedUser.subscribe((thing) => selected = thing);
versions.subscribe((thing) => version = thing);
modDisabling.subscribe((thing) => modsDisabled = thing);

let progressBar = false;

const getGameOpts = async () => {
    return { 
        modloader: localStorage.getItem("modloader"),
        clientName: localStorage.getItem("version"),
        version: localStorage.getItem("version"),
        memMax: localStorage.getItem("maxMemory")+"M",
        memMin: localStorage.getItem("minMemory")+"M",
        authentication: getAuth(),
        maxSockets: 10,
        skipMods: modsDisabled || false,
    }
}

const getAuth = () => {
    return JSON.parse(localStorage.getItem("users"))[selected];
}
</script>


<main>
    {#if selected == "e"}
        <button class="disabled inline">Login First!</button>
    {:else}
        <button class="launch inline" on:click={async () => {
            progressBar = true;
            window.please.get("startClient", await getGameOpts()).then(() => {
                progressBar = false;
            });
        }}>LAUNCH {version}
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