const DiscordRPC = require("discord-rpc-patch");

class discord {
    clientId: string;
    rpc: typeof DiscordRPC;
    startTime: Date;
    defaultStatus = "Launcher Screen";
    imageName = "fusion";
    activity:string;
    buttons = [
        {
            label: "Downloads",
            url: "https://github.com/AlphaUpstream/Fusion",
        },
    ];

    constructor() {
        this.clientId = "1001858478618447952";
        this.rpc = new DiscordRPC.Client({ transport: "ipc" });
        this.startTime = new Date();
        this.activity = this.defaultStatus;
        DiscordRPC.register(this.clientId);
    }
    async init() {
        this.rpc.on("ready", async () => {
            await this.updatePresence(this.activity);

            setInterval(async () => {
                await this.updatePresence(this.activity);
            }, 6e1);
        });
        this.rpc.login({ clientId: this.clientId }).catch(console.error);
    }
    async updatePresence(activity) {
        this.rpc.setActivity({
            details: `Playing ${activity || this.defaultStatus}`,
            buttons: this.buttons,
            startTimestamp: this.startTime,
            largeImageKey: this.imageName,
        }).catch(console.error);
    }
}

const disc = new discord();

export { disc };