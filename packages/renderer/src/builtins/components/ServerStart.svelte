<script>
  import { serverUrl } from '../../data/stores';
  let URL

  serverUrl.subscribe(value => {
    URL = value;
  });

  const getUrl = async () => {
      serverUrl.set(await window.api.getUrl());
      console.log("Server URL: " + URL)
  }
</script>

<main>
  <button class="launch" on:click={
      async () => {
          getUrl()
      }
  }>Start Server</button>
  {#if URL}
	<button class="launch" on:click={
    async () => {
      window.open('https://www.youtube.com', '_blank', 'nodeIntegration=no');
    }
  }>Open Anonymous Youtube Link</button>
  {/if}
  <p>{URL}</p>
</main>

<style>

</style>
