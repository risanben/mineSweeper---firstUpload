'use strict'


const time_el = document.querySelector('.watch .time');
var gSeconds = 0;
var gStopper;

function timer() {
	gSeconds++;

	// Format our time
	var hrs = Math.floor(gSeconds / 3600);
	var mins = Math.floor((gSeconds - (hrs * 3600)) / 60);
	var secs = gSeconds % 60;

	if (secs < 10) secs = '0' + secs;
	if (mins < 10) mins = "0" + mins;
	if (hrs < 10) hrs = "0" + hrs;

	time_el.innerText = `${hrs}:${mins}:${secs}`;
}

function startTimer() {
	if (gStopper) return;
	gSeconds = 0;
	time_el.innerText = '00:00:00'
	gStopper = null;
	gStopper = setInterval(timer, 1000)
}