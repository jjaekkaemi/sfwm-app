const {WebSocket} = require('ws');
let sensor_data = ""
let ws = null;
let dataInterval = null
const {sendData} = require("./socket.js")
const {insertData, insertLog} = require('./database.js')
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
function connectWS(){
    alert({tmp:1, pres:2})
    if(ws!=null){
        disconnectWS()
    }
    else{
        try{
            ws = new WebSocket('ws://192.168.0.34:8080');
            ws.on('open', function open() {
                console.log("open")
                // ws.send("get")
                dataInterval = setInterval(()=>{
                    sendWS("get")
                }, 30000)
            });
            ws.on('message', function message(data) {
                let result = JSON.parse(data.toString(`utf-8`))
                sensor_data = result
                sendData("data",result)
                checkSensorData(result)
                
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
function checkSensorData(jsondata){
    for (j in jsondata){
        let id = insertData(DATA_TYPE[j].id, jsondata[j], new Date, 1)
        if(DATA_TYPE[j].id<2) logCheck(j, jsondata, id)
    }
}
function disconnectWS(){
    if(ws!=null) ws.close()
    ws = null;
    clearInterval(dataInterval)
    dataInterval = null
    sendData("ws_disconnect", false)
}
function logCheck(j, jsondata, id){
    if(Number(jsondata[j])>DATA_TYPE[j].alert){
        let alertdata = {}
        alertdata[ALERT_DATA[j].id]= jsondata[j]
        sendData("alert", alertdata)
        insertLog(id)
    }
}
function alert(j, jsondata){

    for (j in jsondata){
        if(Number(jsondata[j])>ALERT_DATA[j].alert){
            let alertdata = {}
            alertdata[ALERT_DATA[j].id]= jsondata[j]
            sendData("alert", alertdata)
            insertLog()
        }
    }
}
function sendWS(data){
    ws.send(data)
}
function getWS(){
    return ws
}
module.exports = {ws, returnData, connectWS, sendWS, getWS}