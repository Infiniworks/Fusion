<script>
    import { data } from "../data/localStore.js";
    import { InlineLoading } from "carbon-components-svelte";
    import Login from "./Login.svelte";

    let globalData;
    let progressBar = "false";
    let progressStatus = "";

    data.subscribe((thing) => globalData = thing);

    const getGameOpts = async () => {
        if (globalData["users"][globalData.selectedIndex]==undefined) {
            return {
                result: "error",
                reason: "Not Logged In.",
            }
        } else {
            return { 
                clientName: globalData.client,
                memory: globalData["memory"]+"M",
                authentication: getAuth(),
                maxSockets: 10,
                resourcePackSlot: globalData?.resourcePackSlot || 0,
                shaderPackSlot: globalData?.shaderPackSlot || 0,
                configSlot: globalData?.configSlot || 0,
                saveSlot: globalData?.saveSlot || 0,
            }
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
        <div class="button inline" on:click={async () => {
            progressBar = "true";
            const opts = await getGameOpts();
            if (typeof opts.result !== "undefined") {
                progressStatus = opts.reason;
                progressBar = opts.result;
            } else {
                window.please.get("startClient", [opts, globalData]).then((result) => {
                    if (result == "failed") {
                        progressStatus = "Failed: " + result;
                        progressBar = "failed";
                    }
                    else if (result == "success") {
                        progressStatus = "Loaded!";
                        progressBar = "finished";
                    } else {
                        progressBar = "finished";
                        progressStatus = "We don't know how we got here...";
                    }
                });
            }
        }}>
            <span class="title">LAUNCH {globalData.client}</span>
            {#key globalData.client}
            {#await window.please.get("data", globalData)}
            Loading Client Data...
            {:then results}
            <span class="game">
                {#if progressBar != "false"}
                    <span class="InlineLoading">
                        <InlineLoading status={progressBar == "true" ? "active" : progressBar} description={progressBar == "true" ? "Loading..." : progressStatus} />   
                    </span>
                {:else}
                    <img class="image" alt={results.name} width="13" src="../../images/iBox.png"/>
                    {results.name}
                {/if}
            </span>
            {:catch error}
            {error}
            {/await}
            {/key}
        </div>
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

.button {
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #1f2020;
    color: #f7f7f7;
    transition: all .8s;
    box-shadow: 0px 0px 20px rgba(105, 255, 133, 1);
    background-color: rgb(40, 175, 85);
    transition: all 0.3s ease-out;
    flex-direction: column;
}

.button:hover {
    background-color:rgb(40, 175, 85);
    color:rgb(247, 247, 247);
    box-shadow: 0 0px 30px rgba(105, 255, 133, 0.743);
    transform: scale(1.1);
}

.title {
    font-size: 25px;
    font-weight: bold;
    letter-spacing: 1.2px;
    text-shadow: 0 0.1em 0.2em rgba(0,0,0,0.35);
}

.game {
    display: inline-block;
    font-size: 12px;
    letter-spacing: 1.5px;
    transform: translateY(-6px);
    text-shadow: 0 0.1em 0.2em rgba(0,0,0,0.35);
}
.image {
    filter: brightness(0) saturate(100%) invert(100%) sepia(22%) saturate(1%) hue-rotate(49deg) brightness(109%) contrast(101%);
    display: inline; 
    transform: translateY(-0.6px);
    margin: 0 5px;
}
.InlineLoading {
    transform: translateY(-0.6px);
}
</style>