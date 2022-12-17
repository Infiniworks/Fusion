<script>
import Login from "../components/Login.svelte";
</script>

<main>
    <div class="login f49ers">
        ACCOUNTS<br>
        <Login/>
    </div>
    <div class="info">

    </div>
</main>

<style>
:root {
    color-scheme: dark;
}
main {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: row;
}
.login {
    background-color: #201f1d;
    flex: 5 0 0;
    border-radius: 8px;
    transform: scale(0.94);
    padding: 15px;
    overflow-y: scroll;
    height: 361px;
}
.info {
    background-color: #201f1d;
    flex: 10 0 0;
    border-radius: 8px;
    transform: scale(0.94);
    padding: 15px;
}
.f49ers {
    text-align: center;
    color: rgba(237, 252, 232, 0.58);
    font-size: 22px;
    font-weight: bold;
    text-shadow: 0 0.1em 0.2em rgba(0,0,0,0.35);
}
</style>