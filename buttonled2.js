const Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
global.LED = new Gpio(4, 'out'); //use GPIO pin 4 as output
const pushButton = new Gpio(17, 'in', 'both'); //use GPIO pin 17 as input, and 'both' button presses, and releases should be handled

const c = require('./modules/console.js');

global.ledValue = 0;

c.logM('Button LED');

global.LED.writeSync( global.ledValue ); // We start the led in OFF

pushButton.watch( buttonPressed ); // We send the button press to the function buttonPressed

function buttonPressed(err, value) { //Watch for hardware interrupts on pushButton GPIO, speci$
  if (err) { //if an error
    c.err('There was an error'); //output error message to console
  return;
  }

	if( value === 0 ){
		return;
	}

//   LED.writeSync(value); //turn LED on or off depending on the button state (0 or 1)
	c.logM('Button Pressed');
        if( global.ledValue === 0 ){
		global.ledValue = 1;
	}else{
		global.ledValue = 0;
	}
	// console.log( global.ledValue );
        global.LED.writeSync( global.ledValue );
}

function unexportOnClose() { //function to run when exiting program
  global.LED.writeSync(0); // Turn LED off
  global.LED.unexport(); // Unexport LED GPIO to free resources
  pushButton.unexport(); // Unexport Button GPIO to free resources
};

process.on('SIGINT', unexportOnClose); //function to run when user closes using ctrl+c
