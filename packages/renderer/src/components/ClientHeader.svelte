<script type="ts">
    import { tab } from "../data/bridge";


    let items: string[] = ["Home", "Servers", "Settings", "About", "Developer"];
    let selectedTab: string = items[0];

    $: tab.update(n => n = selectedTab);
    tab.subscribe(value => {
		selectedTab = value;
	});
</script>

<span class="Tabs">
    {#each items as item}
        <button class="selector" 
            class:selected="{selectedTab === item}" 
            on:click={()=> selectedTab = item}>
            {item}
        </button>
    {/each}
</span>

<style>

.Tabs {
	display: flex;
	width: 1000px;
	flex-direction: row;
	background-color: aquamarine;
	position: absolute;
	color: black;
	justify-content: space-evenly;
}
</style>
