<script>
  import Select from 'svelte-select';
  import { cliStats } from '../../data/stores';
  import * as noUiSlider from 'nouislider';
  import './nouislider.min.css';
  import { initializeApp } from "firebase/app";
  import { getAnalytics } from "firebase/analytics";
  let slider;
  let loginCredentials;
  const firebaseConfig = {
    apiKey: "AIzaSyDBXZNswd-2l7mh12FeC0LOYD3Bo-emLRY",
    authDomain: "fusionlauncher.firebaseapp.com",
    projectId: "fusionlauncher",
    storageBucket: "fusionlauncher.appspot.com",
    messagingSenderId: "707936267212",
    appId: "1:707936267212:web:4d5f87623532a732580b69",
  };
  const nullValues = [undefined, null, ""];

  const app = initializeApp(firebaseConfig);
  const analytics = getAnalytics(app);
  let selectedProfile = 1;

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

    let storageValues = [];
    storageValues = {...localStorage};

    for (let value in storageValues) {
      if (value.includes("auth")) {
        console.log(value);
        localData.push(
          {
            value: JSON.parse(localStorage.getItem(value)),
          }
        );
      }
    }
    return localData
  }
  const login = async (user) => {
    await window.api.login().then((loginCreds) => {loginCredentials = loginCreds})
    
    console.log(loginCredentials);
    
    localStorage.setItem("credentials", loginCredentials);
    localStorage.setItem("auth"+user, loginCredentials);
    window.api.reloadPage();
  }

  const selectLogin = async (num) => {
    loginCredentials = localStorage.getItem("auth"+num);
    loginCredentials = loginCredentials!=null ? loginCredentials : {};
    console.log(loginCredentials);
    
    localStorage.setItem("credentials", loginCredentials);
    selectedProfile = num;
  }

  const logout = (num) => {
    localStorage.setItem("auth"+num, "{}");
    window.api.reloadPage();
  }

  const resolutions = [
    { 
      label: '2560x1440',
      width: 2560,
      height: 1440,},
    {
      label: '1920x1080',
      width: 1920,
      height: 1080,
    },
    {
      label: '1280x720',
      width: 1280,
      height: 720,
    },
    {
      label:"1024x768",
      width: 1024,
      height: 768,
    },
    {
      label:"800x600",
      width: 800,
      height: 600,
    },
  ]

  function truncateDecimals (number, digits) {
    var multiplier = Math.pow(10, digits),
        adjustedNum = number * multiplier,
        truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
  };

  let data, gameVersions, gameVersion, versions, 
  majorVersions = new Set(), allVersions = new Set(), versionsJSON= [],
  totalMemory, clientMemoryMin = 128, clientMemoryMax, 
  memoryStep, trueMaxMemory,
  clientWidth = 1920, clientHeight = 1080, clientFullscreen = false;

  cliStats.subscribe(value => {
    data = value;
  });

  const start = async () => {
    totalMemory = truncateDecimals(await window.api.totalMemory()/1048576,0)
    trueMaxMemory = totalMemory - truncateDecimals((totalMemory)/4,0)
    memoryStep = truncateDecimals(trueMaxMemory/50,0)
    clientMemoryMax = truncateDecimals(memoryStep*25,0)

    gameVersions = JSON.parse(JSON.stringify(await window.api.getVersions()));
    gameVersions.some(version => {
      majorVersions.add(version.majorVersion);
      allVersions.add(version.minecraftVersion);
    })
    versions = [...allVersions].filter(v =>
      !v.includes("pre") && !v.includes("snapshot") && !v.includes("w") && !v.includes("rc")
    );
    gameVersion = gameVersions[0].majorVersion
    for (var i = 0; i < versions.length; i++) {
      versionsJSON.push({
        value: versions[i],
        label: versions[i]
      });
    }
    let formatForSlider = {
      from: (formattedValue) => {
        return Math.round(formattedValue);
      },
      to: (numericValue) => {
        return Math.round(numericValue);
      }
    };
    noUiSlider.create(slider, {
        start: [128, clientMemoryMax],
        connect: true,
        range: {
          min: clientMemoryMin,
          max: totalMemory,
        },
        format: formatForSlider,
        pips: {mode: 'count', values: 5, density: 10},
        tooltips: true,
    });
    let pips = slider.querySelectorAll('.noUi-value');

    function clickOnPip() {
        let value = Number(this.getAttribute('data-value'));
        slider.noUiSlider.set(value);
    }
    for (let i = 0; i < pips.length; i++) {
        // For this example. Do this in CSS!
        // pips[i].style.cursor = 'pointer';
        pips[i].addEventListener('click', clickOnPip);
    }
    await fetchPlayerData(-2);
    await fetchPlayerData();
    return gameVersions;
  }
  const getGameOpts = () => {
    return { 
      version: gameVersion+"",
      memMax: slider.noUiSlider.get()[1]+"M",
      memMin: slider.noUiSlider.get()[0]+"M",
      width: clientWidth+"",
      height: clientHeight+"",
      fullscreen: clientFullscreen,
      authentication: fetchPlayerData(-1),
    }
  }

  
  const startClient = () => {
    window.api.startClient(getGameOpts());
  }
  // 160 --> 120
  const getConsoleLogs = async () => {
    return await window.api.getConsoleLogs().then(await getConsoleLogs());
  }
  let version;
  function versionSelect(event) {
		gameVersion = event.detail.value;
	}
  function resolutionSelect(event) {
		clientWidth = event.detail.width;
    clientHeight = event.detail.height;
	}  
  let emptyAvatarURL = "https://crafatar.com/avatars/d479b9f8-f8f8-4f8e-b8f8-f8f8f8f8f8f8?overlay";
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
  
</script>


<main>
  <!-- Begin Client Elements-->
  <div class = "client">
    <div id="slider" bind:this={slider}/><br><br><br>
    {#await start()}
    <p>Readying up...</p>
    {:then res}
    <p>
      Selected Version: {gameVersion}
      <Select items={versionsJSON} isVirtualList=true placeholder="Select Game Version" on:select={versionSelect}></Select>
      <Select items={resolutions} isVirtualList=true placeholder="Select Resolution" on:select={resolutionSelect}></Select>
    </p>
    
    <input type=checkbox bind:checked={clientFullscreen}>
    
    
    {/await}
    <button class="launch"
    on:click={
      async () => {
        startClient()
      }
    }>
    Start Client
    </button>
    <!--<button class="launch" on:click={ async () => console.log(await login(1))}>Login 1</button>-->
    <br><br>
    {#each fetchPlayerData() as playerData, index}
      {#if playerData.value.profile}
        {#await getPlayerHead(playerData.value.profile.id)}
        <img src={emptyAvatarURL} alt={playerData.value.profile.name}/>
        {:then imgLink}
        <button class="launch"
          on:click={
            async () => {
              selectLogin(index+1)
            }
          }>
          <img style="display: block;
            height: 100px;  
            width: 100px;" 
          src="{imgLink}" alt={playerData.value.profile.name}/><br>
          {playerData.value.profile.name} <br>
          {#if selectedProfile==index+1}
            <span style="color: red;">Selected</span>
          {/if}
          <button style="" on:click={ () => logout(index+1)} class="launch">Logout</button>
          {console.log(index)}
        </button>
        {/await}
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
  </div>

  
</main>


<style>
div.client {
    --border: 3px solid blue;
    --borderRadius: 10px;
    --background: black;
    --placeholderColor: blue;
    --itemIsActiveBG: rgb(0, 255, 102);
    --itemIsActiveColor: black;
    --listBackground: black;
    --itemHoverBG: rgb(23, 23, 23);
  }
#slider {
  padding: 0 16px;
  cursor: pointer;
}
</style>
