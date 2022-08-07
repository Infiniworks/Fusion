<script>
import _ from "lodash"; 
import { onMount } from 'svelte';
import { selectedUser } from "../data/localStore";

let selected;
selectedUser.subscribe((thing) => selected = thing);

let users;

async function login(username) {
    let data;
    await window.please.get("login")
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
        selectedUser.set(username)

        userListify();
        console.log("Sign-in Successful!");
    } 
}

const select = async (name) => {
    localStorage.setItem("selected", name)
}

const logout = async (name) => {
    if (localStorage.selected == name) {
        selectedUser.set("e")
    }

    users = JSON.parse(localStorage.getItem("users"));
    delete users[name]
    
    localStorage.setItem("users", JSON.stringify(users));
    userListify();
}

const userListify = () => {
    users = Object.entries(JSON.parse(localStorage.getItem("users")));
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
    {#key selected}
    <img class="userHead" alt="Minecraft Head" src="https://crafthead.net/avatar/{selected}"/>
    {/key}
    {#key users}
        {#if users}
            {#each users as [name, data]}
            <div class:selected="{name == selected}">
                <button class="user" on:click={
                    async () => {
                        select(name)
                    }
                }>{name}</button>
                <button class="logout" on:click={
                    async () => {
                        logout(name)
                    }
                }>Logout</button><br>
            </div>
            {/each}
        {/if}
    {/key}
</main>

<style>
.login {
    background-color: #0d6076;
    color: white;
    width:100%;
    transition: background-color 1.75s;
}
.login:hover {
    background-color: #0d5062;
    color: white;
    width:100%;
}
.selected {
    background-color: #0a86a8;
    box-shadow: 0 0 4px rgba(0,0,0,0.75);
}
.userHead {
    width: 110px;
    height: 100%;
    float: left;
}
.logout {
    float:right;
    background-color: #0b7593;
    padding: 5px;
}
.logout:hover {
    color: white;
}
.user {
    font-weight: bold;
    padding: 5px;
}
.user:hover {
    background-color: #08b2e100;
    color: white;
}
</style>