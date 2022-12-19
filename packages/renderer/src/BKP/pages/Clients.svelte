<script type="ts">
    import { data } from "../data/localStore.js";
    let globalData: any;

    const start = async() => {
        const clients = await window.please.get("clients");
        const collections = await window.please.get("collections");
        const returnV = {
            clients: clients,
            collections: collections,
        }
        return returnV;
    }
    
    data.subscribe((thing) => globalData = thing);
    $: data.update((thing) => thing = globalData);
</script>

<main>
    {#await start()}
        Waiting for load
    {:then values}
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
        height: 100%;
        padding: 15px; 
        overflow-y:scroll;
        background-color: #303131;
        z-index: 100;
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
    .button {
        padding: 7px;
        background-color: #1f2020;
        transition-timing-function: ease-in-out;
        color: rgba(255, 255, 255, 0.503);
        transition: all .8s;
    }
</style>