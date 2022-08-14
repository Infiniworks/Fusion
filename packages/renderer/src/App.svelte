<script>
import TopBar from "./components/TopBar.svelte";
import Profiles from "./components/Profiles.svelte";
import Login from "./components/Login.svelte";
import Launch from "./components/Launch.svelte";
import Settings from "./components/Settings.svelte";
import Servers from "./components/Servers.svelte";
import ProfileBar from "./components/ProfileBar.svelte";
import MainPage from "./components/MainPage.svelte";
</script>


<main class="font-medium lining-nums">
	<div class="tbar">
		<TopBar />
	</div>
	<div class="body">
		<div class="left">
			<div>
				<Login></Login>
				<Profiles></Profiles>
				<Servers></Servers>
			</div>
		</div>
		<div class="middle">
			<div>
				<MainPage></MainPage>
				<Settings></Settings>
				<ProfileBar></ProfileBar>
			</div>
		</div>
		<div class="right">
			<div>
				<Launch></Launch>
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
	flex-direction: row;
	align-items: stretch;
	margin: auto;
	padding: 0px;
	height: 100%;
}
/* .top {
	display: inline-flex;
	background-color: #4d25eb;
	box-shadow: 0 0 15px rgba(0,0,0,0.75);
	clip-path: inset(0px 0px -15px 0px);
} */
.left {
	flex: 10 0 0;
	flex-direction: column;
	height: 100%;
	background:linear-gradient(rgba(17, 16, 16, 0.9), rgba(0, 0, 0, 1)), url("images/nasaimg.png");
	background-size: cover; 
}
.right {
	flex: 5 0 0;
	flex-direction: column;
	height: 100%;
	/* background-color: #070908; */
	background:linear-gradient(rgba(17, 16, 16, 0.9), rgba(0, 0, 0, 1)), url("images/nasaimg.png");
	background-size: cover; 
}
.middle {
	flex: 15 0 0;
	flex-direction: column;
	height: 100%;
	background:linear-gradient(rgba(17, 16, 16, 0.95), rgba(0, 0, 0, 1)), url("images/nasaimg.png");
	background-size: cover; 
}

.tbar {
	-webkit-app-region: drag;
	box-shadow: 0 0 15px rgba(0,0,0,0.75);
	clip-path: inset(0px 0px -15px 0px);
}
</style>