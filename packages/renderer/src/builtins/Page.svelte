<script>
    import { serverUrl } from '../data/stores';
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
    }> Start Server</button>
    <p>{URL}</p>
</main>

<style>

</style>