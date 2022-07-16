<script>
import Footer from "./builtins/Footer.svelte";
import LeftBar from "./builtins/LeftBar.svelte";
import RightBar from "./builtins/RightBar.svelte";
import Page from "./builtins/Page.svelte";
import TabBar from "./builtins/TabBar.svelte";
import TitleBar from "./builtins/TitleBar.svelte";
</script>

<main>
	<link href="https://fonts.googleapis.com/css2?family=Nanum+Gothic:wght@400;700;800&display=swap" rel="stylesheet">
	<link rel="stylesheet" href="../src/style.css">
  <div class = "high">
    <div id = "titleBar" style = "flex-shrink: 2;">
      <TitleBar/>
    </div>
    <div class = "container" style = "flex-grow: 15;">
      <div id="leftBar" style = "flex-grow: 1; order: 1">
        <p></p>
        <LeftBar>
        </LeftBar>
      </div>
      <div id="rightBar" style = "flex-grow: 1; order: 3">
        <p></p>
        <RightBar/>
      </div>
      <div class = "pageFill" style = "flex-grow: 2; order: 2">
        <div id="tabBar" style = "flex-shrink: 2;" >
          <TabBar/>
        </div>
        <div id="page" style = "flex-grow: 10;">
          <Page/>
        </div>
      </div>
    </div>
    <div id="footer" style = "flex-grow:1;">
      <Footer/>
    </div>
  </div>
</main>

<style>
main {
	width:100%;
	height:98.44999694vh;
	box-sizing: border-box;
	border-radius: 10px;
	font-family: 'Nanum Gothic', sans-serif;
	-user-select: none;
	-webkit-user-select: none;
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
	width: 100%;
	display: flex;
	align-items: stretch;
	flex-direction: column;
}
div#titleBar {
	background-color: rgb(255, 255, 255);
	color: rgba(174, 0, 0, 0.835);
	-webkit-app-region: drag;
	border-radius: 10px 10px 0px 0px;
}
div#tabBar {
	background-color: rgb(203, 54, 118);
	height: max-content;
	padding: 10px;
}
div#rightBar {
	background-color: rgb(22, 172, 213);
	padding: 25px;
	width: 20%;
}
div#page {
	color: white;
	background-color: rgb(185, 93, 93);
	padding: 25px;
	width: 100%;
}
div#leftBar {
	background-color: rgb(204, 104, 104);
	padding: 25px;
	width: 20%;
}
div#footer {
	color: black;
	background-color: rgb(146, 137, 20);
	border-radius: 0px 0px 10px 10px;
}
</style>
