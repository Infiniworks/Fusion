<script>
    let style = "neutral"
    let serverUrl
    const versionsList = ["8","19"]
    const onChange = (the) => {
        version = the.currentTarget.value
        console.log("happened")
        if (versionsList.includes(version)) style = "correct"
        else style = "incorrect"
    }
    let version = 19;
   
    const getServerUrl = async () => {
        serverUrl = await window.server.start();
    }
</script>

<main>
    <h1>Choose a version:</h1>
    <p>1.{version}</p>
    <button class = {style}>
        {version}
    </button>
    <input type=range on:change={onChange} bind:value={version} min=8 max=19>
    <button class="launch" on:click={() => {getServerUrl()}}>
        Start Server</button>
    <p>{serverUrl}</p>

</main>

<style>
button {
    border-radius: 5px;
    float: right;
    text-align: center;
    padding:15px;
    -webkit-app-region: no-drag;
}
.neutral {
    background: #f4f4f4;
}
.incorrect {
    background: #ba1818;
}
.correct {
    background: #09ee28;
}
</style>