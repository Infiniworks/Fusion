<script>
    import { serverUrl } from '../data/stores';
    let sURL
    
    serverUrl.subscribe(value => {
		sURL = value;
	});

    let style = "neutral"
    const versionsList = ["8","19"]
    
    let version = 19;
    
    
    const getUrl = async () => {
        let tempVal = await window.api.getUrl()
        serverUrl.set(tempVal);
        console.log(sURL)
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