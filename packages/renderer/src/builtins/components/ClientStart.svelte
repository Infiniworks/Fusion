<script>
  import { serverUrl } from '../../data/stores';
  let URL

serverUrl.subscribe(value => {
  URL = value;
});

  const getUrl = async () => {
    window.api.startClient();
    console.log("Started Client")
  }
</script>

<main>
  <button class="launch" on:click={
      async () => {
          getUrl()
      }
  }> Start Client</button>
  <button class="launch" on:click={
      async () => {
          getUrl()
      }
  }>0</button>
  <p>{URL}</p>
</main>

<style>

</style>
