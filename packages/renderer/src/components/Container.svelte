<script>
    
    import "carbon-components-svelte/css/g80.css";
    import Launcher from "./Launcher.svelte";
    import { Tag } from "carbon-components-svelte";
    import Mods from "./Mods.svelte";
    import Settings from "./Settings.svelte";
    export let selectedIndex;
    export let profileData;
    export let selectedPack;
    export let globalData;
    
    import { database as db } from "$data/dataTools.js";
    import { onMount } from "svelte";

    let database = new db(profileData.config);
    
    const dbOps = async (pd) => {
        const prfD = pd[0]
        pd = pd[1]
        
        await database.create(pd.name,prfD.config);
        await database.push(pd.name,"/",prfD);
        console.log(await database.getR("/"));
    }
    
    const cloggedSink = (whatToLog) => {
        console.log(whatToLog);
        return "";
    }
    
</script>

<main>
    {#key profileData.config}
        {#if selectedIndex==0}
        {@const pd = profileData.pack_data}
        {#await dbOps([profileData, pd]) then result}
            {cloggedSink(result)}
        {/await}
        {pd.name}<br>
        {pd.modloader}<br>
        {pd.loaderVersion}<br>
        {pd.version}<br>

        <Tag interactive type="red">red</Tag>
        <Tag interactive type="magenta">magenta</Tag>
        <Tag interactive type="purple">purple</Tag>
        <Tag interactive type="blue">blue</Tag>
        <Tag interactive type="cyan">cyan</Tag>
        <Tag interactive type="teal">teal</Tag>
        <Tag interactive type="green">green</Tag>
        <Tag interactive type="gray">gray</Tag>
        <Tag interactive type="cool-gray">cool-gray</Tag>
        <Tag interactive type="warm-gray">warm-gray</Tag>
        <Tag interactive type="high-contrast">high-contrast</Tag>
        <Tag interactive type="outline">outline</Tag>
        
            <Launcher profileData/>
        {:else if selectedIndex==1}
            <Mods profileData/>
        {:else if selectedIndex==2}
            <Settings profileData/>
        {/if}
    {/key}
</main>



<style>
    main {
        background-color: rgb(0, 38, 38);
        height: 100%;
        width: 100%;
        padding: 15px;
    }

    div {
        margin-top: var(--cds-spacing-05);
    }

</style>