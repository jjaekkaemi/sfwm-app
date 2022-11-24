const {WebSocketServer} = require('ws')
const wss = new WebSocketServer({port: 8083})
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
let sensor_data = ""
let client_ws = null;

function returnData(){
    return sensor_data
}
wss.on("connection", ws => {
    console.log("[WSS] connect!")
    client_ws = ws
    client_ws.on("message", async function message(data) {
        let result = JSON.parse(data.toString(`utf-8`))
        console.log("[WSS] message : ", result)
        switch(result.type){
            case 0 :
                sensor_data = result.data
                sendData("data",sensor_data)
                await checkSensorData(sensor_data)
                break
            case 1:
                        
                console.log("경보", result.data)
                if(result.data!=null){
                    let insertdata = {data_type:3, value:result.data, datetime: getDatetime(), code_id: 1}
                    insertData(insertdata);
                                
                    let id = await selectDataCount()
                    await logCheck(id[0].count, insertdata)
                }
                sendData("detect",result.data)
                        

                break
            }
    })
    client_ws.on("close", ws=>{
        client_ws = null
        console.log("[WSS] close")
    })
})
async function checkSensorData(jsondata){
    
    for (j in jsondata){
        let logdata = {data_type: DATA_TYPE[j].id, value:jsondata[j], datetime: getDatetime(), code_id: 1,}
        insertData(logdata);
        // let id = await selectDataCount()
        // if(DATA_TYPE[j].id<2) await logCheck(j, jsondata, id[0].count, logdata)
    }
}

async function logCheck(id, logdata){
    let result = await selectLogCount()
    let alertdata = logdata
    alertdata.id = result[0].count+1
    sendData("alert", alertdata)
    insertLog(id)
}
function sendWS(data){
    if(getWS()!=null){
        client_ws.send(data)
    }
}
function getWS(){
    return client_ws
}
function getDatetime(){
    const date = new Date()
    return`${date.getFullYear()}-${date.getMonth()}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds()}`
}
module.exports = {client_ws, returnData, sendWS, getWS}