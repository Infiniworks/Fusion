<script>
import _ from "lodash"; 
import { onMount } from 'svelte';
import { get } from "svelte/store";
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
    } 
}

const select = async (name) => {
    localStorage.setItem("selected", name)
    selected = localStorage.getItem("selected");
}

const logout = async (name) => {
    if (localStorage.getItem("selected") == name) {
        localStorage.setItem("selected", "")
    }

    selected = localStorage.getItem("selected");

    users = JSON.parse(localStorage.getItem("users"));
    delete users[name]
    
    localStorage.setItem("users", JSON.stringify(users));
    users = JSON.parse(localStorage.getItem("users"));
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
});
</script>

<main>
    <button class="login" on:click={
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
                } class:selected="{name == selected}">{name}</button>
                <button on:click={
                    async () => {
                        logout(name)
                    }
                } class:selectedModifier="{name == selected}">Logout</button><br>
            {/each}
        {/if}
    {/key}
</main>

<style>
.login {
    background-color: aquamarine;
    color: black;
}
.selected {
    background-color: red;
}
.selectedModifier {
    background-color: orangered;
}
.userHead {
    width: 100px;
    height: 100px;
    float: left;
}
</style>