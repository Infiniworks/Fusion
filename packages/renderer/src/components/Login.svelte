<script>
import _ from "lodash"; 
import { get } from 'svelte/store';
import { data } from "../data/localStore.js";

let selected;

let globalData = get(data);

async function login(username) {
    let data = JSON.parse(await window.please.get("login"));
    let result = data.type;
    if (result == "Cancelled") {
        console.log("Sign-in Cancelled!")
    }
    else if (result == "Success") {
        username = data.profile.name;

        const userSnippet = { username, data }
        globalData.users = _.compact(_.concat(globalData.users, userSnippet));
        globalData.selected = username;
        globalData.selectedIndex = globalData.users.length - 1;
        console.log("Sign-in Successful!");
    } 
}

const select = async (index) => {
    globalData.selected = globalData.users[index].username;
    globalData.selectedIndex = index;
    globalData;
}

const logout = async (index) => {
    if (globalData.selected == globalData.users[index].username) {
        if (globalData.users.length > 1) {
            globalData.selected = globalData.users[1].username;
            globalData.selectedIndex = 1;
        } else {
            globalData.selected = "e";
        }
    }
    delete globalData.users[index];
    globalData.users = _.compact(globalData.users);
}

$: data.update((thing) => thing = globalData);
</script>

<main>
    <button 
    class:noLogin="{globalData.selected === 'e'}"
    class="login" on:click={
        async () => {
            await login()
        }
    }>ADD LOGIN</button><br>
    <!-- <img class="inline bodyIMG" src="https://mc-heads.net/body/{selected}" alt="Your Minecraft Body"/> -->
    {#key globalData.users}
        {#if globalData.users}
            {#each globalData.users as user, i}
            <div class="inline" class:selected="{user.username == globalData.selected}">
                <img class="userHead" alt="Minecraft Head" src="https://mc-heads.net/avatar/{user.username}/180.png"/>
                <button class="user" on:click={
                    async () => {
                        select(i)
                    }
                }>{user.username}</button>
                <button class="logout" on:click={
                    async () => {
                        logout(i)
                    }
                }><img class = "logoutImage" alt="Logout" src="images/xsymb.webp"/></button>
                <br>
            </div>
            {/each}
        {/if}
    {/key}
    
</main>

<!-- <canvas id="skin_container"></canvas> -->

<style>
    /* .bodyIMG {
        width: 30%;
        margin-left: auto;
        margin-right: auto;
        float: left;
    } */
    .logoutImage {
        filter: invert(100%);
        opacity: 0.5;
        width: 20px;
        margin: auto;
        display: block;
    }
    .login {
        font-size: 18px;
        font-weight: bold;
        width: 100%;
        padding: 7px;
        background-color: #1f2020;
        transition-timing-function: ease-in-out;
        color: rgb(197, 197, 197);
        transition: all .8s;
    }
    .inline {
        border-radius: 5px 5px 5px 5px;
        display: flex;
        padding: 7px;
        margin: 5px;
        background-color: #1f2020;
        transition-timing-function: ease-in-out;
        color: rgba(255, 255, 255, 0.503);
        transition: all .8s;
        
    }
    .login:hover {
        background-color: #0b8fb4;
        color: white;
        width:100%;
    }
    .selected {
        color: rgba(255, 255, 255, 0.803);
        background-color: rgb(59, 59, 59);
    }
    .logout {
        border-radius: 5px 5px 5px 5px;
        float: right;
        flex: 1 0;
        height: 50px;
        width: 50px;
        aspect-ratio: 1 / 1;
        background-color: black;
        padding: 5px;
        text-align: center;
    }
    .logout:hover {
        color: white;
    }
    .user {
        flex: 10 0;
        padding: 5px;
        text-align: left;
        font-size: 20px;
    }
    .user:hover {
        background-color: #08b2e100;
        color: white;
    }
    .noLogin {
        font-size: 20px;
        padding: 10px;
        background-color: rgba(255, 0, 0, 0.287);
    }
    .userHead {
        border-radius: 5px 5px 5px 5px;
        height: 50px;
        aspect-ratio: 1 / 1;
    }
</style>