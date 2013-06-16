var timer = document.getElementById("timer");
var clock = document.getElementById("clock");
var timerStarted, puzzleLoaded;

var time = 7500; // total seconds, 7500 = 5 minutes

  function startTimer() {
  
		"use strict";
		
		// prevent the timer from being restarted if it is already started
		if (timerStarted == true) {return};
		timerStarted = true;

		var Timer = {
			totalSeconds: time,
			minutesDiv: document.getElementById("mins"),
			secondsDiv: document.getElementById("secs"),
		
			pad: function(num, size) {
				var s = num + "";
				while (s.length < size) s = "0" + s;
				return s;
			},
		
			updateTime: function() {
				this.minutes = Math.floor((((this.totalSeconds % 31536000) % 86400) % 3600) / 60);
				this.seconds = (((this.totalSeconds % 31536000) % 86400) % 3600) % 60;
			},
		
			updateDisplay: function() {
				this.minutesDiv.innerHTML = this.pad(this.minutes);
				this.secondsDiv.innerHTML = this.pad(this.seconds, 2);
			},
		
			countdown: function() {
				Timer.updateTime();
				Timer.updateDisplay();
				// Less than one minute left
				if (Timer.totalSeconds <= 59) {
					timer.className = "hurry";
					clock.src = "i/o/c-a.png"
				};
				// Out of time
				if (Timer.totalSeconds == 0) {
					// Unload puzzle and timer
					puzzleLoaded = false;
					timerStarted = false;
					// Clear puzzle
					can = document.getElementById("puzzle");
					canW = can.width;
					canH = can.height;
					can.className = "not-playing";
					ctx = can.getContext('2d');
					ctx.clearRect(0, 0, canW, canH);
					// remove red alert from time
					timer.className = "";
					clock.src = "i/o/c.png";
					// Set time back to original
					Timer.totalSeconds = time;
					Timer.updateTime();
					Timer.updateDisplay();
				} else {
					Timer.totalSeconds -= 1;
					window.setTimeout(Timer.countdown, 1000);
				}
			}
		};
		Timer.countdown();
		
	};