<script lang="ts">
import "carbon-components-svelte/css/all.css";
import { 
    Tag, Tooltip, 
    Checkbox, Select, SelectItem, SelectItemGroup,
} from "carbon-components-svelte";
import Slider from '@smui/slider';
import { versions, maxMemory, minMemory, modDisabling } from "../data/localStore";

$: document.documentElement.setAttribute("theme", "g90");

let selected: any, checked: any;

let totalMem: any, memMax: number, memMin: number;

versions.subscribe((thing) => selected = thing);
maxMemory.subscribe((thing) => memMax = thing);
minMemory.subscribe((thing) => memMin = thing);
modDisabling.subscribe((thing) => checked = thing);

let mods: any;

const start = async() => {
    mods = await window.please.get("mods");
    totalMem = await window.please.get("maxMemory", "M");
    if (!memMax) {
        memMax = await window.please.get("freeMemory", "M");
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

<Slider range
bind:start={memMin} bind:end={memMax}
min={128} max={totalMem} step={1}
input$aria-label="Memory Slider"
/>

<p>{memMin}/{memMax}M</p>

<div class="oop">
    <Checkbox bind:checked/>
    Disable Mods Installing
    <Tooltip direction="right">
        <Tag type="red">BETA</Tag> Use for mod testing only
    </Tooltip>
</div>
{/await}

<style>

div.oop {
    white-space:nowrap;
    overflow:hidden;
    text-overflow:ellipsis;
    outline: 3px solid;
}

</style>