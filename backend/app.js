var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const { createDatabase, checkDB, insertFireCode,insertLog, insertData } = require("./database.js");
const {connectIO} =require("./socket.js")
var indexRouter = require('./routes/index');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../dist')));
createDatabase("database.db")
// insertFireCode("123_1", "경상북도 구미")

// insertLog(insertData(1, "324", new Date(), 1))
// console.log(insertData(1, "324", new Date(), 1))
app.use('/', indexRouter);
connectIO(app)

// let websocket = new WebSocket("192.168.0.34:8080")
// websocket.onopen(() => {
//     console.log("open")
//     websocket.send("get")
// })
// websocket.onmessage((msg)=> {
//     console.log("message")
//     sendData(msg)
//     //db 저장
//     //log 데이터 체크 -> db 저장
//     //socket.io로 client랑 연결돼있으면 데이터 던져주기
// })
// websocket.onclose(()=>{
//     console.log("close")
// })

module.exports = app;
