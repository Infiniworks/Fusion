<script>
import _ from "lodash"; 
import { onMount } from 'svelte';
let users, selected;

async function login(username) {
    let data;
    await window.api.login()
    .then((loginData) => {
        data = JSON.parse(loginData)
    })
    let result = data.type;
    if (result == "Cancelled") {
        console.log("Sign-in Cancelled!")
    }
    else if (result == "Success") {
        username = data.profile.name;

        users = JSON.parse(localStorage.getItem("users"));
        let userSnippet = JSON.parse(`{"${username}": ${JSON.stringify(data)}}`);
        users = JSON.stringify(_.merge(users, userSnippet))
        
        localStorage.setItem("users", users);
        localStorage.setItem("selected", username)
        console.log("Sign-in Successful!");
        console.log(JSON.parse(users));
        console.log(localStorage.getItem("selected"));
    } 
}

const select = async (name) => {
    localStorage.setItem("selected", name)
    selected = localStorage.getItem("selected");
}

const userListify = () => {
    users = Object.entries(JSON.parse(localStorage.getItem("users")));
    selected = localStorage.getItem("selected");
    if (!selected) {
        selected = "e"
    }
}

onMount(() => {
    userListify();
    console.log(users)
});
</script>

<main>
    <button on:click={
        async () => {
            await login()
        }
    }>Login</button><br>
    <img class="userHead" alt="Minecraft Head" src="https://crafthead.net/avatar/{selected}"/>
    {#key users}
        {#if users}
            {#each users as [name, data]}
                <button on:click={
                    async () => {
                        select(name)
                    }
                } class:selected="{name == selected}">{name}</button><br>
            {/each}
        {/if}
    {/key}
</main>

<style>
.selected {
    background-color: red;
}
.userHead {
    width: 100px;
    height: 100px;
    float: left;
}
</style>