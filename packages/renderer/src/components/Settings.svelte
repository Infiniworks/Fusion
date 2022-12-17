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
Collections

{#if values.collections == ""}
<div class="inline">
No Collections Installed! Report this error, please!
</div>
{/if}

{#each values.collections as collection_raw}
{@const collection = JSON.parse(collection_raw)}
{@const collectionName = Object.keys(collection)[0]}  <!--This is the name of the collection wrapper (Defaults)-->
{@const collections = Object.keys(collection[collectionName])}
<div class="">
    <p>{collectionName}</p>
    {#each collections as collxion}
        {@const collectionData = collection[collectionName][collxion]}
        {@const name = collectionData.verified == "true" ? collectionData.name + " ✅" : collectionData.name}
        <div class= "ilModern">
            <button class="button" on:click={() => {
                globalData.client = collectionData.name;
                globalData.clientType = "collection";
                globalData.collection = collectionName;
            }}>{name}</button>
            {collectionData.version}
            
        </div>
    {/each}
</div>
{/each}

Clients
<div class="inline">
    {#if values.clients == ""}
    No Clients Installed! Report this error, please!
    {/if}
    {#each values.clients as client}
    <button class="inline button" on:click={() => {
        globalData.client = client;
        globalData.clientType = "client";
    }}>{client}</button>
    {/each}
</div>
{/await}
</main>

<style>
    main {
        position: fixed;
        top:134px;
        right:0px;
        bottom:0px;
        left:0px;
        margin:0px;
        padding:15px;
        overflow-y:scroll;
        background-color: #303131;
        z-index: 100;
    }
    
    .button {
        padding: 7px;
        background-color: #1f2020;
        transition-timing-function: ease-in-out;
        color: rgba(255, 255, 255, 0.503);
        transition: all .8s;
    }
    .inline {
        border-radius: 5px 5px 5px 5px;
        display: flex;
        padding: 7px;
        margin: 5px;
        background-color: #1f2020;
        transition-timing-function: ease-in-out;
        color: rgba(255, 255, 255, 0.373);
        transition: all .8s;
    }
    .ilModern {
        border-radius: 5px 5px 5px 5px;
        display: flex;
        padding: 7px;
        margin: 5px;
        background-color: #1f2020;
        transition-timing-function: ease-in-out;
        color: rgba(255, 255, 255, 0.373);
        transition: all .8s;
    }
    div.oop {
        display: fixed;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
    }

</style>