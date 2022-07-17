<script>
  import { cliStats } from '../../data/stores';
  function truncateDecimals (number, digits) {
    var multiplier = Math.pow(10, digits),
        adjustedNum = number * multiplier,
        truncatedNum = Math[adjustedNum < 0 ? 'ceil' : 'floor'](adjustedNum);

    return truncatedNum / multiplier;
  };
  let gameVersions, versions, majorVersions = new Set(), allVersions = new Set(), gameVersion, totalMemory,
    clientMemoryMin = 128, clientMemoryMax, memoryStep,
    clientWidth = 1920, clientHeight = 1080, clientFullscreen = false, trueMaxMemory, clientDisplayMultiplier;
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
    trueMaxMemory = totalMemory - truncateDecimals((totalMemory)/4,0)
    memoryStep = truncateDecimals(trueMaxMemory/50,0)
    clientMemoryMax = truncateDecimals(memoryStep*25,0)
    // console.log(totalMemory+"M");
    // console.log(trueMaxMemory+"M");
    // console.log(memoryStep+"M");
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
  const calculateResolution = (multiplier) => {
    if (multiplier) {
      clientWidth =  16 * 40 * multiplier;
      clientHeight =  9 * 40 * multiplier;
    }
  }
  const collectServerData = async () => {
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
  <!-- Begin Client Elements-->
  <div class = "client">
    <p>
      Memory: {clientMemoryMin}/{clientMemoryMax}MB<br>
      Min: <input type=range bind:value={clientMemoryMin} min=128 max={trueMaxMemory} step={memoryStep}>
      Max: <input type=range bind:value={clientMemoryMax} min=128 max={trueMaxMemory} step={memoryStep}>
      <br>Total System Memory: {totalMemory} MB
    </p>
    <p>
      Selected Version: {gameVersion}
      <input aria-valuetext type=range on:change={existsIn(gameVersion,[...majorVersions])} bind:value={gameVersion} min={parseFloat(res[res.length - 1]["majorVersion"])} max={parseFloat(res[0]["majorVersion"])} step="0.01">
    </p>
    <input on:change={calculateResolution(clientDisplayMultiplier)} type=range min=1 max=6 step="1" bind:value={clientDisplayMultiplier}>
    <input type=checkbox bind:checked={clientFullscreen}>
    <p>Fullscreen: {clientFullscreen}</p>
    <p>Dimensions: {clientWidth}x{clientHeight}</p>

    <button class="launch"
    on:click={
      async () => {
        startClient()
      }
    }>
    Start Client
    </button>
  </div>

  <!-- Begin Server Elements-->

  <div class = "server">
    <p>{serverName} {serverPort}</p>
    <input bind:value={serverName}>
    <input bind:value={serverPort}>
    {@html serverMOTD}
    <p>Players: {serverCurrentPlayers}/{serverMaxPlayers}</p>
    <img src="{serverIcon}" alt="server icon"/>
    <p>Protocol: {serverProtocol}<br>
      Versions: {serverVersions}
    </p>
    <button class="launch"
    on:click={
      async () => {
        collectServerData()
      }
    }>
    ServerStats
    </button>
  </div>

  {:catch error}
	<p style="color: red">{error.message}</p>
  {/await}
</main>


<style>
div.server {
  overflow: hidden;
  text-overflow: clip;
  flex-shrink:0;
}
</style>
