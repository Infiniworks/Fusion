<script>
const getGameOpts = async () => {
    return { 
        clientName: "default",
        version: "1.19",
        memMax: await window.please.get("freeMemory","M"), //slider.noUiSlider.get()[1]+"M",
        memMin: await window.please.get("freeMemory","M"), //slider.noUiSlider.get()[0]+"M",
        authentication: getAuth(),
        maxSockets: 5,
        customVersion: "fabric-loader-0.14.8-1.19", // cv,
    }
}

const getAuth = () => {
    return JSON.parse(localStorage.getItem("users"))[localStorage.getItem("selected")];
}
</script>

<button class="launch" on:click={async () => {
    window.please.get("startClient", await getGameOpts())
}}>Start Client</button>

<button class="mods" on:click={async () => {
    window.please.get("install")
}}>CLOG mods</button>

<style>
button.launch {
    background-color: red;
}    
button.mods {
    background-color: green;
}
</style>