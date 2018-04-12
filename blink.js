/**
	As seen in: https://www.w3schools.com/nodejs/nodejs_raspberrypi_blinking_led.asp
*/

const Gpio = require('onoff').Gpio; //include onoff to interact with the GPIO
const LED = new Gpio(4, 'out'); //use GPIO pin 4, and specify that it is output

const c = require('./modules/console.js');

c.spaces(5);
c.logM('=====================');
c.logM('    Blinking Test    ');
c.logM('=====================');
c.space();

const intervalms = 250; // The interval
const applen = 3000; // How many MS the app is going to be executed

c.logM('Interval: ' + intervalms + 'ms');
c.logM('App Duration: ' + applen + 'ms');

const blinkInterval = setInterval(blinkLED, intervalms); //run the blinkLED function every 250ms

function blinkLED() { //function to start blinking
  if (LED.readSync() === 0) { //check the pin state, if the state is 0 (or off)
    LED.writeSync(1); //set pin state to 1 (turn LED on)
	c.logM('Turns On');
  } else {
    LED.writeSync(0); //set pin state to 0 (turn LED off)
	c.logM('Turns Off');
  }
}

function endBlink() { //function to stop blinking
  c.logM('Stopping');
  clearInterval(blinkInterval); // Stop blink intervals
  LED.writeSync(0); // Turn LED off
  LED.unexport(); // Unexport GPIO to free resources
  c.spaces(3);
}

setTimeout(endBlink, applen); //stop blinking after 5 seconds
