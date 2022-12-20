export class database {
    dbPath = "";
    constructor(dbPath) {
        this.dbPath = dbPath;
        // window.dbTools.prepareJSON(this.dbPath);
    }
    async add (key, data) {
        await window.dbTools.appendJSON(this.dbPath, key, data);
    }
    async get () {
        return await window.dbTools.readJSON(this.dbPath);
    }
    async getS (safety) {
        return await window.dbTools.readJSONS(this.dbPath, safety);
    }
    async set (data) {
        await window.dbTools.overwriteJSON(this.dbPath, data);
    }
    async create (name, path) {
        await window.dbTools.create(name, path);
    }
    async getR (name) {
        await window.dbTools.get(name);
    }
    async push (name, key, data) {
        await window.dbTools.push(name, key, data);
    }
}