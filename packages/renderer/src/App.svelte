<script>
import TopBar from "./components/TopBar.svelte";
import Profiles from "./components/Profiles.svelte";
import Login from "./components/Login.svelte";
import Settings from "./components/Settings.svelte";
import Servers from "./components/Servers.svelte";
import ProfileBar from "./components/ProfileBar.svelte";
import MainPage from "./components/MainPage.svelte";
</script>

<main class="body font-medium lining-nums">
	<div class="topBar"><TopBar  style="flex-grow: 0.2;"/></div>
	<div class="top" style="flex-grow: 1;">
		Login Here<Login></Login>
		Profiles Go Here<Profiles></Profiles>
	</div>
	<div class="main" style="flex-grow: 4;">
		<div class="left" style="flex-grow: 2;">
			Settings Will Be Here<Settings></Settings>	
			Servers Here<Servers></Servers>
		</div>

		<div class="right" style="flex-grow: 8;">
			<div>Profile Bar Here<ProfileBar></ProfileBar></div>
			<div>Actual Page Here<MainPage></MainPage></div>
		</div>
	</div>
</main>
<TopBar/>

<style>
main {
	background-color: rgb(0, 0, 0);
	position: fixed;
	top:0px;
	right:0px;
	bottom:0px;
	left:0px;
	margin:0px;
	padding:0px;
	color: rgb(194, 214, 234);
}
.main {
	display: flex;
	flex-direction: row;
}
.body {
	display: flex;
	flex-direction: column;
	flex: 1 0;
	align-items: stretch;
	margin: auto;
	padding:0;
}
.top {
	display: inline-flex;
	background-color: #4d25eb;
}
.left {
	display: inline-flex;
	flex-direction: column;
	background-color: #2d65bf;
}
.right {
	display: inline-flex;
	flex-direction: column;
	background-color: #3e7ed7;
}

.topBar {
	-webkit-app-region: drag;
}
</style>