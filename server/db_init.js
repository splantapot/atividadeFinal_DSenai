// MODULES
const sha1 = require('sha1');

const sqlite3 = require('sqlite3').verbose();

const DB_PATH = './database.db';
// SETUP
function openDB(path = DB_PATH) {
    return new sqlite3.Database(path, (error) => {
        if (error) {
            console.error('Open error: ', error.message);
        } else {
            console.log(`DB Opened in "${path}"`);
        }
    })
}

const DB_DEFAULT = openDB();

module.exports = {
    openDB,
    DB_DEFAULT
}
