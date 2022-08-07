<script lang="ts">
import "carbon-components-svelte/css/all.css";
import { 
    Slider,
    Tag, Tooltip, 
    Checkbox, Select, SelectItem, SelectItemGroup,
} from "carbon-components-svelte";
import { versions, maxMemory, minMemory, modDisabling } from "../data/localStore";
import { freemem } from "os";

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
<Select labelText="Select Version" bind:selected>
    {#each mods as modloaderInfo}
    <SelectItemGroup label={modloaderInfo.modloader}>
        {#each modloaderInfo.versions as version}
            <SelectItem value={version.version} text={version.version}/>
        {/each}
    </SelectItemGroup>
    {/each}
</Select>

<Slider
invalid={memMax >= freeMem}
labelText="Memory (MB)"
min={128}
max={totalMem}
maxLabel={totalMem+" MB"}
bind:value={memMax}
step={10}
/>

<p>Using: {memMax} MB</p>

<!-- <div class="oop">
    <Checkbox bind:checked />
    Disable Mods Installing
    <Tooltip direction="right">
        <Tag type="red">BETA</Tag> Use for mod testing only
    </Tooltip>
</div> -->
{/await}

<style>

div.oop {
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    outline: 3px solid;
}

</style>