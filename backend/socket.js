let socket_ = null
function connectIO(app){
    app.io = require("socket.io")()
    app.io.on('connection', function (socket) {
        console.log(socket.id, 'Connected');
        socket_ = socket
        app.io.emit('msg', `${socket.id} 연결 되었습니다.`);
        
        socket.on('msg', function (data) {
          console.log(socket.id, data);
          
          app.io.emit('msg', `Server : "${data}" 받았습니다.`);
        });
        socket.on('hello', function (data) {
            console.log(socket.id, data);
          });

        socket.on('disconnect', function() {
            socket_ = null
            console.log("disconnect")
        })
      });
}

function sendData(msg,data){
    if(socket_!=null) socket_.emit(msg, data)
}
module.exports = { connectIO, sendData };