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
	<div id = "titleBar">
		<TitleBar>

		</TitleBar>
	</div>
	<div id="leftBar">
		<LeftBar>

		</LeftBar>
	</div>
	<div id="rightBar">
		<RightBar>

		</RightBar>
	</div>
	<div id="tabBar">
		<TabBar>

		</TabBar>
	</div>
	<div id="page">
		<Page>

		</Page>
	</div>
	<div id="footer">
		<Footer>

		</Footer>
	</div>
</main>

<style>
main {
	color: white;
	height: 100%;
    width: 100%;
	display: grid;
	grid-template-areas:
	'clickArea clickArea clickArea clickArea clickArea'
    'left header header header right'
    'left main main main right'
	'left main main main right'
	'left main main main right'
	'left main main main right'
	'left main main main right'
	'left main main main right'
	'left main main main right'
	'left main main main right'
    'left footer footer footer right';
}
div#titleBar {
	grid-area: clickArea;
	background-color: rgb(0, 0, 0);
	-webkit-app-region: drag;
	-user-select: none;
	-webkit-user-select: none;
}
div#tabBar {
	grid-area: header;
	background-color: rgb(30, 30, 30);
}
div#rightBar {
    grid-area: right;
	background-color: rgb(38, 38, 38);
}
div#page {
	grid-area: main;
	background-color: rgb(61, 61, 61);
}
div#leftBar {
	grid-area: left;
	background-color: rgb(38, 38, 38);
}
div#footer {
	grid-area: footer;
	background-color: rgb(0, 0, 0);
}
</style>