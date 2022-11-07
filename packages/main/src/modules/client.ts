const fs = require("fs-extra");
import { installFabric, getFabricLoaderArtifact } from "@xmcl/installer";
import * as path from "path";
const msmc = require("msmc");
const { Client } = require("minecraft-launcher-core");
const launcher = new Client();
import mods from "../mods.json";

import { getCurseforgeMod, getJava, getModrinthMod } from "./api";
import { disc } from "./hooks";
import { download } from "./tools";

const minecraftPath = path.join(__dirname, "..", "..", "..", "minecraft");
const resourcesPath = path.join(minecraftPath, "resources");

let rootDir;

const startClient = async (options) => {
    const startTime = performance.now();
    rootDir = path.join(minecraftPath, "instances", options.clientName);

    const installation = await install(
        options.modloader,
        options.version,
        options.clientName,
        options,
    );
    const version = installation.versionName;

    const opts = {
        clientPackage: null,
        authorization: msmc.getMCLC().getAuth(options.authentication),
        root: rootDir,
        version: {
            number: options.version,
        },
        memory: {
            min: options.memory,
            max: options.memory,
        },
        javaPath: installation.java,
        overrides: {
            maxSockets: options.maxSockets,
            libraryRoot: path.join(resourcesPath, "libraries"),
            assetRoot: path.join(resourcesPath, "assets"),
        },
        customArgs: [
            `-Dorg.lwjgl.librarypath=${path.join(resourcesPath, "lwjgl")}`,
            "-Dorg.lwjgl.util.Debug=true",
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

    if (options.modloader == "forge") {
        opts["forge"] = path.join(rootDir, "forge.jar");
    }
    if (options.modloader == "fabric") {
        opts["version"]["custom"] = version;
    }

    console.error(`Starting Fusion Client ${version}!`);
    disc.activity = "Minecraft " + options.version;

    console.error(
        `Time taken: ${(performance.now() - startTime).toFixed(2)}ms`,
    );

    const fullLog = path.join(
        resourcesPath,
        "logs",
        options.version + Date.now() + ".full.log",
    );
    const gameLog = path.join(
        resourcesPath,
        "logs",
        options.version + Date.now() + ".log",
    );

    fs.ensureFile(fullLog);
    fs.ensureFile(gameLog);

    launcher.launch(opts);
    launcher.on("debug", (e) => {
        console.log(e);
    });
    launcher.on("data", (e) => {
        // Full log
        fs.appendFileSync(fullLog, e);
        if (e.includes("[main/INFO]") || e.includes("[Render thread/INFO]")) {
            // Skim log
            fs.appendFileSync(gameLog, e);
            console.log(e);
        }
        if (e.includes("Sound engine started")) {
            console.error(
                `Total Launch Time taken: ${(
                    performance.now() - startTime
                ).toFixed(2)}ms`,
            );
        }
        if (e.includes("[Render Thread/WARN]")) {
            console.error(e);
        }
    });
    launcher.on("close", async (e) => {
        console.log("Closed:", e);
        disc.activity = "Launcher Screen";
    });
};
let modloader;
const install = async (modloader2, version, instance, fullOptions) => {
    modloader = modloader2;
    let versionName;
    // Get Information
    const modloaderMatch = mods.filter(
        (input) => input.modloader === modloader,
    )[0];
    const filteredResult = modloaderMatch.versions.filter((input) => {
        const versionCheck = input.version === version;
        return versionCheck;
    });

    // Install Java
    const javaVersion = filteredResult[0].java;
    const javaPath = path.join(minecraftPath, "java", javaVersion);
    const javaTemp = path.join(minecraftPath, "java", "temp");
    const arch = process.arch.replace("arm", "aarch");
    if (fullOptions.online) {
        await getJava(javaVersion, javaPath, javaTemp, arch).then(() =>
            console.log("Java installed!"),
        );
    }

    let java = path.join(javaPath, "bin", "javaw");
    if (process.platform === "darwin") {
        java = path.join(javaPath, "Contents", "Home", "bin", "java");
    }

    // Install Minecraft
    const loaderVersion = filteredResult[0].loaderVersion;
    const instancesPath = path.join(minecraftPath, "instances", instance);

    version = filteredResult[0].version ? filteredResult[0].version : version;

    fs.remove(path.join(minecraftPath, "shared", "mods"));
    if (fullOptions.online) {
        if (modloader == "fabric") {
            versionName = version + "-fabric" + loaderVersion;
            const versionList = getFabricLoaderArtifact(
                version,
                loaderVersion,
            );
            installFabric(await versionList, instancesPath).then((result) => {
                versionName = result;
                console.log("Fabric installed!");
            });
        }
        if (modloader == "forge") {
            await download(
                filteredResult[0].loaderUrl,
                path.join(instancesPath, "forge.jar"),
            );
            console.log("Forge Installed!");
        }
    }
    loadMods(filteredResult);
    console.log("Installation complete!");

    return {
        java,
        javaPath,
        versionName,
    };
};

const getVersions = (modloader) => {
    const versions = mods.filter((data) => data.modloader == modloader)[0]
        .versions;
    const versionList: string[] = [];
    versions.forEach((version) => versionList.push(version.version));
    return versionList;
};

const login = async () => {
    return await msmc.fastLaunch("electron");
};

const loadMods = async (filteredResult) => {
    const modsPath = path.join(resourcesPath, "mods");
    await Promise.allSettled(
        filteredResult[0].mods.map(async (mod) => {
            let modFilePath;
            const modVersion = mod.version;
            if (mod.source === "modrinth") {
                modFilePath = await getModrinthMod(
                    mod.slug,
                    modVersion,
                    modsPath,
                    modloader,
                );
            } else if (mod.source === "curseforge") {
                modFilePath = await getCurseforgeMod(
                    mod.slug,
                    modVersion,
                    modsPath,
                    modloader,
                );
            } else if (mod.source === "link") {
                modFilePath = path.join(modsPath, mod.name + ".jar");
                if (!(await fs.pathExists(mod.name + ".jar"))) {
                    console.log(`Special download: ${mod.name}`);
                    await download(mod.link, modFilePath);
                } else {
                    console.log(`Special download already exists: ${mod.name}`);
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
                path.join(rootDir, "mods", path.basename(modFilePath)),
                "file",
            );
        }),
    );
};

export { startClient, install, getVersions, login, loadMods };