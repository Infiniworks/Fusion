<script type="ts">
import Footer from "./builtins/Footer.svelte";

import LeftBar from "./builtins/LeftBar.svelte";
import Feed from "./builtins/LeftBar/Feed.svelte";
import Header from "./builtins/LeftBar/Header.svelte";

import RightBar from "./builtins/RightBar.svelte";
import Profile from "./builtins/RightBar/Profile.svelte";

import Page from "./builtins/Page.svelte";
import TabBar from "./builtins/TabBar.svelte";

import TitleBar from "./builtins/TitleBar.svelte";

</script>



<main>
	<link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="../src/style.css">

<div class = "high">
	<div id = "titleBar" style = "flex-shrink: 2;">
		<TitleBar>

		</TitleBar>
	</div>
	<div class = "container" style = "flex-grow: 30;">
		<div id="leftBar" style = "flex-grow: 1; order: 1">
			<p></p>
			<LeftBar>
	
			</LeftBar>
		</div>
		<div id="rightBar" style = "flex-grow: 1; order: 3">
			<p></p>
			<RightBar>
	
			</RightBar>
		</div>
		<div class = "pageFill" style = "flex-grow: 2; order: 2">
			<div id="tabBar" style = "flex-grow: 1;" >
				<TabBar>
	
				</TabBar>
			</div>
			<div id="page" style = "flex-grow: 10;">
				<Page>
	
				</Page>
			</div>
			<div id="footer" style = "flex-grow: 1;">
				<Footer>
	
				</Footer>
			</div>
		</div>
	</div>
</div>


</main>

<style>
main {
	width:100%;
	height:100%;
	box-sizing: border-box;
	border-radius: 10px;
	font-family: 'Nanum Gothic', sans-serif;
}
.high {
	height: 100%;
	display: flex;
	align-items: stretch;
	flex-direction: column;
}
.container {
	display: flex;
	align-items: stretch;
}
.pageFill {
	height: 100%;
	display: flex;
	align-items: stretch;
	flex-direction: column;
}
div#titleBar {
	background-color: rgb(255, 255, 255);
	color: black;
	-webkit-app-region: drag;
	-user-select: none;
	-webkit-user-select: none;
}
div#tabBar {
	background-color: rgb(27, 27, 27);
}
div#rightBar {
	background-color: rgb(22, 16, 10);
	border-radius: 0px 25px 25px 0px;
}
div#page {
	color: white;
	background-color: rgb(49, 49, 49);
}
div#leftBar {
	border-radius: 25px 0px 0px 25px;
	background-color: rgb(22, 16, 10);
}
div#footer {
	color: black;
	background-color: rgb(27, 27, 27);
}
</style>