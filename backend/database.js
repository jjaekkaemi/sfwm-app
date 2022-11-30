const sqlite3 = require("sqlite3").verbose();
const { json } = require("body-parser");
const fs = require("fs");
let db = null
function createDatabase(file) {
    db = new sqlite3.Database(file);
    if (!fs.existsSync(file)) {
        fs.openSync(file, "w");
        let query = [];
        query.push("CREATE TABLE `fire_hydrant_code` ( `id` INTEGER primary key AUTOINCREMENT, 'code' TEXT, `address` TEXT )")
        query.push("CREATE TABLE `data` ( `id` INTEGER primary key AUTOINCREMENT, 'data_type' INTEGER, 'value' TEXT, `datetime` TEXT, `code` INTEGER, FOREIGN KEY ('code') REFERENCES 'fire_hydrant_code' ('id') )")
        query.push("CREATE TABLE `log` ( `id` INTEGER primary key AUTOINCREMENT, 'data' INTEGER, FOREIGN KEY ('data') REFERENCES 'data' ('id') )")
        db.serialize(function () {
            for(q of query){
                db.run(q)
            }
        });
        console.log("database initialized");
    }
}
function insertFireCode(code, address){
    db.run(`INSERT INTO fire_hydrant_code(code, address) VALUES ('${code}', '${address}')`,
    function (createResult) {
        if (createResult) throw createResult;
    })
}
function insertData(jsondata){
    db.run(
        `INSERT INTO data(data_type, value, datetime, code) VALUES (${jsondata.data_type}, '${jsondata.value}', '${jsondata.datetime}', ${jsondata.code_id})`,
        function (createResult) {

            if (createResult) throw createResult;
        }
    );

}
async function selectDataCount(){
    return new Promise(function (resolve, reject) {
        db.all(
        "SELECT count(*) as count FROM data",
        function (err, rows) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        }
        );
  });
}
function insertLog(data_id){
    db.run(
        `INSERT INTO log(data) VALUES (${data_id})`,
        function (createResult) {
            if (createResult) throw createResult;
        }
    );
   
}

async function selectLogCount(){
    return new Promise(function (resolve, reject) {
        db.all(
        "SELECT count(*) as count FROM log",
        function (err, rows) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        }
        );
  });
}
async function selectLog(){
    return new Promise(function (resolve, reject) {
        db.all(
        "SELECT rowid AS id, data FROM log",
        function (err, rows) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        }
        );
  });    

}
async function writeLog(){
    let result_arr = []
    let logjson = await selectLog()
    console.log(logjson)
    for(l of logjson){
        let result = await selectDataFromLog(l.data);
        result_arr.push({
            id:l.id,
            data_type: result[0].data_type,
            value: result[0].value,
            datetime: result[0].datetime
        })
    }
    return result_arr
}
async function selectDataFromLog(id){
    return new Promise(function (resolve, reject) {
        db.all(
        `SELECT rowid AS id, data_type, value, datetime, code FROM data WHERE id=${id}`,
        function (err, rows) {
            if (err) {
                return reject(err);
            }
            resolve(rows);
        }
        );
  });
}
function deleteLog(){
    for(let i = 1 ; i<22 ; i++){
        // db.run(`DELETE FROM log WHERE id = ${i}`, function(createResult){
        //     if (createResult) throw createResult;
        // })
        console.log(i)
    }
}
function checkDB(){
    db.run(
        `INSERT INTO fire_hydrant_code(code, address) VALUES ('232_1', '경상북도 구미시')`,
        function (createResult) {
            if (createResult) throw createResult;
        }
    );
    db.run(
        `INSERT INTO data(value, datetime, code) VALUES ('252', '20220930', 1)`,
        function (createResult) {
            if (createResult) throw createResult;
        }
    );
    db.serialize(function () {
        db.each("SELECT rowid AS id, code, value FROM data", function (err, row) {
            console.log(row.id, row.code, row.value);
        });
    });
    db.serialize(function () {
        db.each("SELECT rowid AS id, code FROM fire_hydrant_code where id=1", function (err, row) {
            console.log(row.id, row.code);
        });
    });
}
module.exports = {createDatabase, checkDB, insertFireCode, insertData, insertLog,selectLog,writeLog, selectLogCount, selectDataCount, deleteLog};