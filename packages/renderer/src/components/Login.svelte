<script>
const nullValues = [undefined, null, "", "undefined", "[object Object]", `{type: "Undefined"}`];
let CU_URL, CUID, changes = 0, playerData, profileData;

const fetchPlayerData = () => {
    let authList = [];
    let numberingList = [];
    let credentials;
    for (let i=1; i<=2; i++) {
        let currentAuthName = "auth"+i;
        if (nullValues.includes(localStorage.getItem(currentAuthName))) {
            localStorage.setItem(currentAuthName, `{"type": "Undefined"}`)
        }
    }
    for (let value in {...localStorage}) {
        if (value.includes("auth")) {
            if (JSON.parse(localStorage.getItem(value)).type!=="Undefined") {
                authList.push({ 
                    value: JSON.parse(localStorage.getItem(value)), 
                });
                numberingList.push({ 
                    value: JSON.parse(localStorage.getItem(value)), 
                });
            }
            else numberingList.push({value: {profile: ""}});
        };
    };  
    if (nullValues.includes(localStorage.getItem("credentials"))) {
        credentials = (authList.length > 0) ? JSON.stringify(authList[0].value) : `{type: "Undefined"}`;
        localStorage.setItem("credentials", credentials);
    } else {
        credentials = JSON.parse(localStorage.getItem("credentials"));
    }
    return {
        credentials,
        authList,
        numberingList,
    };
}

const getProfile = async (name) => {
    let failure, localUUID, JData;
    if (selectedProfile == 0) {
        failure = true;
    }
    try {localUUID = JSON.parse(localStorage.getItem(`auth${selectedProfile}` || "credentials")).profile.id} catch (e) {failure = true};
    if (!failure) {
        await fetch(`https://playerdb.co/api/player/minecraft/uuid/${localUUID}`)
        .then(res => res.json())
        .then(out => {JData = out})
        .catch(err => console.log(err));
        return {
            name: JData.data.player.username,
            avatar: JData.data.player.avatar,
            uuid: JData.data.player.raw_id,
            dashedUUID: JData.data.player.id,
            nameHistory: JData.data.player.meta.name_history,
        }
    } else {
        return {
            name: "",
            avatar: "",
            uuid: "",
            dashedUUID: "",
            nameHistory: [],
        }
    }
}

const login = async (user) => {
    await window.api.login().then((loginCreds) => {loginCredentials = loginCreds})

    localStorage.setItem("credentials", loginCredentials);
    localStorage.setItem("auth"+user, loginCredentials);
    await refresh();
}

const selectLogin = async (num) => {
    loginCredentials = ( !nullValues.includes(localStorage.getItem(`auth${num}`)) ) ? localStorage.getItem(`auth${num}`) : `{"type": "NoLogin"}`;

    localStorage.setItem("credentials", loginCredentials);

    //@NOTE Should be handled in refresh: selectedProfile = num;
    await refresh(num);
}

const logout = async (num) => {
    localStorage.removeItem("auth"+num);
    localStorage.removeItem("credentials");
    await refresh();
}
const dsLs = (numberID) => {
    localStorage.getItem(`auth${numberID}`);
}
const dsNN = (content) => {
    let undefinedValues = [undefined, null, "", "undefined", `{type: "Undefined"}`];
    return !undefinedValues.includes(content);
}
const localStorageNotNull = (numberID) => {
    return dsNN(dsLs(numberID))
}
const lSet = (id, content) => {
    localStorage.setItem(id, content);
}
const lGet = (id) => {
    return localStorage.getItem(id);
}
const lRem = (id) => {
    localStorage.removeItem(id);
}
const lNull = (id) => {
    let content = lGet(id);
    let undefinedValues = [undefined, null, "", "undefined", `{type: "Undefined"}`];
    return undefinedValues.includes(content);
}
const lHas = (id) => {
    let content = lGet(id);
    let undefinedValues = [undefined, null, "", "undefined", `{type: "Undefined"}`];
    return !undefinedValues.includes(content);
}
const dsLog = async (numberID, type) => {
    let authID = `auth${numberID}`;
    let altID = authID == 1 ? 2 : 1;
    switch(type) {
        case "logout":
            // Logout if localstorage not null for altID
            if (lHas(authID)) lRem(authID);
            // Set Credentials if another account detected
            if (lHas(altID)) lSet("credentials", lGet(altID));
            break;
        case "login":
            // Login if localstorage null for authID
            if (lNull(authID)) await window.api.login()
            .then((loginData) => {
                lSet(authID, loginData)
            }); 
    }
}

const refresh = async (num) => {
    if (!num) {
        if ((localStorage.getItem("auth2"))&&(localStorage.getItem("auth2") == localStorage.getItem("credentials"))) {
            selectedProfile = 2;
        } else if ((localStorage.getItem("auth1"))&&(localStorage.getItem("auth1") == localStorage.getItem("credentials"))) {
            selectedProfile = 1;
        } else {
            selectedProfile = 0;
        }
    } else {
        selectedProfile = num;
    }
    console.log("ProgramAI determined that the profile should be: "+selectedProfile)
    playerData = fetchPlayerData();
    profileData = await getProfile();
    CU_URL = profileData.avatar;
    changes++;
}

const start = async () => {
    await refresh();
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
        src={CU_URL||"https://crafatar.com/avatars/d479b9f8-f8f8-4f8e-b8f8-f8f8f8f8f8f8?overlay"} alt="Died"/>
        {#key changes}
        {#each fetchPlayerData().numberingList as playerData, index}
            {#if playerData.value.profile}
                <button class="launch"
                on:click={
                async () => {
                    dsLog(index+1)
                }}>
                {playerData.value.profile.name || "Sign In"}
                    <button style="" 
                    on:click={
                    async () => {
                        await logout(index+1)
                    }}
                    class="launch">[X]</button>
                </button><br>
            {:else}
                <p class="slate-400">Sign in</p>
            {/if}
        {/each}
        {/key}
    {/await}
    </div>
</main>

<style>

</style>