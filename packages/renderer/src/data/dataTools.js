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
    set (data) {
        window.dbTools.overwriteJSON(this.dbPath, data);
    }
}