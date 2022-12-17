const fs = require("fs-extra");
import { installFabric, getFabricLoaderArtifact } from "@xmcl/installer";
import * as path from "path";
const msmc = require("msmc");
const { Client } = require("minecraft-launcher-core");
const launcher = new Client();
import { timer as Timer } from "./tools/timer";

import { iJava, iCurseforge, iModrinth, vModrinth } from "./tools/api";
import { disc } from "./tools/hooks";
import { devLog, download } from "./tools/essentials";
import { appFolder, javaLoc } from "./extensions/paths";

const minecraftPath = path.join(appFolder, "minecraft");
const resourcesPath = path.join(minecraftPath, "resources");

class client {
    private credentials;
    public creation_time = new Date();
    public timer = new Timer();
    
    public clientDirectory;
    public gameDirectory;
    public config;
    public pack;
    private options;
    
    public constructor(_clientDirectory) {
        this.clientDirectory = _clientDirectory;
        fs.ensureDirSync(this.clientDirectory);
        this.pack = fs.readJSONSync(path.join(this.clientDirectory, "pack.json"));
    }

    private patchOptions (options, java) {
        this.options = {
            clientPackage: null,
            authorization: msmc.getMCLC().getAuth(options.authentication),
            root: this.gameDirectory,
            version: {
                number: this.pack.version,
            },
            memory: {
                min: options.memory,
                max: options.memory,
            },
            javaPath: java,
            overrides: {
                maxSockets: options.maxSockets,
                libraryRoot: path.join(resourcesPath, "libraries"),
                assetRoot: path.join(resourcesPath, "assets"),
            },
            customArgs: [
                // `-Dorg.lwjgl.librarypath=${path.join(resourcesPath, "libraries", "org", "lwjgl")}`,
                // "-Dorg.lwjgl.util.Debug=true",
                "-XX:+UseG1GC",
                "-XX:+ParallelRefProcEnabled",
                "-XX:MaxGCPauseMillis=200",
                "-XX:+UnlockExperimentalVMOptions",
                "-XX:+DisableExplicitGC",
                "-XX:+AlwaysPreTouch",
                "-XX:G1NewSizePercent=30",
                "-XX:G1MaxNewSizePercent=40",
                "-XX:G1HeapRegionSize=8M",
                "-XX:G1ReservePercent=20",
                "-XX:G1HeapWastePercent=5",
                "-XX:G1MixedGCCountTarget=4",
                "-XX:InitiatingHeapOccupancyPercent=15",
                "-XX:G1MixedGCLiveThresholdPercent=90",
                "-XX:G1RSetUpdatingPauseTimePercent=5",
                "-XX:SurvivorRatio=32",
                "-XX:+PerfDisableSharedMem",
                "-XX:MaxTenuringThreshold=1",
            ],
        };
    }

    public init = async (options) => {
    
        this.gameDirectory = path.join(this.clientDirectory, "runtime");

        const javaPath = await iJava(this.pack.java, javaLoc);
        
        const java = process.platform === "darwin" ? 
            path.join(javaPath, "Contents", "Home", "bin", "java") : 
            path.join(javaPath, "bin", "javaw");
        
        this.patchOptions(options, java);

        if (this.pack.modloader == "fabric") {
            const versionList = getFabricLoaderArtifact(
                this.pack.version,
                this.pack.loaderVersion,
            );
            installFabric(await versionList, this.gameDirectory).then(
                (result) => {
                    this.options["version"]["custom"] = result;
                },
            ).catch((e)=>console.error("Invalid Mod Setup in pack.json" + e));
        }
        if (this.pack.modloader == "forge") {
            await download(
                this.pack.loaderUrl,
                path.join(this.gameDirectory, "forge.jar"),
            );
            this.options["forge"] = path.join(this.gameDirectory, "forge.jar");
        }
        
        const mods = await fs.readJSON(path.join(this.clientDirectory,"mods.json"));

        const modsPath = path.join(this.clientDirectory,"resources","mods");
        await Promise.allSettled(
            mods.map(async (mod) => {
                let modFilePath;

                if (mod.version == undefined) {
                    mod.version = this.pack.version;
                }
                
                const modVersion = mod.version;
                
                if (mod.source === "modrinth") {
                    modFilePath = await vModrinth(
                        {
                            mod: mod.slug,
                            version: modVersion,
                            loader: this.pack.modloader,
                            path: modsPath,
                            hash: mod.hash,
                        },
                    );
                } else if (mod.source === "curseforge") {
                    modFilePath = await iCurseforge(
                        mod.slug,
                        modVersion,
                        modsPath,
                        this.pack.modloader,
                    );
                } else if (mod.source === "link") {
                    modFilePath = path.join(modsPath, mod.name + ".jar");
                    if (!(await fs.pathExists(mod.name + ".jar"))) {
                        devLog(`Special download: ${mod.name}`);
                        await download(mod.link, modFilePath);
                    } else {
                        devLog(`Special download already exists: ${mod.name}`);
                    }
                }
                if (mod.overrides) {
                    const overrides = mod.overrides;
                    if (overrides.filename) {
                        const newFilename = path.join(
                            path.dirname(modFilePath),
                            overrides.filename,
                        );
                        await fs.move(modFilePath, newFilename);
                        modFilePath = newFilename;
                    }
                }
                await fs.ensureSymlink(
                    modFilePath,
                    path.join(this.gameDirectory, "mods", path.basename(modFilePath)),
                    "file",
                );
            }),
        );
    };

    public start = async () => {
        this.timer.start();
    
        console.error(`Starting Fusion Client ${this.pack.version}!`);
        disc.activity = "Minecraft " + this.pack.version;
    
        const fullLog = path.join(
            resourcesPath,
            "logs",
            Date.now() + "_" + this.pack.version + ".full.log",
        );
        const gameLog = path.join(
            resourcesPath,
            "logs",
            Date.now() + "_" + this.pack.version + ".log",
        );
    
        fs.ensureFile(fullLog);
        fs.ensureFile(gameLog);
    
        launcher.launch(this.options);
        
        launcher.on("debug", (e) => {
            // devLog(e);
        });
        launcher.on("data", (e) => {
            // Full log
            fs.appendFileSync(fullLog, e);
            if (e.includes("[main/INFO]") || e.includes("[Render thread/INFO]")) {
                // Skim log
                fs.appendFileSync(gameLog, e);
                devLog(e);
            }
            if (e.includes("Sound engine started")) {
                this.timer.stop();
                console.error(
                    `Total Launch Time taken: ${(
                        this.timer.getDuration()
                    ).toFixed(2)}ms`,
                );
            }
            if (e.includes("[Render Thread/WARN]")) {
                console.error(e);
            }
            return "success";
        });
        launcher.on("close", async (e) => {
            console.log("Closed:", e);
            disc.activity = "Launcher Screen";
            return "closed";
        });
    };
}

export const login = async () => {
    return JSON.stringify(await msmc.fastLaunch("electron"));
};

export const packData = async (unparsedData) => {
    const arg1 = unparsedData;
    let pack;
    if (arg1.clientType == "collection") {
    pack = await fs.readJSON(path.join(path.join(minecraftPath, "collections", arg1.collection, arg1.client), "pack.json"));
    } else if (arg1.clientType == "client") {
    pack = await fs.readJSON(path.join(minecraftPath, "clients", arg1.client));
    }
    return pack;
};

export { client };