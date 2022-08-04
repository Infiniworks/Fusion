<script lang="ts">
import Select, { Option } from '@smui/select';
import Slider from '@smui/slider';
import { version } from '../data/stores';

let versions: any;
let modloaders: any;
let maxMemory: number, freeMemory, memMax: number, memMin: number;
const start = async() => {
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


$:{
    if (modloader) {
        localStorage.setItem("modloader", modloader);
    } else {
        localStorage.setItem("modloader", "fabric");
    }
}
$: modloader = localStorage.getItem("modloader");
console.log(modloader)
$:{
    (async ()=> {
        versions = await window.please.get("versions", modloader);
    })();
}



$: if (value) localStorage.setItem("version", value);
$: value = localStorage.getItem("version");
$: {
    if (memMax && memMin) {
        localStorage.setItem("minMemory", String(memMin));
        localStorage.setItem("maxMemory", String(memMax));
    }
}
</script>

{#await start()}
Waiting for load
{:then}

<Select variant="filled" bind:modloader label="Modloader">
    {#each modloaders as loader}
        <Option value={loader}>{loader}</Option>
    {/each}
</Select>

<Select variant="filled" bind:value label="Version">
    {#each versions as version}
        <Option value={version}>{version}</Option>
    {/each}
</Select>


<Slider
range
bind:start={memMin}
bind:end={memMax}
min={128}
max={maxMemory}
step={1}
input$aria-label="Memory Slider"
/>
<p>{memMin}/{memMax}M</p>
{/await}

