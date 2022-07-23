<script>
import _ from "lodash"; 
import { onMount } from 'svelte';

async function login(username) {
    let data;
    await window.api.login()
    .then((loginData) => {
        console.log(loginData);
        data = JSON.parse(loginData)
    })

    username = data.profile.name;

    let users = JSON.parse(localStorage.getItem("users"));
    let userSnippet = JSON.parse(`{"${username}": ${JSON.stringify(data)}}`);
    
    console.log(userSnippet);
    localStorage.setItem("users", JSON.stringify(_.merge(users, userSnippet)));
}

onMount(async () => {
    login()
});

</script>

<main>
    <button on:click={
        async () => {
            await login()
        }
    }>Login</button>
</main>

<style>

</style>