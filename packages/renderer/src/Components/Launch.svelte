<script>
let typeClass = localStorage.getItem("selected") !==null ? "launch" : "angwy";
let clientMSG = typeClass == "launch" ? "Launch Client" : "Login First!";
let closed = true;
import LinearProgress from '@smui/linear-progress';

const getGameOpts = async () => {
    return { 
        modloader: "forge", //localStorage.getItem("modloader"),
        clientName: "1.8.9", //localStorage.getItem("version"),
        version: "1.8.9", //localStorage.getItem("version"),
        memMax: localStorage.getItem("maxMemory")+"M",
        memMin: localStorage.getItem("minMemory")+"M",
        authentication: getAuth(),
        maxSockets: 8,
    }
}

const getAuth = () => {
    return JSON.parse(localStorage.getItem("users"))[localStorage.getItem("selected")];
}
</script>

<button class={typeClass} on:click={async () => {
    if (localStorage.getItem("selected")) {
        closed = false;
        window.please.get("startClient", await getGameOpts()).then(() => {
            closed = true;
        });
    }
    else {
        alert = ("Login First!");
    }
    
}}>
{clientMSG}
<LinearProgress indeterminate {closed}/>
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