import * as util from "minecraft-server-util";
const ngrok = require("ngrok");

const getServerStats = async (server, port) => {
    console.log(server, port);
    return await util
        .status(server, port, {
            timeout: 1000 * 5,
            enableSRV: true,
        })
        .then((result) => {
            return result;
        })
        .catch((error) => console.error(error));
};

const awaitUrl = async () => {
    const urlServer = await ngrok.connect({
        proto: "tcp",
        addr: 25565,
        authtoken: "1r7Om4dKZGppn414jclOabclLsV_5MfjTVsiTBXmwQqZp7QBK",
    });
    if (urlServer) return urlServer;
    else return "urlServer fetch rejected";
};

export { getServerStats, awaitUrl };