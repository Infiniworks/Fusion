export const app_name = "fusion";
const operatingSystem = process.platform + "";
export const osmac = operatingSystem == "darwin";
export const delim = osmac ? "/" : "\\";
export const isDev = process.env.MODE == "development";
