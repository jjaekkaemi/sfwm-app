var express = require('express');
var router = express.Router();
const {connectIO} = require("../socket.js")
const {returnData, sendWS, getWS} = require("../websocket_server.js")
const {selectLog, insertData, insertLog, writeLog} = require("../database.js")
const {sendData} = require("../socket.js")
let address = null
for(i = 2 ; i<process.argv.length ; i+=2){
    address = Number(process.argv[i]);
}
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/socket', function(req,res, next){
  res.json({port:8081})
})

router.post('/data', function(req, res, next){
  if(req.body){
    if(getWS()!=null){
      res.json(200, returnData())
    }
    else{
      res.send(200, "WebSocket Disconnect")
    }
    
  }
  else res.send(200, "No Parameter")
})

router.get("/log", async function(req, res, next){
  res.json(await writeLog());
})
router.get("/alert", function(req,res, next){
  sendData("alert", true)
  res.send(200, "ok")
})
router.get("/screct", function(req,res, next){
  sendWS("screct")
  res.send(200, "ok")
})
router.get("/screct_check", function(req,res, next){
  sendWS("screct_check")
  res.send(200, "ok")
})
module.exports = router;
