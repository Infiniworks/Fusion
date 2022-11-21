export const app_name = "fusion";
const operatingSystem = process.platform + "";
export const osmac = operatingSystem == "darwin";
export const delim = osmac ? "/" : "\\";

