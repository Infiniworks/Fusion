<script lang="ts">
    import "carbon-components-svelte/css/all.css";
    import { 
        Tile,
        Slider, Button,
        Tag, Tooltip, 
        Checkbox, Select, SelectItem, SelectItemGroup,
    } from "carbon-components-svelte";
    import { data } from "../data/localStore.js";
    
    $: document.documentElement.setAttribute("theme", "g90");
    
    let totalMem: any;
    let freeMem: number;
    
    let globalData: any;
    data.subscribe((thing) => globalData = thing);
    
    let clients: any, collections: any;
    
    const start = async() => {
        clients = await window.please.get("clients");
        collections = await window.please.get("collections");
        totalMem = await window.please.get("maxMemory", "M");
        freeMem = await window.please.get("freeMemory", "M");
        if (!globalData.memory) {
            globalData.memory = freeMem;
        }
        const returnV = {
            clients: clients,
            collections: collections,
        }
        return returnV;
    };
    
    $: data.update((thing) => thing = globalData);
    
    </script>
    
    <main>
        <div class="bigBox">
            <div class="header">
                <span class="title"><img class="image" alt="Information Symbol" width="23" src="../../images/iBox.png"/>CLIENT SETTINGS</span>
                <span class="gametext">MODIFY YOUR CLIENT SETTINGS FOR EPIC GAMING :)</span>
            </div>
            <div class="content">
                <div class="flexbox">
                    {#await start()}
                    Waiting for load
                    {:then values}
                    <div class="oop inline">
                        <Slider
                            invalid={globalData.memory >= freeMem}
                            labelText="Memory (MB)"
                            min={128}
                            max={totalMem}
                            maxLabel={totalMem+" MB"}
                            bind:value={globalData.memory}
                            step={10}
                        />
                        Using: {globalData.memory} MB
                    </div>
                    {/await}
                </div>
            </div>
        </div> 
    </main>
    
<style>
    main {
        height: 100%;
        display: flex;
        align-items: stretch;
        justify-content: center;
        align-content: stretch;
        flex-direction: column;
    }
    
    .flexbox {
        border-radius: 8px;
        padding: 15px;
        background-color: #181816;
        transition-timing-function: ease-in-out;
        color: rgba(255, 255, 255, 0.373);
        transition: all .8s;
    }
    
    .bigBox {
        display: flex;
        flex: 1 0 0;
        position: relative;
        bottom: 0px;
        margin: 20px 50px;

        border-radius: 6px;
        background-color: blue;

        align-items: stretch;
        justify-content: center;
        align-content: stretch;
        flex-direction: column;

        overflow: hidden;
    }
    .gametext {
        display: inline-block;
        font-size: 12px;
        letter-spacing: 1.5px;
        transform: translateY(-2px);
        text-shadow: 0 0.1em 0.2em rgba(0,0,0,0.35);
    }
    .header {
        padding: 15px;
        flex: 2 0 0;
        background-color: rgb(15, 16, 16);
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;
    }
    .content {
        padding: 15px;
        flex: 9 0 0;
        background-color: #201f1d;
        flex-wrap: wrap;
    }
    .image {
        filter: brightness(0) saturate(100%) invert(100%) sepia(22%) saturate(1%) hue-rotate(49deg) brightness(109%) contrast(101%);
        display: inline; 
        transform: translateY(-2px);
        margin: 0 7px;
    }
    .title {
        font-size: 25px;
        font-weight: bold;
        letter-spacing: 0.5px;
        text-shadow: 0 0.1em 0.2em rgba(0,0,0,0.35);
    }
</style>