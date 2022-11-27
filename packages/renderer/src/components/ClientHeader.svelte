<script type="ts">
    import { tab } from "../data/bridge";

    let items: string[] = ["Home", "Clients", "Settings", "About", "Developer"];
    let selectedTab: string = items[0];

    $: tab.update(n => n = selectedTab);
    tab.subscribe(value => {
		selectedTab = value;
	});
</script>


    <span class="Tabs">
        <div class="left">
            <img alt="Fusion Client Logo" class="image" width="50px" height="32px" src="../../images/fusion.png"/> 
            <span class="title"> Fusion Client </span>
        </div>
        <div class="center">
            {#each items as item}
                <button class="selector {selectedTab === item ? "selected" : ""}" 
                    on:click={()=> selectedTab = item}>
                    {item}
                </button>
            {/each}
        </div>
        <div class="right">
            <button class="button" on:click={() => window.please.send("window","destroy")}>✖</button>
        </div>
    </span>



<style>
.Tabs {
	display: flex;
    flex: 1 0 0;
	width: 100%;
    padding: 15px;
    height: 100px;
	flex-direction: row;
	background-color: #0a0a0a;
	position: absolute;
	color: black;
	justify-content: space-between;
    align-items: center;
    
}
.selected {
    background-color: #1f1f1f !important;
    outline: #2a2a2a solid 2px;
}

.selector {
    font-size: 16px;
    background-color: #0a0a0a;
    padding: 7px;
    width: 90px;
    height: 40px;
    color: #f7f7e9;
    margin: 0 7px;
}

.selector:hover {
    transition: all 0.2s ease-in-out;
    background-color: #262626;
}
.button {
    border-radius: 2px;
    background-color: #1f1f1f;
    width: 37px;
    height: 37px;
    display: block;
    text-align: center;
    line-height: 1em;
    margin-left: 4.4px;
    font-weight: bolder;
    font-size: 15px;
    color: white;
    outline: #2a2a2a solid 2px;
    transition: all 0.3s ease-in-out;
}
.button:hover {
    background-color: #dc3545;
}
.title {
    font-size: 40px;
    font-weight: bold;
    letter-spacing: -1.25px;
    color:  #f7f7f7;
    text-shadow: 0 0.1em 0.2em rgba(94, 94, 94, .35);
}
.image {
    border-radius: 16px;
    display: inline;
    margin: 0 6px;
    transform: translateY(-8px);
}
.left {
    flex: 0.6 0 0;
}
.center {
    flex: 1.375 0 0;
}
.right {
    flex: 0.05 0 0;
}
</style>
