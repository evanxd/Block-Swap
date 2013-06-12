var timer = document.getElementById("timer");
var clock = document.getElementById("clock");
var min = document.getElementById("mins");
var sec = document.getElementById("secs");
var timerStarted;

  function startTimer() {
  
		"use strict";
		
		// prevent the timer from being restarting itself
		if (timerStarted == true) {
			return;
		};
		timerStarted = true;

		var Timer = {
			totalSeconds: 7500,
			minutesDiv: min,
			secondsDiv: sec,
		
			pad: function(num, size) {
				var s = num + "";
				while (s.length < size) s = "0" + s;
				return s;
			},
		
			updateTime: function() {
				this.minutes = Math.floor((((this.totalSeconds % 31536000) % 86400) % 3600) / 60);
				this.seconds = (((this.totalSeconds % 31536000) % 86400) % 3600) % 60;
			},
		
			updateDisplay:function() {
				this.minutesDiv.innerHTML = this.pad(this.minutes);
				this.secondsDiv.innerHTML = this.pad(this.seconds, 2);
			},
		
			countdown: function() {
				Timer.updateTime();
				Timer.updateDisplay();
				if (Timer.totalSeconds <= 59) {
					timer.className = "hurry";
					clock.src = "i/o/c-a.png"
				}
				if (Timer.totalSeconds === 0) {
					window.alert("Time's up!");
				} else {
					Timer.totalSeconds -= 1;
					window.setTimeout(Timer.countdown, 1000);
				}
			}
		};
		Timer.countdown();
	};