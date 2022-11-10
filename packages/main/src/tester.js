const mods = require("./mods.json");
const modloader = "fabric";
const version = "1.19";
const loaderVersion = "0.14.8";

let modloaderMatch = mods.filter(input => input.modloader === modloader)[0];

let output = modloaderMatch.versions.filter(input => {
    const versionCheck = input.version === version;
    const modloaderCheck = input.loaderVersion === loaderVersion;
    return versionCheck && modloaderCheck;
});

console.log(output);this 