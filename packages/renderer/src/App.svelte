<script>
import LeftBar from "./builtins/LeftBar.svelte";
import RightBar from "./builtins/RightBar.svelte";
import Page from "./builtins/Page.svelte";
import TabBar from "./builtins/TabBar.svelte";
import TitleBar from "./builtins/TitleBar.svelte";
import 'simplebar';
</script>

<main>
	<link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="../src/style.css">
  <div class="fullPage">
    <div id="titleBar" style = "flex-shrink: 0;">
      <TitleBar/>
    </div>

    <div class = "container" style = "flex-shrink: 0;">
      <div id="leftBar" data-simplebar style = "overflow-y: scroll; flex-shrink: 0; order: 1">
        <p></p>
        <LeftBar>
        </LeftBar>
      </div>
      <div class = "pageFill" style = "flex-grow: 2; order: 2">
        <div id="tabBar" style = "flex-shrink: 0;" >
          <TabBar/>
        </div>
        <div id="page" style = "flex-grow: 1; overflow-y:scroll;">
          <Page/>
        </div>
      </div>
      <div id="rightBar" style = "flex-shrink: 0; order: 3">
        <p></p>
        <RightBar/>
      </div>
    </div>
  </div>
</main>

<style>
main {
  	box-sizing: border-box;
	width:100%;
	height:calc(100vh);
	/* border-radius: 10px; */
	font-family: 'Nanum Gothic', sans-serif;
	-webkit-app-region: no-drag;
  	color: white;
 	background-color: rgb(41, 41, 41);
}
.fullPage {
	height: 100%;
	display: flex;
	align-items: stretch;
	flex-direction: column;
	flex: 1
}
.container {
	display: flex;
	align-items: stretch;
	flex: 1
}
.pageFill {
	height: 100%;
	width: 100%;
	display: flex;
	align-items: stretch;
	flex-direction: column;
	flex: 1
}
div#titleBar {
	background-color: rgb(0, 0, 0);
	-webkit-app-region: drag;
	/* border-radius: 10px 10px 0px 0px; */
}
div#tabBar {
	background-color: rgb(34, 34, 34);
  box-sizing: border-box;
	height: 8%;
	padding: 10px;
  box-shadow: 0 0 15px rgba(31, 31, 31, 0.363);
  clip-path: inset(0px 0px -15px 0px);
}
div#rightBar {
	overflow-y: scroll;
	background-color: rgb(41, 41, 41);
	padding: 25px;
	width: 25%;
  box-shadow: 0 0 15px rgba(31, 31, 31, 0.363);
  clip-path: inset(0px 0px 0px -15px);
}
div#page {
	background-color: rgb(64, 64, 64);
	padding: 25px;
	width: 100%;
}
div#leftBar {
	background-color: rgb(41, 41, 41);
	padding: 25px;
	width: 25%;
  box-shadow: 0 0 15px rgba(31, 31, 31, 0.363);
  clip-path: inset(0px -15px 0px 0px);
}
/* div#footer {
	background-color: rgb(34, 34, 34);
	border-radius: 0px 0px 10px 10px;
}*/

</style>
