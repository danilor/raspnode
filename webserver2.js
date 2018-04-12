const http 				= 			require('http').createServer(handler); //require http server, and create server with function handler()
const fs 				= 			require('fs'); //require filesystem module
const io 				= 			require('socket.io')(http) //require socket.io module and pass the http object (server)
const Gpio 				= 			require('onoff').Gpio; //include onoff to interact with the GPIO
const LED 				= 			new Gpio(4, 'out'); //use GPIO pin 4 as output
const pushButton 		= 			new Gpio(17, 'in', 'both'); //use GPIO pin 17 as input, and 'both' button presses, and releases should be handled

const config 			=  			require('./config.json'); // The configuration values
const c 				= 			require('./modules/console.js');


http.listen( config.server.port ); //listen to port 8080

/**
	GLOBAL VARIABLES
*/

global.ledValue = 0;

/*************************/

c.spaces(2);
c.logM('==================================');
c.logM('             WebServer            ');
c.logM('==================================');
c.spaces(2);

LED.writeSync( global.ledValue ); // Turn LED off

function handler (req, res) { //create server
	c.logM('Request Handler');
	fs.readFile(__dirname + '/public/index.html', function(err, data) { //read file index.html in public folder
		if (err) {
		  res.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
		  c.err('404 error. Not Found');
		  return res.end("404 Not Found");
		} 
		res.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
		res.write(data); //write data from index.html
		
		return res.end();
	});
}

io.sockets.on('connection', function (socket) {// WebSocket Connection
//   var lightvalue = 0; //static variable for current status
  socket.emit( 'light', global.ledValue );
  /*pushButton.watch(function (err, value) { //Watch for hardware interrupts on pushButton
    if (err) { //if an error
      console.error('There was an error', err); //output error message to console
      return;
	}
	//if(value === 0 ){ // There is some kind of hack because we dont want it to read the release of the button, just the press
		//c.logM('Release');
		//return;
	//}
	c.logM('Button Watch');
	if(global.ledValue === 0){ // We cannot use true and false values because it needs numbers
		global.ledValue = 1;
	}else{
		global.ledValue = 0;
	}
	c.logM('New Value: ' + global.ledValue);
	
    socket.emit( 'light', global.ledValue ); //send button status to client
  }); */
  // We are deleting the button watch, we want to control the light only with the web page
  
  socket.on('light', function(data) { //get light switch status from client
	c.logM('Light Status Changed');
	c.logM( data );
	global.ledValue = data;
	LED.writeSync( global.ledValue ); //turn LED on or off
    
  });
  
});

process.on('SIGINT', function () { //on ctrl+c 
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport LED GPIO to free resources
  pushButton.unexport(); // Unexport Button GPIO to free resources
  process.exit(); //exit completely
});
