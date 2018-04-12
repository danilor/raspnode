var http = require('http').createServer(handler);  //require http server, and create server with function handler()
const fs = require('fs'); //require filesystem module
const config =  require('./config.json');
const c = require('./modules/console.js');

const io = require('socket.io')(http) //require socket.io module and pass the http object (server)

http.listen( config.server.port ); //the server object listens on port 8080

c.spaces(2);
c.logM('==================================');
c.logM('             WebServer            ');
c.logM('==================================');
c.spaces(2);

// http.listen( config.server.port ); //listen to port 8080


function handler (req, res) { //create server
  c.logM('Request Handler');
  fs.readFile(__dirname + '/public/index.html', function(err, data) { //read file index.html in public folder
    if (err) {
      res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
      return res.end("404 Not Found");
    } 
    res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
    res.write(data); //write data from index.html
    return res.end();
  });
}

io.sockets.on('connection', function (socket) {// WebSocket Connection
  c.logM('IO Sockets > Connection Handler');
  var lightvalue = 0; //static variable for current status
  socket.on('light', function(data) { //get light switch status from client
	c.logM('Light Status from client ' + data );
    lightvalue = data;
    if (lightvalue) {
      console.log(lightvalue); //turn LED on or off, for now we will just show it in console.log
    }
  });
});
