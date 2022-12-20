<script>
import _ from "lodash"; 
import { get } from 'svelte/store';
import { data } from "$data/localStore.js";
import { onMount } from 'svelte';
import { Dropdown, DropdownSkeleton } from "carbon-components-svelte";

let loading = false;

let globalData = get(data);
console.dir(globalData);

async function login(username) {
    loading = true;
    let data = JSON.parse(await window.please.get("login"));
    let result = data.type;
    if (result == "Cancelled") {
        console.log("Sign-in Cancelled!")
    }
    else if (result == "Success") {
        username = data.profile.name;

        const userSnippet = { username, data }
        globalData.users =  await window.please.get(
            "refreshUsers",
            _.reject(_.compact(_.concat(globalData.users, userSnippet)), _.isEmpty)
            );
        console.log(globalData)
        globalData.selected = username;
        globalData.selectedIndex = globalData.users.length - 1;
        console.log("Sign-in Successful!");
    } 
    loading = false;
}

const select = (index) => {
    loading = true;
    console.log(index);
    globalData.selected = globalData.users[index].username;
    globalData.selectedIndex = index;
    globalData;
    loading = false;
}

const logout = (index) => {
    loading = true;
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
    loading = false;
}

$: data.update((thing) => thing = globalData);

onMount( async () => {
    loading = true;
    globalData.users = await window.please.get("refreshUsers", globalData.users);
    loading = false;
});

const parseUserData = () => {
    loading = true;
    const userList = [];
    for (let index = 0; index < globalData.users.length; ++index) {
        const user = globalData.users[index];
        userList.push({
            id: user.username,
            numId: index,
        })
    }
    loading = false;
    return userList;
}

</script>


<main>
    <div class="inline max">
        {#key globalData.users}
            {#if (JSON.stringify(globalData.users) !== "{}") && (globalData.users)}
                {#if loading}
                    <DropdownSkeleton />
                {:else}
                    <span class="inline content left">
                        <img class="userHead outside" alt="Minecraft Head" src="https://mc-heads.net/avatar/{globalData.selected}/200.png"/>
                        <Dropdown
                            style=
                            "flex: 8;
                            transform: translateY(2px);"
                            bind:selectedId={globalData.selected}
                            items={parseUserData()}
                            let:item
                            let:index
                        >
                            <div class="inline" class:selected="{item.id == globalData.selected}">
                                <button class="user" on:click={
                                    () => {
                                        select(item.numId)
                                    }
                                }>
                                    <img class="userHead" alt="Minecraft Head" src="https://mc-heads.net/avatar/{item.id}/200.png"/>
                                    <br>{item.id}
                                </button>
                                <button class="logout" on:click={
                                    () => {
                                        logout(item.numId)
                                    }
                                }><img class = "logoutImage" alt="Logout" src="images/xsymb.webp"/></button>
                                <br>
                            </div>
                        </Dropdown>
                    </span>
                {/if}
            {/if}
        {/key}
        <button class="lga1700" on:click={
                async () => {
                    await login();
                }
            }>
            <div class="inline right">
                Login
                <br>
            </div>
        </button>
        <button class="lga1700">
            <div class="inline right play">
                Play!
            </div>
        </button>
    </div>
</main>

<style>
    .play {
		width: 83px !important;
        color: black !important;
        font-size: 20px !important;
        font-weight: 500 !important;
        background-color: greenyellow !important;
	}
    main {
        width: 600px;
    }
    .right {
        flex: 1;
        text-align: center;
        align-items: center;
        padding: 7px;
        height: 50px;
        width: 50px;
        justify-content: center;
    }

    .left {
        flex: 8;
    }
    
    .content {
        -webkit-app-region: no-drag;
        display: flex;
        flex-direction: column;
    }
    .logoutImage {
        filter: invert(100%);
        opacity: 0.5;
        width: 20px;
        margin: auto;
        display: block;
    }
    .inline {
        border-radius: 5px 5px 5px 5px;
        display: flex;
        flex-direction: row;
        padding: 7px;
        margin: 2px;
        background-color: #181816;
        transition-timing-function: ease-in-out;
        color: rgba(255, 255, 255, 0.503);
        transition: all .8s;
    }
    .inline.max {
        display: flex;
        background-color: #343434;;
        align-content: center;
        text-align: center;
    }
    .selected {
        color: rgba(255, 255, 255, 0.803);
        background-color: rgb(59, 59, 59);
    }
    .logout {
        border-radius: 5px 5px 5px 5px;
        float: right;
        flex: 1 0;
        height: 35px;
        aspect-ratio: 1 / 1;
        background-color: black;
        padding: 5px;
        align-self: center;
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
    .userHead {
        border-radius: 5px 5px 5px 5px;
        height: 35px;
        aspect-ratio: 1 / 1;
        align-self: center;
        text-align: center;
        float: left;
        margin: 5px;
    }
    .userHead.outside {
        width: 35px !important;
    }
    .lga1700 {
        flex: 1;
        padding: 3px;
        align-items: center;
        text-align: center;
    }
</style>