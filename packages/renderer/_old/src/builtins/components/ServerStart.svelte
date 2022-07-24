<script>
  import { serverUrl, serverStats } from '../../data/stores';
  let data, serverMOTD, serverIcon, serverCurrentPlayers, serverMaxPlayers, serverVersions, serverProtocol, serverName = "mc.hypixel.net", serverPort = 25565;
  let URL;

  serverUrl.subscribe(value => {
    URL = value;
  });
  serverStats.subscribe(value => {
    data = value;
  });

  const getUrl = async () => {
    serverUrl.set(await window.api.getUrl());
    console.log("Server URL: " + URL)
  }

  const collectServerData = async () => {
    serverStats.set(await window.api.getServerStats(serverName, parseInt(serverPort)));
    serverIcon = data.favicon;
    serverMOTD = data.motd.html;
    serverCurrentPlayers = data.players.online;
    serverMaxPlayers = data.players.max;
    serverVersions = data.version.name;
    serverProtocol = data.version.protocol;
    console.log(data)
  }
</script>

<main>
  <button class="launch" on:click={
      async () => {
          getUrl()
      }
  }>Start Server</button>
  {#if URL}
  <p>{URL}</p>
  {/if}

  
  <p>{serverName} {serverPort}</p>
  <input bind:value={serverName}>
  <input bind:value={serverPort}> <br><br><br><br>

  <div class = "block">  
    <img class="block" src="{serverIcon}" alt="Server Icon"/>
    {@html serverMOTD}
    <p>
      Players: {serverCurrentPlayers}/{serverMaxPlayers} <br>
      Versions: {serverVersions}
    </p>
  </div>
  <button class="launch"
  on:click={
    async () => {
      collectServerData()
    }
  }>
  ServerStats
  </button>
</main>

<style>

</style>
