<script>
import _ from "lodash"; 
import { onMount } from 'svelte';
import { selectedUser } from "../data/localStore";
// import { SkinViewer } from "skinview3d";

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
    selectedUser.set(name)
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

// let skinViewer = new skinview3d.SkinViewer({
// 		canvas: document.getElementById("skin_container"),
// 		width: 300,
// 		height: 400,
// 		skin: "https://s.namemc.com/i/37529af66bcdd70d.png"
// 	});

// 	// Change viewer size
// 	skinViewer.width = 600;
// 	skinViewer.height = 800;
//     skinViewer.nameTag = selected;
</script>

<main>
    <button 
    class:noLogin="{selected === 'e'}"
    class="login" on:click={
        async () => {
            await login()
        }
    }>ADD LOGIN</button><br>
    <img class="inline bodyIMG" src="https://mc-heads.net/body/{selected}" alt="Your Minecraft Body"/>
    {#key users}
        {#if users}
            {#each users as [name, data]}
            <div class="inline" class:selected="{name == selected}">
                <img class="userHead" alt="Minecraft Head" src="https://mc-heads.net/avatar/{name}/180.png"/>
                <button class="user" on:click={
                    async () => {
                        select(name)
                    }
                }>{name}</button>
                <button class="logout" on:click={
                    async () => {
                        logout(name)
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
    .bodyIMG {
        width: 30%;
        margin-left: auto;
        margin-right: auto;
        float: left;
    }
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