<script>
import * as axios from 'axios';
let skinURL, changes = 0, playerData, profileData, selected;

// Mini Functions :) Cutie Pies
const lGet = (id) => {
    return localStorage.getItem(id);
}
const lSet = (id, content) => {
    localStorage.setItem(id, content);
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

const fetchPlayerData = () => {
    let credentials, authList = [];

    for (let value in {...localStorage}) {
        if (value.includes("auth") && lGet(value) !== "") {
            authList.push({ 
                value: JSON.parse(localStorage.getItem(value)), 
            });
        };
    };  

    if (lNull("credentials") && (authList.length > 0)) {
        credentials = JSON.stringify(authList[0].value);
        lSet("credentials", credentials);
    } 
    // Else should work, but using proprietary function for testing
    // Ambiguous result expected
    if (lHas("credentials")) {
        credentials = JSON.parse(localStorage.getItem("credentials"));
    }
    for (let i = 0; i < authList.length; i++) {
        if (lGet(`auth${i+1}`) == lGet(credentials)) {
            console.log(i)
            selected = index;
        };
    };
    return {
        credentials,
        authList,
    };
}

const getProfile = async (name) => {
    console.log(selected)
    let localUUID, response;
    console.log(lGet(`auth${name || selected}`));
    localUUID = JSON.parse(lGet(`auth${name || selected}`)).profile.id
    axios.get(`https://playerdb.co/api/player/minecraft/uuid/${localUUID}`)
    .then((out) => {response = out.data.player;});
    return {
        name:           response.username,
        avatar:         response.avatar,
        uuid:           response.raw_id,
        dashedUUID:     response.id,
        nameHistory:    response.meta.name_history,
    };    
}

const dsLog = async (numberID, type) => {
    if (type == null) type = "dynamic";
    let authID = `auth${numberID}`;
    let altNumberID = numberID == 1 ? 2 : 1;
    let altID = `auth${altNumberID}`;
    switch(type) {
        case "logout":
            // Logout if localstorage not null for altID
            if (lHas(authID)) lSet(authID, "");
            // Set Credentials if another account detected
            if (lHas(altID)) lSet("credentials", lGet(altID));
            // Otherwise set the credentials to undefined
            else lRem("credentials");
            selected = altNumberID;
            break;

        case "login":
            // Login if authID empty
            if (lNull(authID)) await window.api.login()
            .then((loginData) => {
                lSet(authID, loginData)
                lSet("credentials", loginData)
            }); 
            else console.log("Already logged in? An Error Occurred.");
            selected = numberID;
            break;

        case "select":
            // Select if authID empty
            if (lHas(authID)) {
                lSet("credentials", lGet(authID))
                selected = numberID;
            }
            else console.log("No login data detected.");
            break;

        case "dynamic":
            // Login if authID is empty
            if (lNull(authID)) await window.api.login()
            .then((loginData) => {
                lSet(authID, loginData)
            }); 
            // Then, if it exists, set its credentials! :)
            if (lHas(authID)) {
                lSet("credentials", lGet(authID))
                selected = numberID;
            };
            break;
    }
}

const refresh = async (num) => {
    let playerData = fetchPlayerData();
    profileData = await getProfile();
    skinURL = profileData.avatar;
    changes++;
}

const start = async () => {
    await refresh();
}
</script>

<main>
    <div class="loginBox clearfix">
    {#await start()}
        <p>Loading Login Components!</p>
    {:then}
        <img style="display: block;
        height: 100px;  
        float: left;" 
        src={skinURL||"https://crafatar.com/avatars/d479b9f8-f8f8-4f8e-b8f8-f8f8f8f8f8f8"} alt="Default Skin URL"/>
        
        {#key changes}{#each fetchPlayerData().authList as playerData, i}
            {@const index = i+1}
            <button class="launch"
            on:click={
            async () => {
                dsLog(index)
            }}>
            {playerData.value.profile.name||"Sign In"}
                <button style="" 
                on:click={
                async () => {
                    await dsLog(index,"logout")
                }}
                class="launch">[X]</button>
            </button><br>
        {/each}{/key}
    {/await}
    </div>
</main>

<style>

</style>