<script lang="ts">
import Select, { Option } from '@smui/select';
import Slider from '@smui/slider';

let versions: any;
let mods: any;
let modloaders: any;
let maxMemory: number, freeMemory, memMax: number, memMin: number;
const start = async() => {
    mods = await window.please.get("mods");
    console.log(mods);
    versions = mods.filter(data => data.modloader == modloader)[0].versions;
    console.log(versions.some((data) => data == "version"))
    modloaders = await window.please.get("modloaders");
    maxMemory = await window.please.get("maxMemory", "M");
    freeMemory = await window.please.get("freeMemory", "M");
    if (localStorage.getItem("modloader")) {
        modloader = localStorage.getItem("modloader");
    }
    else {
        modloader = "fabric";
    }
    if (localStorage.getItem("maxMemory")) {
        memMax = Number(localStorage.getItem("maxMemory"));
        memMin = Number(localStorage.getItem("minMemory"));
    }
    else {
        memMax = freeMemory;
        memMin = 128;
    }
};

$: modloader = localStorage.getItem("modloader");
$:{
    if (modloader) {
        localStorage.setItem("modloader", modloader);
    } else {
        localStorage.setItem("modloader", "fabric");
    }
}


// $: versions = mods.filter((data: { modloader: string|null; }) => data.modloader == modloader)[0].versions;

$: if (version) localStorage.setItem("version", version);
$: version = localStorage.getItem("version");
$: {
    if (memMax && memMin) {
        localStorage.setItem("minMemory", String(memMin));
        localStorage.setItem("maxMemory", String(memMax));
    }
}

// $: modloader, 
</script>

{#await start()}
Waiting for load
{:then}

<Select variant="filled" bind:modloader label="Modloader">
    {#each modloaders as loader}
        <Option value={loader}>{loader}</Option>
    {/each}
</Select>

<Select variant="filled" bind:version label="Version">
    {#each versions as version}
        <Option value={version}>{version}</Option>
    {/each}
</Select>

<Slider range
bind:start={memMin} bind:end={memMax}
min={128} max={maxMemory} step={1}
input$aria-label="Memory Slider"/>

<p>{memMin}/{memMax}M</p>
{/await}

