<script>
    import InstallButton from "./InstallButton.svelte";
    let style = "neutral"
    const versionsList = ['joe', 'jane', 'mary']
    const onChange = (the) => {
        neoValue = the.currentTarget.value
        console.log("happened")
        if (versionsList.includes(neoValue)) style = "correct"
        else style = "incorrect"
    }
    let version = 19;

</script>
<h1>Choose a version:</h1>
<p>1.{version}</p>


<div class = {style}>
<InstallButton bind:version={version}/>
</div>

<input type=range on:change={onChange} bind:value={version} min=8 max=19>

<style>
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