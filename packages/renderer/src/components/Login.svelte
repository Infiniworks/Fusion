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

const getGameOpts = async () => {
    // let cv;
    // if (loader == "fabric") {
    //     cv = "fabric-loader-"+loaderVersion+"-"+gameVersion;
    // }
    return { 
        clientName: "default",
        version: "1.19",
        memMax: await window.please.get("usedMemory","M"), //slider.noUiSlider.get()[1]+"M",
        memMin: await window.please.get("usedMemory","M"), //slider.noUiSlider.get()[0]+"M",
        authentication: getAuth(),
        maxSockets: 5,
        customVersion: "fabric-loader-0.14.8-1.19", // cv,
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

const getAuth = () => {
    return JSON.parse(localStorage.getItem("users"))[selected];
}

onMount(() => {
    userListify();
});
</script>

<main>
    {#await window.please.get("usedMemory","M")}
    <p>Loading memory</p>
    {:then memory}
    {memory}
    {/await}
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