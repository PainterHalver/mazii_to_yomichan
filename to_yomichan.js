const sqlite3 = require("sqlite3").verbose();
const fs = require("fs");
const path = require("path");

const db = new sqlite3.Database(path.join(__dirname, "./javn3.db"));

const ROW_COUNT = 266903;
const ROW_PER_QUERY = 10000;
const ITERATION_COUNT = Math.ceil(ROW_COUNT / ROW_PER_QUERY);

for (let i = 0; i < ITERATION_COUNT; ++i) {
    const offset = i * ROW_PER_QUERY;
    db.all(`select * from javi limit ${offset},${ROW_PER_QUERY}`, (err, rows) => {
        if (err) {
            console.log(err);
        }
        const tempArray = [];
        for (const row of rows) {
            const Expression = row["word"];
            const Hiragana = row["phonetic"] || "";
            const means = JSON.parse(row["mean"]);
            const han = row["han"];
            const sequence_number = row["id"];
            if (!means) {
                continue;
            }
            let Meaning = han + "\n";
            let tagSet = new Set();
            means.forEach((mean, index) => {
                Meaning += `${index + 1}. ${mean["mean"]}\n`;
                if (mean['kind']) {
                    mean["kind"].split(", ").forEach(tag => {
                        tagSet.add(tag);
                    })
                }
            })
            Meaning = [Meaning];
            const tagString = tagSet.size > 0 ? Array.from(tagSet).join(" ") : "";
            tempArray.push([Expression, Hiragana, tagString, "", 1, Meaning, sequence_number, ""]);
        }
        fs.writeFileSync(path.join(__dirname, `./mazii_yomichan/term_bank_${i + 1}.json`), JSON.stringify(tempArray));
    })
}