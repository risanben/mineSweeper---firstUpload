'use strict'


const time_el = document.querySelector('.watch .time');

let seconds = 0;
let interval = null;

function timer () {
	seconds++;

	// Format our time
	let hrs = Math.floor(seconds / 3600);
	let mins = Math.floor((seconds - (hrs * 3600)) / 60);
	let secs = seconds % 60;

	if (secs < 10) secs = '0' + secs;
	if (mins < 10) mins = "0" + mins;
	if (hrs < 10) hrs = "0" + hrs;

	time_el.innerText = `${hrs}:${mins}:${secs}`;
}

function startTimer(){
	if(gStopper) return;
	gStopper = setInterval(timer,1000)
}