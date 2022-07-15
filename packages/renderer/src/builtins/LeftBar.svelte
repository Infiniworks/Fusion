<script>
import Feed from "./LeftBar/Feed.svelte";
import StartBox from "./LeftBar/StartBox.svelte";

</script>

<main>
<div class = "flex">
    <div style = "background-color: rgb(0, 222, 0); flex-grow: 1; order: 1">
        <StartBox >

        </StartBox>
    </div>
    <div style = "background-color: rgb(244, 0, 0); flex-grow: 4; order: 2">
        <Feed>

        </Feed>
    </div>
</div>
</main>

<style>
.flex {
	height: 100%;
	display: flex;
	align-items: stretch;
	flex-direction: column;
}
</style>