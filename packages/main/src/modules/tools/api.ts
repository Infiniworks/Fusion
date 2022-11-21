const fs = require("fs-extra");
const Zip = require("adm-zip");
import * as path from "path";
const decompress = require("decompress");
import got from "got";
import { download, capitalizeFirstLetter } from "./essentials";
import { minecraftPath, tempDir } from "../extensions/paths";

const iJava = async (javaVersion, _javaPath) => {

    // Get Paths from the Directory Specified
    const javaPath = path.join(_javaPath, javaVersion);

    // If the Java Version exists, exit the function.
    if (await fs.exists(javaPath)) {
        return javaPath;
    } 

    // Create a temporary directory to download the Java Version to
    const javaTemp = path.join(_javaPath, "temp");

    // If the computer is running ARM, change the type to AARCH for the download
    const arch = process.arch.replace("arm", "aarch");

    // Use the process.platform as a string to change the OS based on the platform
    let operatingSystem = process.platform + "";

    if (operatingSystem == "win32") {
        operatingSystem = "windows";
    } else if (operatingSystem == "darwin") {
        operatingSystem = "mac";
    }

    // Send a request based on the information provided to get the download info
    const response = await got(
        `https://api.adoptium.net/v3/assets/latest/
${javaVersion}/hotspot
?image_type=jre
&vendor=eclipse
&os=${operatingSystem}
&architecture=${arch}`,
    );

    // Parse the response into a JSON object and create a filename for it
    const info = JSON.parse(response.body)[0];
    const filename = `jdk-${info.version.semver}-jre`;

    // Download Java into the temp directory
    await download(
        info.binary.package.link,
        path.join(javaTemp, `${filename}.zip`),
    );

    // Extract the zip file to the Java Path
    await decompress(path.join(javaTemp, `${filename}.zip`), javaTemp).then(
        async (e) => {
            await fs.move(path.join(javaTemp, e[0].path), javaPath);
        },
    );

    // Remove the temp directory
    await fs.remove(path.join(javaTemp));

    return javaPath;
};

const iCurseforge = async (mod, version, modsPath, loader) => {
    loader = capitalizeFirstLetter(loader);
    const url = `https://api.curseforge.com/v1/mods/search?gameId=432&gameVersion=${version}&slug=${mod}`;
    const response = await got(url, {
        headers: {
            "x-api-key":
                "$2a$10$rb7JRBpgV5mt33y9zxOcouYDxQFE4jj9xK5bZsKd.uky8LdZTgTuO",
        },
    });
    const mods = JSON.parse(response.body);
    const data = mods["data"][0];
    if (data["slug"] == mod) {
        const latestFiles = data["latestFiles"];
        for (const latestFile in latestFiles) {
            const file = data["latestFiles"][latestFile];
            if (
                file["gameVersions"].includes(loader) &&
                file["gameVersions"].includes(version)
            ) {
                const downloadURL = file["downloadUrl"];
                const name = file["fileName"] || `${mod}-${file["id"]}.jar`;
                const filename = path.join(modsPath, name);

                if (!(await fs.pathExists(filename))) {
                    console.error(
                        `Downloading CringeForge ${version} Mod! *CF`,
                    );
                    console.log(`${mod} <== npm @ (node-curseforge)`);
                    await download(downloadURL, filename);
                    return filename;
                } else {
                    console.error(`File ${filename} already exists! *CF`);
                    return filename;
                }
            }
        }
    }
};

const iModrinth = async (mod, version, modsPath, loader) => {
    const url = `https://api.modrinth.com/v2/project/${mod}/version?game_versions=["${version}"]
    &loaders=["${loader}"]`;
    const response = await got(url);
    const results = JSON.parse(response.body);
    for (const result in results) {
        const file = results[result];

        // Use the primary file provided, otherwise just continue.
        let files = file["files"].filter((x) => x["primary"] == true);
        if (files.length < 1) {
            files = file["files"];
        }
        
        const downloadURL = files[0]["url"];
        const filename = path.join(modsPath, files[0]["filename"]);

        if (!(await fs.pathExists(filename))) {
            console.error(`Downloading Modrinth ${version} Mod!`);
            console.log(`${mod} <== (${url})`);
            await download(downloadURL, filename);
            return filename;
        } else {
            console.error(`File ${filename} already exists!`);
            return filename;
        }
    }
};

const iCollection = async (collection) => {
    const collectionsPath = path.join(minecraftPath,"collections");
    const filename = `${collection}.zip`;
    console.log("Updating collection "+filename);
    await download(
        `https://github.com/AlphaUpstream/FusionRepo/raw/main/${filename}`, 
        path.join(tempDir,filename),
            ).catch((e)=>console.error(e));
    await new Zip(path.join(tempDir,filename)).extractAllTo(collectionsPath,true);
    await fs.remove(path.join(tempDir, filename));
};

export { iCollection, iJava, iCurseforge, iModrinth };

