<script lang="ts">
import "carbon-components-svelte/css/all.css";
import { 
    Tile,
    Slider,
    Tag, Tooltip, 
    Checkbox, Select, SelectItem, SelectItemGroup,
} from "carbon-components-svelte";
import { versions, maxMemory, minMemory, modDisabling } from "../data/localStore";

$: document.documentElement.setAttribute("theme", "g90");

let selected: any;
let checked: any = false;

let totalMem: any, memMax: number, memMin: number;
let freeMem: number;

versions.subscribe((thing) => selected = thing);
maxMemory.subscribe((thing) => memMax = thing);
minMemory.subscribe((thing) => memMin = thing);
modDisabling.subscribe((thing) => checked = thing);

let mods: any;

const start = async() => {
    mods = await window.please.get("mods");
    totalMem = await window.please.get("maxMemory", "M");
    freeMem = await window.please.get("freeMemory", "M");
    if (!memMax) {
        memMax = freeMem;
    }
    
    return mods;
};

$: {
    if (mods) {
        for (let version of mods) {
            for (let modloaderVersions of version.versions) {
                if (modloaderVersions.version == selected) localStorage.modloader = version.modloader;
            }
        }
    }
    versions.set(selected)
}
$: maxMemory.set(memMax)
$: minMemory.set(memMin)
$: modDisabling.set(checked)

</script>

{#await start()}
Waiting for load
{:then mods}
{#each mods as modloaderInfo}
<div class="inline">
    {modloaderInfo.modloader}
    {#each modloaderInfo.versions as version}
        <button class="inline button" on:click={() => selected = version.version}>{version.version}</button>
    {/each}
</div>
{/each}
<div class="oop inline">
    <Slider
        invalid={memMax >= freeMem}
        labelText="Memory (MB)"
        min={128}
        max={totalMem}
        maxLabel={totalMem+" MB"}
        bind:value={memMax}
        step={10}
    />
    Using: {memMax} MB
</div>

{/await}

<style>
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
    div.oop {
        display: fixed;
        white-space:nowrap;
        overflow:hidden;
        text-overflow:ellipsis;
    }

</style>