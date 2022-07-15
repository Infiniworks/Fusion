<script>
import Feed from "./LeftBar/Feed.svelte";
import StartBox from "./LeftBar/StartBox.svelte";
</script>

<main>
<div class = "flex">
    <div class = "start">
        <StartBox />
    </div>
    <div class = "feed">
        <Feed/>
    </div>
</div>
</main>

<style>
.start {
  background-color: rgb(255, 0, 242);
  flex-grow: 1;
  order: 1;
}
.feed {
  background-color: rgb(255, 0, 157);
  flex-grow: 4;
  order: 2
}
.flex {
	height: 100%;
	display: flex;
	align-items: stretch;
	flex-direction: column;
}
</style>
