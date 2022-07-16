<script>
  import { cliStats } from '../../data/stores';
  let data, motd, serverIcon, players, maxPlayers, versions, protocol, serverName = "mc.hypixel.net", serverPort = 25565;
  cliStats.subscribe(value => {
    data = value;
  });

  const getData = async () => {
    cliStats.set(await window.api.getServerStats(serverName, parseInt(serverPort)));
    serverIcon = data.favicon;
    motd = data.motd.html;
    players = data.players.online;
    maxPlayers = data.players.max;
    versions = data.version.name;
    protocol = data.version.protocol;
    console.log(data)
  }
</script>

<main>
  <button class="launch" on:click={
    async () => {
      getData()
    }
  }>Start Client</button>
  <p>{serverName} {serverPort}</p>
  <input bind:value={serverName}>
  <input bind:value={serverPort}>
  {@html motd}
  <p>Players: {players}/{maxPlayers}</p>
  <img src="{serverIcon}" alt="server icon"/>
  <p>Protocol: {protocol}<br>
    Versions: {versions}
  </p>
</main>

<style>

</style>
