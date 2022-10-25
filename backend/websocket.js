const {WebSocket} = require('ws');
let sensor_data = ""
let ws = null;
let dataInterval = null
const {sendData} = require("./socket.js")
const {insertData, insertLog, selectLogCount, selectDataCount} = require('./database.js')
const DATA_TYPE = {
    tmp:{
        id:0,
        alert:0
    },
    pres:{
        id:1,
        alert:0
    },
    heat:{
        id:2
    }
}
function returnData(){
    return sensor_data
}
async function connectWS(){
    // let result2 = {tmp:100, pres:300, heat:'0' }
    // sendData("data",result2)
    // await checkSensorData(result2)
    if(ws!=null){
        disconnectWS()
    }
    else{
        try{
            ws = new WebSocket('ws://192.168.0.34:8080');
            ws.on('open', function open() {
                console.log("open")
                // ws.send("get")
                sendData("ws_connect", true)
                dataInterval = setInterval(()=>{
                    sendWS("get")
                }, 30000)
            });
            ws.on('message', async function message(data) {
                let result = JSON.parse(data.toString(`utf-8`))
                sensor_data = result
                sendData("data",result)
                await checkSensorData(result)
                
            });
            ws.on('close', function close() {
                console.log("close")
                disconnectWS()
            });
            ws.on('error', function error(){
                console.log("error")
            })
        }
        catch(ex){
            console.log("[WS]", ex)
            disconnectWS()
        } 
    }
    return ws

}
async function checkSensorData(jsondata){
    for (j in jsondata){
        let logdata = {data_type: DATA_TYPE[j].id, value:jsondata[j], datetime: new Date, code_id: 1,}
        insertData(logdata);
        let id = await selectDataCount()
        if(DATA_TYPE[j].id<2) await logCheck(j, jsondata, id[0].count, logdata)
    }
}
function disconnectWS(){
    if(ws!=null) ws.close()
    ws = null;
    clearInterval(dataInterval)
    dataInterval = null
    sendData("ws_connect", false)
}
async function logCheck(j, jsondata, id, logdata){
    if(Number(jsondata[j])>DATA_TYPE[j].alert){
        let result = await selectLogCount()
        let alertdata = logdata
        alertdata.id = result[0].count+1
        sendData("alert", alertdata)
        insertLog(id)
    }
}

function sendWS(data){
    ws.send(data)
}
function getWS(){
    return ws
}
module.exports = {ws, returnData, connectWS, sendWS, getWS}