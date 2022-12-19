<script lang="ts">
	import TopBar from "./components/TopBar.svelte";
	import Settings from "./pages/Settings.svelte";

	import Credits from "./components/Credits.svelte";
	import Home from "./pages/Home.svelte";
	import About from "./pages/About.svelte";
	import Developer from "./pages/Developer.svelte";
	import Launcher from "./components/Launcher.svelte";
	import ClientHeader from "./components/ClientHeader.svelte";
	import Clients from "./pages/Clients.svelte";
	import { tab } from "./data/bridge";

	let items: string[] = ["Home", "Clients", "Settings", "About", "Developer"];
	let smallBar: string[] = ["Clients", "Settings", "About"];

	let selectedTab = items[0];
import Launcher from "./components/Launcher.svelte";
import Login from "./components/Login.svelte";
import "carbon-components-svelte/css/g80.css";

</script>

<main class="font-medium lining-nums">
	<div class="topBar"></div>
	<span class="mainPage">
		<div class="leftBar"><Login/></div>
		<span class="actualPage"><Launcher/></span>
	</span>
</main>

<style>
main {
	height: 100%;
	width: 100%;
	background-color: aqua;
	display: flex;
	flex-direction: column;
}
.topBar {
	-webkit-app-region: drag;
	flex: 1;
}
.leftBar {
	/* -webkit-app-region: drag; */
	flex: 1;
}
.mainPage {
	flex: 8;
	background-color: aquamarine;
	display: flex;
}
.actualPage {
	flex: 4;
	background-color: rgb(40, 211, 48);
	display: flex;
}
</style>