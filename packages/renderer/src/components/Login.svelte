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
    }>Login</button><br>
    {#key users}
        {#if users}
            {#each users as [name, data]}
            <div class="inline" class:selected="{name == selected}">
                <img class="userHead" alt="Minecraft Head" src="https://crafthead.net/avatar/{name}"/>
                <button class="user" on:click={
                    async () => {
                        select(name)
                    }
                }>{name}</button>
                <button class="logout" on:click={
                    async () => {
                        logout(name)
                    }
                }>X</button>
                <br>
            </div>
            {/each}
        {/if}
    {/key}
</main>
<!-- <canvas id="skin_container"></canvas> -->

<style>
.inline {
    display: flex;
    padding: 5px;
    background-color: #0d6076;
    transition-timing-function: ease-in-out;
    color: rgba(255, 255, 255, 0.264);
    transition: all .8s;
    
}
.login {
    padding: 5px;
    background-color: #0d6076;
    color: white;
    width: 100%;
    transition: all 1.75s;
}
.login:hover {
    background-color: #0d5062;
    color: white;
    width:100%;
}
.selected {
    color: rgba(255, 255, 255, 0.753);
    background-color: #0a86a8;
}
.logout {
    border-radius: 5px 5px 5px 5px;
    float: right;
    flex: 1 0;
    background-color: #0b7593;
    padding: 5px;
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
    width: 15%;
    padding: 0px;
    margin: 0px;
}
</style>