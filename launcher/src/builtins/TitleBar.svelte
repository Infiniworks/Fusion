<script>
let isToggled = false;
let togVal = "□"
const toggleState = () => {
    if (isToggled) {
        isToggled = false
        togVal = "❏"
    }
    else {
        isToggled = true
        togVal = "□"
    }
}
</script>

<main>
<div class="flex">
    <button class="exit" on:click={() => {window.api.titlebar("resize"); toggleState()} }>{togVal}</button>
    <p class = "title">FUSION</p>
    <button class="exit" on:click={() => window.api.titlebar("destroy")}>🞭</button>
</div>
</main> 

<style>
button {
    -webkit-app-region: no-drag;
}
.flex {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap
}
</style>