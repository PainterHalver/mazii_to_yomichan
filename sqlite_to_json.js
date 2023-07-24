const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const db = new sqlite3.Database(path.join(__dirname, "./javn2.db"));

// export kanji table to json file
db.serialize(function () {
    db.all("SELECT kanji,mean FROM kanji where mean not null", function (err, rows) {
        if (err) {
            console.log(err);
        }
        fs.writeFileSync("./data/kanji_filtered.json", JSON.stringify(rows));
    });
});