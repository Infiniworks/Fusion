<script>
let selectedProfile, loginCredentials;
const nullValues = [undefined, null, ""];
let CU_URL, emptyAvatarURL = "https://crafatar.com/avatars/d479b9f8-f8f8-4f8e-b8f8-f8f8f8f8f8f8?overlay", CUID;


const fetchPlayerData = () => {
    let authList = [];
    let credentials = JSON.parse(localStorage.getItem("credentials"));

    if (nullValues.includes(localStorage.getItem("credentials"))) {
        localStorage.setItem("credentials", `{"type": "Undefined"}`)
    }

    for (let i=1; i<=2; i++) {
        let currentAuthName = "auth"+i;
        if (nullValues.includes(localStorage.getItem(currentAuthName))) {
            localStorage.setItem(currentAuthName, `{"type": "Undefined"}`)
        }
    }

    for (let value in {...localStorage}) {
        if (value.includes("auth")) {
            authList.push({ 
                value: JSON.parse(localStorage.getItem(value)), 
            });
        };
    };  

    return {
        credentials,
        authList,
    };
}

const getProfile = async (name) => {
    let JSON;
    let localUUID = JSON.parse(localStorage.getItem(name || "credentials")).profile
    await fetch(`https://playerdb.co/api/player/minecraft/uuid/${localUUID}`)
    .then(res => res.json())
    .then(out => {data = out})
    .catch(err => console.log(err));
    return {
        name: JSON.data.player.username,
        avatar: JSON.data.player.avatar,
        uuid: JSON.data.player.raw_id,
        dashedUUID: JSON.data.player.id,
        nameHistory: JSON.data.player.meta.name_history,
    }
}

const login = async (user) => {
    await window.api.login().then((loginCreds) => {loginCredentials = loginCreds})

    localStorage.setItem("credentials", loginCredentials);
    localStorage.setItem("auth"+user, loginCredentials);
    window.api.reloadPage();
}

const selectLogin = async (num) => {
    let authID = "auth"+num;
    loginCredentials = localStorage.getItem(authID) !=null ? loginCredentials : `{"type": "NoLogin"}`;

    localStorage.setItem("credentials", loginCredentials);
    
    selectedProfile = num;
    CU_URL = getProfile()
}

const logout = (num) => {
    localStorage.setItem("auth"+num, `{"type": "Logout"}`);
    window.api.reloadPage();
}



const start = async () => {
    let {credentials, authList} = fetchPlayerData();
    console.warn(credentials)
    CUID = getProfileStats().id;
    CU_URL = await getPlayerHead(CUID);
    if (localStorage.getItem("auth1") == localStorage.getItem("credentials")) selectedProfile = 1;
    else selectedProfile = 2;
}

</script>

<main>
    <div class="loginBox clearfix">
        {#await start()}
            <p>Starting Login Component</p>
        {:then}
    
        <img style="display: block;
            height: 100px;  
            float: left;" 
            src={CU_URL||emptyAvatarURL} alt="Died"
        />
            {#each fetchPlayerData() as playerData, index}
            {#if playerData.value.profile}
                <button 
                class:selected={selectedProfile==index+1}
                class="launch"
                on:click={
                async () => {
                    selectLogin(index+1)
                }}>
                {playerData.value.profile.name}
                    <button style="" on:click={ () => logout(index+1)} class="launch">[X]</button>
                </button><br>
            {:else}
                <button class="launch"
                on:click={
                async () => {
                    await login(index+1)
                }}>
                <p class="slate-400">Sign in</p>
                </button><br>
            {/if}
            {/each}
        {/await}
    </div>
</main>

<style>

</style>