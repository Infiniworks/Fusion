<script>
import TopBar from "./Components/TopBar.svelte";
import Profiles from "./Components/Profiles.svelte";
import Login from "./Components/Login.svelte";
import Launch from "./Components/Launch.svelte";
import Settings from "./Components/Settings.svelte";
import Servers from "./Components/Servers.svelte";
import ProfileBar from "./Components/ProfileBar.svelte";
import MainPage from "./Components/MainPage.svelte";
</script>

<main class="body font-medium lining-nums">
	<div class="topBar"><TopBar /></div>
	<div class="top" style="flex: 1 0;">
		<div class="login bg-cyan-700" style="flex: 4 0">
			<Login></Login>
		</div>
		<div class="profiles bg-cyan-600"style="flex: 8 0">
			Profiles Go Here<Profiles></Profiles>
		</div>
		<div class="launch bg-cyan-700"style="flex: 2 0">
			<Launch></Launch>
		</div>
	</div>
	<div class="main" style="flex: 4 0;">
		<div class="left bg-cyan-600" style="flex: 4 0;">
			<div class="settings">
				Settings Will Be Here<Settings></Settings>	
			</div>
			<div class="servers">
				Servers Here<Servers></Servers>
			</div>
		</div>

		<div class="right bg-cyan-500" style="flex: 8 0;">
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
	/* background-color: #2d65bf; */
}
.right {
	display: inline-flex;
	flex-direction: column;
	/* background-color: #3e7ed7; */
}

.topBar {
	-webkit-app-region: drag;
}
.login {
	justify-content: center;
}
.launch {
	justify-content: center;
}
</style>