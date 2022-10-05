var express = require('express');
var router = express.Router();
const {connectIO} = require("../socket.js")
const {returnData, connectWS, sendWS, getWS} = require("../websocket.js")
const {selectLog, insertData, insertLog, writeLog} = require("../database.js")
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/socket', function(req,res, next){
  res.json({port:3000})
})
router.get('/websocket', function(req,res, next){
  let result = false
  result = connectWS()
  res.json({ws:result!=null?true:false})
})
router.post('/data', function(req, res, next){
  if(req.body){
    if(getWS()!=null){
      sendWS(cmd);
      setTimeout(()=> {
        res.json(returnData())
      },500)
    }
    res.send(200, "WebSocket Disconnect")
  }
  else res.send(200, "No Parameter")
})

router.get("/log", async function(req, res, next){
  
  res.json(await writeLog());
  // console.log()
  // insertLog(await insertData(1, "324", new Date(), 1))
  // res.json({ok:"Ok"})
})
module.exports = router;
