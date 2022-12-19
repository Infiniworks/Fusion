import * as path from "path";
import { app_name } from "./constants";
const storageFolder = process.env.APPDATA || 
(process.platform == "darwin" 
? process.env.HOME + "/Library/Preferences" 
: process.env.HOME + "/.local/share");

const appFolder = path.join(storageFolder,app_name);
const minecraftPath = path.join(appFolder,"minecraft");
const mcResourcesPath = path.join(appFolder,"minecraft", "resources");
const resources = path.join(appFolder,"resources");
const javaLoc = path.join(resources, "java");
const tempDir = path.join(resources, "temp");

export { appFolder, minecraftPath, javaLoc, tempDir, resources, mcResourcesPath };