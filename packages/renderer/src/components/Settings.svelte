<script lang="ts">
import "carbon-components-svelte/css/all.css";
import { 
    Tile,
    Slider, Button,
    Tag, Tooltip, 
    Checkbox, Select, SelectItem, SelectItemGroup,
} from "carbon-components-svelte";
import { versions, memory, modDisabling } from "../data/localStore";
import { get } from "svelte/store";

$: document.documentElement.setAttribute("theme", "g90");

let selected: any;
let checked2: any;

let totalMem: any, memory2: number;
let freeMem: number;


versions.subscribe((thing) => selected = thing);
memory.subscribe((thing) => memory2 = thing);
modDisabling.subscribe((thing) => checked2 = thing);

$: modDisabling.set(checked2)


let mods: any;

const start = async() => {
    mods = await window.please.get("mods");
    totalMem = await window.please.get("maxMemory", "M");
    freeMem = await window.please.get("freeMemory", "M");
    if (!memory2) {
        memory2 = freeMem;
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
$: memory.set(memory2)

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
        invalid={memory2 >= freeMem}
        labelText="Memory (MB)"
        min={128}
        max={totalMem}
        maxLabel={totalMem+" MB"}
        bind:value={memory2}
        step={10}
    />
    Using: {memory2} MB
</div>
<div class="inline">
    <Button on:click={() => (checked2 = !checked2)}>{checked2 ?  "Enable Mods" : "Disable Mods"}</Button>
    Skipping Mods: {checked2}
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