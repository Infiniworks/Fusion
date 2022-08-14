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

{#if selected == "e"}
<button class="disabled">"Login First!"</button>
{:else}
<button class="launch" on:click={async () => {
    progressBar = true;
    window.please.get("startClient", await getGameOpts()).then(() => {
        progressBar = false;
    });
}}>LAUNCH {version}</button>
{/if}



<!--{#key selected}
    <img class="userHead" alt="Minecraft Head" src="https://crafthead.net/avatar/{selected}"/>
{/key}-->

{#if progressBar}
<InlineLoading status="active" description="Loading..." />
{/if}

<style>
.userHead {
    width: 100%;
}
button {
    padding: 30px;
}
button.launch {
    background-color: #16a34a;
    color: rgb(197, 197, 197);
    font-size: 23px;
    font-weight: bold;
    width: 100%;
    height: 100%;
    transition-timing-function: ease-in-out;
    transition: all .8s;
    box-shadow: 0 0 1px rgba(0,0,0,0.75);
    clip-path: inset(0px 0px -15px 0px);
}

button.launch:hover {
    background-color: #0ac850;
    color: #ffffff;
    box-shadow: 0 0 10px rgba(0,0,0,0.75);
    clip-path: inset(0px 0px -10px 0px);
}

button.disabled {
    background-color: #a31616;
    color: rgb(197, 197, 197);
    width: 100%;
    height: 100%;
    transition-timing-function: ease-in-out;
    transition: all .8s;
    box-shadow: 0 0 1px rgba(0,0,0,0.75);
    clip-path: inset(0px 0px -15px 0px);
}
</style>