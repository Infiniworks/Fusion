<script>
  import Login from "../components/Login.svelte";



</script>

<main>
    <div class="login">hi
        <Login/>
    </div>
    <div class="info">gello

    </div>
</main>

<style>
main {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
}
.login {
    background-color: brown;
    flex: 5 0 0;
    border-radius: 8px;
    transform: scale(0.94);
    padding: 15px;
}
.info {
    background-color: cadetblue;
    flex: 10 0 0;
    border-radius: 8px;
    transform: scale(0.94);
    padding: 15px;
}
</style>