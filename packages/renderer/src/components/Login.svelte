<script>
import * as axios from 'axios';
let profilesAmount = 2, skinURL, changes = 0, playerData, profileData, selected;


// Mini Functions :) Cutie Pies
const lGet = (id, parse) => {
    if (parse == "-P") return JSON.parse(localStorage.getItem(id))
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
    let undefinedValues = [undefined, null, "Cancelled", "", "undefined", `{type: "Undefined"}`];
    return undefinedValues.includes(content);
}
const lHas = (id) => {
    let content = lGet(id);
    let undefinedValues = [undefined, null, "Cancelled", "", "undefined", `{type: "Undefined"}`];
    return !undefinedValues.includes(content);
}

const fetchPlayerData = async () => {
    let localUUID, response, hasCredentials, runSelection = true, credentials, authList = [];

    for (let index = 1; index < profilesAmount + 1; index++) {
        if (lNull(`auth${index}`)) {
            lSet(`auth${index}`, `{type: "Undefined"}`);
        }
    }
    if (lHas("credentials") && lGet("credentials","-P").type !== "Cancelled") {
        hasCredentials = true;
        credentials = lGet("credentials");
    } else {
        hasCredentials = false;
    }
    
    if (selected !== 0) {
        if (selected == undefined) {
            selected = 0;
        }
        if (lGet(`auth${selected}`) == lGet("credentials")) {
            runSelection = false;
        } else {
            selected = 0;
        }
        console.log("Selected:", selected);
    }
    let index = 1;
    for (let authName in {...localStorage}) {
        let auth = lGet(authName);
        if (authName.includes("auth")) {
            authList.push({ 
                name: authName,
                value: JSON.parse(auth), 
            });
            
            if (runSelection && hasCredentials) {
                if (auth === lGet("credentials")) {
                    selected = index;
                }
            }
        };
        if (auth == `{"type":"Cancelled","translationString":"Cancelled.GUI"}`) {
            lSet(authName, undefined);
        }
        index++;
    };  
    console.log(authList)
    if (selected != 0) {
        localUUID = JSON.parse(lGet(`auth${selected}`)).profile.id;
        await axios.get(`https://playerdb.co/api/player/minecraft/uuid/${localUUID}`)
        .then((out) => {
            response = out.data.data.player;        
        });
    } else {
        return {
            credentials: lGet("credentials"),
            authList,
        }; 
    };   
    return {
        name:           response.username,
        avatar:         response.avatar,
        uuid:           response.raw_id,
        dashedUUID:     response.id,
        nameHistory:    response.meta.name_history,
        credentials: JSON.parse(lGet("credentials")),
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
    console.log(type)
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
            if (lNull(authID)) {
                console.log("Login")
                await window.api.login()
                .then((loginData) => {
                    lSet(authID, loginData)
                }); 
            }
            // Then, if it exists, set its credentials! :)
            if (lHas(authID)) {
                lSet("credentials", lGet(authID))
                selected = numberID;
            };
            break;
    }
}

const refresh = async (num) => {
    let playerData = await fetchPlayerData();
    skinURL = playerData.avatar;
    changes++;
}

const start = async () => {
}
</script>

<main>
    <div class="loginBox clearfix">
    <img style="display: block;
    height: 100px;  
    float: left;" 
    src={skinURL||"https://crafatar.com/avatars/d479b9f8-f8f8-4f8e-b8f8-f8f8f8f8f8f8"} alt="Default Skin URL"/>
    
    {#key changes}
    {#await fetchPlayerData()}
    <p>Loading Player Data!</p>
    {:then awaitedData}
    {console.log(awaitedData)}
    {#each awaitedData.authList as playerData, i}
        {@const index = i+1}
        {#if playerData.value.profile}
            <button class="launch"
            on:click={
            async () => {
                await dsLog(index)
            }}>
            {playerData.value.profile.name}
            <button on:click={
            async () => {
                await dsLog(index,"logout")
            }}>[X]</button>

            </button><br>
        {:else}
            <button class="launch"
            on:click={
            async () => {
                await dsLog(index)
            }}>
            Sign In
            </button><br>
        {/if} 
    {/each}
    {/await}
    {/key}
    </div>
</main>

<style>

</style>