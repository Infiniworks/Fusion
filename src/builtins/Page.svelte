<script>
    import { serverUrl } from '../data/stores';
    let sURL
    
    serverUrl.subscribe(value => {
		sURL = value;
	});

    const getUrl = async () => {
        serverUrl.set(await window.api.getUrl());
        console.log("Server URL: " + sURL)
    }
</script>

<main>
    <button class="launch" on:click={
        async () => {
            getUrl()
        }
    }> Start Server</button>
    <p>{sURL}</p>
</main>

<style>

</style>