<script lang="ts">
	import TopBar from "./components/TopBar.svelte";
	import Settings from "./pages/Settings.svelte";
	import Servers from "./pages/Servers.svelte";
	import Credits from "./components/Credits.svelte";
	import Home from "./pages/Home.svelte";
	import About from "./pages/About.svelte";
	import Developer from "./pages/Developer.svelte";
	import Launcher from "./components/Launcher.svelte";
	import ClientHeader from "./components/ClientHeader.svelte";

	let items: string[] = ["Home", "Servers", "Settings", "About", "Developer"];

	import { tab } from "./data/bridge";

	let selectedTab = items[0];

	tab.subscribe(value => {
		selectedTab = value;
	});
</script>

<main class="font-medium lining-nums">
	<div class= "titleBar">
		<TopBar/>
	</div>
	<span class = "dynamic">
		<div class= "clientHeader">
			<ClientHeader/>
		</div>
		<div class= "rocketLauncher">
			<Launcher/>
		</div>
		<div class= "usableSpace">
			{#if selectedTab == "Home"}
				<Home/>
			{:else if selectedTab == "Servers"}
				<Servers/>
			{:else if selectedTab == "Settings"}
				<Settings/>
			{:else if selectedTab == "About"}
				<About/>
			{:else if selectedTab == "Developer"}
				<Developer/>
			{/if}
		</div>
	</span>
	<div class= "creditsBar"><Credits/></div>
</main>

<style>

:root {
	--topBar: 38px;
	--bottomBar: 38px;
	--clientHeader: 40px;
	--rocketLauncherHeight: 120px;
}

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
}
.clientHeader {
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: peru;
	height: 100px;
}
.dynamic {
	position: absolute;
	top: var(--topBar);
	bottom: var(--bottomBar);
	display: flex;
	flex-direction: column;
	align-content: stretch;
	margin: auto;
	padding: 0px;
	width: 100%;
	justify-content: center;
}
.titleBar {
	position: absolute;
	background-color: gray;
	right: 0px;
	top: 0px;
	left: 0px;
	height: var(--topBar);
	-webkit-app-region: drag;
}
.creditsBar {
	position: absolute;
	background-color: gray;
	right: 0px;
	bottom: 0px;
	left: 0px;
	height: var(--bottomBar);
}
.rocketLauncher {
	display: flex;
	flex-direction: column;
	justify-content: center;
	top: calc(var(--topBar)+var(--clientHeader));
	bottom: calc(var(--topBar)+var(--clientHeader)+var(--rocketLauncherHeight));
	background-image: url("../images/nasaimg.png");
	background-position: center; /* Center the image */
	background-repeat: no-repeat; /* Do not repeat the image */
	background-size: cover;
	box-shadow: inset 0 0 0 1000px rgba(0, 0, 0, 0.4);
	flex: 11 0 0;
}
.usableSpace {
	flex: 15 0 0;
}
</style>