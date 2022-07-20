<script>
  import { serverUrl } from '../../data/stores';
  let data, serverMOTD, serverIcon, serverCurrentPlayers, serverMaxPlayers, serverVersions, serverProtocol, serverName = "mc.hypixel.net", serverPort = 25565;
  let URL;

  serverUrl.subscribe(value => {
    URL = value;
  });

  const getUrl = async () => {
    serverUrl.set(await window.api.getUrl());
    console.log("Server URL: " + URL)
  }

  const collectServerData = async () => {
    serverUrl.set(await window.api.getServerStats(serverName, parseInt(serverPort)));
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
	<!--<button class="launch" on:click={
    async () => {
      window.open('https://www.youtube.com', '_blank', 'nodeIntegration=no');
    }
  }>Open Anonymous Youtube Link</button>-->
  {/if}
  <p>{URL}</p>

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
</main>

<style>

</style>
