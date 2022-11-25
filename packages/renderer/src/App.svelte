<script lang="ts">
	import TopBar from "./components/TopBar.svelte";
	import Profiles from "./components/Profiles.svelte";
	import Login from "./components/Login.svelte";
	import Launch from "./components/Launcher.svelte";
	import Settings from "./components/Settings.svelte";
	import Servers from "./components/Servers.svelte";
	import ProfileBar from "./components/ProfileBar.svelte";
	import InfoBar from "./components/Credits.svelte";
	import { Tabs } from "attractions";
	import Credits from "./components/Credits.svelte";
	import { data } from "./data/localStore.js";
	let globalData: any;
	data.subscribe((thing: any) => globalData = thing);

	let items: string[] = ["Home", "Servers", "Settings", "About", "Developer"]

	if ((globalData.selectedTab == "") || (globalData.selectedTab == undefined)) {
		globalData.selectedTab = items[0];
	}

	$: data.update((thing) => thing = globalData);
</script>


<main class="font-medium lining-nums">
	<div class= "titleBar"><TopBar/></div>
	<span class = "dynamic">
		<div class= "clientHeader">
			<span class="Tabs">
				<Tabs
				name="menu"
				items={items}
				bind:value={globalData.selectedTab}
				/>
			</span>
		</div>
		<div class= "rocketLauncher"></div>
		<div class= "usableSpace">
			
		</div>
	</span>
	<div class= "creditsBar"><Credits/></div>
</main>

<style>

main {
	background-color: #23a6d5;
	position: fixed;
	top: 0px;
	right: 0px;
	bottom: 0px;
	left: 0px;
	margin: 0px;
	padding: 0px;
	color: rgb(194, 214, 234);
	display: inline-block;
    border-radius: 8px;
    overflow: hidden;
	/* box-shadow: inset 0px -1px 10px 1px #0000002e; */
}
.dynamic {
	position: absolute;
	top: 38px;
	bottom: 38px;
	display: flex;
	flex-direction: column;
	align-items: stretch;
	margin: auto;
	padding: 0px;
	width: 100%;
}
.titleBar {
	position: absolute;
	background-color: gray;
	right: 0px;
	top: 0px;
	left: 0px;
	height: 38px;
	-webkit-app-region: drag;
}
.creditsBar {
	position: absolute;
	background-color: gray;
	right: 0px;
	bottom: 0px;
	left: 0px;
	height: 38px;
}
.clientHeader {
	background-color: antiquewhite;
	flex: 15 0 0;
	
}
.Tabs {
	position: absolute;
	margin-left: 500px;
	margin-right: 500px;
}
</style>