<script>
  import { cliStats } from '../../data/stores';
  function truncateDecimals (number, digits) {
    var multiplier = Math.pow(10, digits),
        adjustedNum = number * multiplier,
        truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
  };
  let gameVersions, versions, majorVersions = new Set(), allVersions = new Set(), gameVersion, totalMemory,
    gameMemory, clientMemoryMin = 128, clientMemoryMax, memoryStep,
    clientWidth, clientHeight, clientFullscreen, calcMaxMem;
  // for (const version of gameVersions) {
  //   console.log(version)
  // };
  function existsIn(value, list) {
    console.log(list.includes(value+""))
  };

  let data, serverMOTD, serverIcon, serverCurrentPlayers, serverMaxPlayers, serverVersions, serverProtocol, serverName = "mc.hypixel.net", serverPort = 25565;
  cliStats.subscribe(value => {
    data = value;
  });

  const start = async () => {
    gameVersions = JSON.parse(JSON.stringify(await window.api.getVersions()));
    gameVersions.some(version => {
      majorVersions.add(version.majorVersion);
      allVersions.add(version.minecraftVersion);
    })
    versions = [...allVersions].filter(v =>
      !v.includes("pre") && !v.includes("snapshot") && !v.includes("w") && !v.includes("rc")
    );
    // console.log([...majorVersions]);
    // console.log([...allVersions]);
    // console.log(versions);
    gameVersion = gameVersions[0].majorVersion
    totalMemory = truncateDecimals(await window.api.totalMemory()/1048576,0)
    calcMaxMem = totalMemory - truncateDecimals((totalMemory)/4,0)
    memoryStep = truncateDecimals(calcMaxMem/50,0)
    clientMemoryMax = truncateDecimals(memoryStep*25,0)
    console.log(totalMemory+"M");
    console.log(calcMaxMem+"M");
    console.log(memoryStep+"M");
    return gameVersions;
  }
  let gameOptions = {
    version: gameVersion,
    memMax: clientMemoryMax+"M",
    memMin: clientMemoryMin+"M",
    width: clientWidth,
    height: clientHeight,
    fullscreen: clientFullscreen,
  }
  const getData = async () => {
    cliStats.set(await window.api.getServerStats(serverName, parseInt(serverPort)));
    serverIcon = data.favicon;
    serverMOTD = data.motd.html;
    serverCurrentPlayers = data.players.online;
    serverMaxPlayers = data.players.max;
    serverVersions = data.version.name;
    serverProtocol = data.version.protocol;
    console.log(data)
  }
  const startClient = () => {
    window.api.startClient(gameOptions);
  }
  // 160 --> 120
</script>


<main>
  {#await start()}
  <p>Loading</p>
  {:then res}
  <button class="launch"
  on:click={
    async () => {
      startClient()
    }
  }>
  Start Client
  </button>

  <button class="launch"
  on:click={
    async () => {
      getData()
    }
  }>
  ServerStats
  </button>
  <button class="launch"
  on:click={
    async () => {
      console.log(res)
    }
  }>
  Resources
  </button>
  <p>{gameVersion}</p>
  <p>{clientMemoryMin}/{clientMemoryMax}</p>
  <p>{gameVersion}</p>
  <p>{totalMemory}</p>
  <p>{JSON.stringify(res[0]["minecraftVersion"])}</p>
  <input aria-valuetext type=range on:change={existsIn(gameVersion,[...majorVersions])} bind:value={gameVersion} min={parseFloat(res[res.length - 1]["majorVersion"])} max={parseFloat(res[0]["majorVersion"])} step="0.01">
  <input type=range bind:value={clientMemoryMin} min=128 max={calcMaxMem} step={memoryStep}>
  <input type=range bind:value={clientMemoryMax} min=128 max={calcMaxMem} step={memoryStep}>
  <p>{serverName} {serverPort}</p>
  <input bind:value={serverName}>
  <input bind:value={serverPort}>
  <input type=range step="40" bind:value={clientWidth}>
  <input type=range step="40" bind:value={clientHeight}>
  <input type=checkbox bind:checked={clientFullscreen}>
  {@html serverMOTD}
  <p>Players: {serverCurrentPlayers}/{serverMaxPlayers}</p>
  <img src="{serverIcon}" alt="server icon"/>
  <p>Protocol: {serverProtocol}<br>
    Versions: {serverVersions}
  </p>
  {:catch error}
	<p style="color: red">{error.message}</p>
  {/await}
</main>


<style>

</style>
