<script>
let typeClass = localStorage.getItem("selected") !==null ? "launch" : "angwy";
let clientMSG = typeClass == "launch" ? "Launch Client" : "Login First!";
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

<button class={typeClass} on:click={async () => {
    if (localStorage.getItem("selected")) {
        window.please.get("startClient", await getGameOpts())
    }
    else {
        alert = ("Login First!");
    }
    
}}>
{clientMSG}
</button>

<style>
button.launch {
    background-color: #16a34a;
    color: rgb(197, 197, 197);
    width: 100%;
    height: 100%;
    transition-timing-function: ease-in-out;
    transition: all 3.3333s;
    box-shadow: 0 0 1px rgba(0,0,0,0.75);
    clip-path: inset(0px 0px -15px 0px);
}
button.launch:hover {
    background-color: #0ac850;
    color: #ffffff;
    box-shadow: 0 0 30px rgba(0,0,0,0.75);
    clip-path: inset(0px 0px -30px 0px);
}
button.angwy {
    background-color: #a31616;
    color: rgb(197, 197, 197);
    width: 100%;
    height: 100%;
    transition-timing-function: ease-in-out;
    transition: all 3.3333s;
    box-shadow: 0 0 1px rgba(0,0,0,0.75);
    clip-path: inset(0px 0px -15px 0px);
}
</style>