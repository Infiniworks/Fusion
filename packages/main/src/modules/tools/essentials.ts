import got from "got";
import { isDev } from "../extensions/constants";
const { createWriteStream } = require("fs-extra");
const { promisify } = require("util");
const fs = require("fs-extra");
const stream = require("stream");
const path = require("path");

const devLog = (message) => {
    if (isDev) console.log(message);
};

const download = async (url, dest) => {
    const pipeline = await promisify(stream.pipeline);
    await fs.ensureFile(dest);
    const downloadStream = got.stream(url);
    const fileWriterStream = await createWriteStream(dest);
    await pipeline(downloadStream, fileWriterStream);
};

const memoryGet = async (memory, identifier) => {
    switch (identifier) {
        case "B":
            return memory;
        case "K":
            return Math.round(memory / 1024);
        case "M":
            return Math.round(memory / 1024 / 1024);
        case "G":
            return Math.round(memory / 1024 / 1024 / 1024);
    }
};

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

export const noHidden = item => {
    const basename = path.basename(item);
    return basename === "." || basename[0] !== ".";
};

export { devLog, download, memoryGet, capitalizeFirstLetter };