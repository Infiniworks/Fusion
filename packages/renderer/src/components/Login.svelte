<script>
let selectedProfile, loginCredentials;
const nullValues = [undefined, null, ""];
const fetchPlayerData = (numIdent) => {
    let localData = [];
    if (numIdent == -2) {
        if (nullValues.includes(localStorage.getItem("credentials"))) {
            localStorage.setItem("credentials", `{"type": "Undefined"}`)
        }
        for (let i=1; i<=2; i++) {
            let currentAuthName = "auth"+i;
            if (nullValues.includes(localStorage.getItem(currentAuthName))) {
                localStorage.setItem(currentAuthName, `{"type": "Undefined"}`)
            }
            console.log(i + " has been validated")
        }
        return
    }

    if (numIdent == -1) {
        return JSON.parse(localStorage.getItem("credentials"));
    }

    if (numIdent == 0) {
        localData.push(
        {
            value: JSON.parse(localStorage.getItem("credentials")),
        }
        );
        console.log(localData);
        return localData;
    }

    else {
        let storageValues = [];
        storageValues = {...localStorage};
        for (let value in storageValues) {
        if (value.includes("auth")) {
            localData.push(
            {
                value: JSON.parse(localStorage.getItem(value)),
            }
            );
        }
        }
        return localData;
    }
}

const login = async (user) => {
    await window.api.login().then((loginCreds) => {loginCredentials = loginCreds})

    console.log(loginCredentials);

    localStorage.setItem("credentials", loginCredentials);
    localStorage.setItem("auth"+user, loginCredentials);
    window.api.reloadPage();
}

const selectLogin = async (num) => {
    let authID = "auth"+num;
    loginCredentials = localStorage.getItem(authID);
    loginCredentials = loginCredentials!=null ? loginCredentials : {};
    console.log(loginCredentials);

    localStorage.setItem("credentials", loginCredentials);
    selectedProfile = num;
    console.log(loginCredentials)
    let CCC = getProfileStats(authID).id
    CU_URL = await getPlayerHead(CCC)
}

const logout = (num) => {
  localStorage.setItem("auth"+num, "{}");
  window.api.reloadPage();
}

const getProfileStats = (name) => {
  let pfstats = JSON.parse(localStorage.getItem(name || "credentials")).profile
  return pfstats
}

const getPlayerHead = async (uuid) => {
  let url = "https://playerdb.co/api/player/minecraft/uuid/"+uuid;
  let returnedJSON;
  let avatarURL;
  await fetch(url) .then(res => res.json())
  .then(out => {returnedJSON = out})
  .catch(err => console.log(err));
  // fetch(url).then((result) => {returnedJSON = result.json()});
  console.log(returnedJSON);
  if (returnedJSON.success == true) {
    avatarURL = returnedJSON.data.player.avatar;
  } else {
    avatarURL = emptyAvatarURL;
  }
  console.log(avatarURL+" ");
  return avatarURL;
} 
let CU_URL, CUID;
const start = async () => {
// In start 
    await fetchPlayerData(-2);
    await fetchPlayerData();
    CUID = getProfileStats().id;
    CU_URL = await getPlayerHead(CUID);
    if (localStorage.getItem("auth1") == localStorage.getItem("credentials")) {
        selectedProfile = 1;
    } else {
        selectedProfile = 2;
    }
}

</script>
{#await start()}
<p>Starting Login Component</p>
{:then}
<img style="display: block;
        height: 100px;  
        width: 100px;" 
        src={CU_URL} alt="Died"/><br>
{#each fetchPlayerData() as playerData, index}
    {#if playerData.value.profile}
    <button 
        class:selected={selectedProfile==index+1}
        class="launch"
        on:click={
        async () => {
            selectLogin(index+1)
        }
        }>
    {playerData.value.profile.name} <br>
    <button style="" on:click={ () => logout(index+1)} class="launch">Logout</button>
    </button>
    {:else}
    <button class="launch"
    on:click={
        async () => {
        await login(index+1)
        }
    }>
    Sign in
    <img style="display: block;
        height: 100px;  
        width: 100px;" 
    src={emptyAvatarURL} alt=Sign in/>
    </button>
    {/if}
{/each}
{/await}