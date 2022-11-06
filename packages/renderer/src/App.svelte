<script>
import TopBar from "./components/TopBar.svelte";
import Profiles from "./components/Profiles.svelte";
import Login from "./components/Login.svelte";
import Launch from "./components/Launch.svelte";
import Settings from "./components/Settings.svelte";
import Servers from "./components/Servers.svelte";
import ProfileBar from "./components/ProfileBar.svelte";
import MainPage from "./components/MainPage.svelte";
import InfoBar from "./components/InfoBar.svelte";
import { Tab, TabContent, Tabs } from "carbon-components-svelte";
</script>


<main class="font-medium lining-nums">
	<div class="tbar">
		<TopBar />
	</div>
	<div class="body">
		<div class="top">
			<InfoBar />
		</div>
		<div class="middle">
			<div>
				<Tabs>
					<Tab label="Login" />
					<Tab label="Settings" />
					
					<svelte:fragment slot="content">
						<TabContent><Login/></TabContent>
						<TabContent><Settings/></TabContent>
					</svelte:fragment>
				</Tabs>

				<MainPage></MainPage>	
				<ProfileBar></ProfileBar>
			</div>
		</div>
	</div>
</main>


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
	display: inline-block;
	background-color: purple;
}
.body {
	display: flex;
	flex-direction: column;
	align-items: stretch;
	margin: auto;
	padding: 0px;
	width: 100%;
}
.top {
	width: 100%;
	display: flex;
	background-color: #2d25eb;
	margin: auto;
	padding: 0px;
}
.middle {
	flex: 15 0 0;
	flex-direction: row;
	width: 100%;
	background:linear-gradient(rgba(17, 16, 16, 0.95), rgba(0, 0, 0, 1)), url("images/nasaimg.png");
	background-size: cover; 
}

.tbar {
	-webkit-app-region: drag;
	box-shadow: 0 0 15px rgba(0,0,0,0.75);
}
</style>