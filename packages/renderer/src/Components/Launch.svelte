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
const json = 
[
    {
    hashes: {
    sha1: '5bc08411344e027cac4467763740f18626dae3ae',
    sha512: 'bebc53ee5752263ccf1e0a89b5f9f72c3c5be149467e9d66a15c335f8c616a2b8e7c7020208b291af425b31d3062e2ca305ab0f1a0142d947f12910d4bebd71b'        
    },
    url: 'https://cdn.modrinth.com/data/9s6osm5g/versions/7.0.73+fabric/cloth-config-7.0.73-fabric.jar',
    filename: 'cloth-config-7.0.73-fabric.jar',
    primary: true,
    size: 1126254
    }
];
console.log(json[0]["url"]);
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