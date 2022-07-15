<script>
// Nothing here yet!
</script>

<main>
<div class="flex">
    <button class="exit" on:click={() => {window.api.titlebar("resize");} }>❏</button>
    <button class="exit" on:click={() => window.api.titlebar("destroy")}>🞭</button>
</div>
</main> 

<style>
button {
    -webkit-app-region: no-drag;
}
.flex {
  display: flex;
  justify-content: right;
  flex-wrap: wrap
}
</style>