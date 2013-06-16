// Block-Swapper Puzzle Script - June 2013
// Inherited from Rhuno's Puzzle tutorial - http://goo.gl/9StLQ
// Indirectly licensed under CC0-1.0 - http://goo.gl/Y8aH

// NOTES:
//
// Sometimes when clicking the play CTA the puzzle init() does not run, but startTimer() will
// refreshing will usually solve this problem.
//
// This puzzle can be altered to scale its pieces and sizes based on the image used,
// for now, it is fixed but can be adjusted at a later time.
//
// TO DO:
// Win conditions: Add function to check if piece is in correct position
// - Stop timer if all pieces are correct 

//"use strict";
var document, timerStarted, puzzleLoaded;
var timer = document.getElementById("timer");
var clock = document.getElementById("clock");
var time = 7500; // total seconds, 7500 = 5 minutes

  function startTimer() {
  
		//"use strict";
		
		// prevent the timer from being restarted if it is already started
		if (!timerStarted === true) {timerStarted = true};
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
		
			updateTime: function(){
				this.minutes = Math.floor((((this.totalSeconds % 31536000) % 86400) % 3600) / 60);
				this.seconds = (((this.totalSeconds % 31536000) % 86400) % 3600) % 60;
			},
		
			updateDisplay: function(){
				this.minutesDiv.innerHTML = this.pad(this.minutes);
				this.secondsDiv.innerHTML = this.pad(this.seconds, 2);
			},
		
			countdown: function(){
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






	// function to check if canvas is supported
	function canvasSupport(){
		var elt = document.createElement('canvas');
		return !!(elt.getContext && elt.getContext('2d'));
	};

	// only enable puzzle functionality if canvas support exists
	if (!canvasSupport){
		alert("Your browser does not support Canvas! You must be using Internet Explorer 8 or older - Please maim yourself and update your browser.")
		//return; //alert("update")	
	} else {

		var clock;

		var puzzleLoaded, img,
            can, canW, canH, ctx,
            clickX, clickY,
            selected1, selected2;
			
		// set an array for our pieces
		var piecesArray = [];
	
		// set column and row lengths
		var cols = 8;
		var rows = 5;
		var totalPieces = cols * rows;
	
		// contextually, size must be evenly divisible in to canvas height/width
		var pieceSize = 80;
	
		// piece highlight options
		// NOTE: This functionality is not very dynamic and works off canvas support
		var strokeSize = 3;
		var strokeColor = "#ffffff";
	
		function init() {
				
			if (puzzleLoaded == true) {return};

			can = document.getElementById("puzzle");
			canW = can.width;
			canH = can.height;
			can.className = "playing";
			ctx = can.getContext('2d');

			img = new Image();
			img.src = "images/i.jpg";

			img.onload = createPieces();
			puzzleLoaded = true;
		
			startTimer();
		
		};

		function createPieces() {
			var p;
			for (var c = 0; c < cols; c++) {
				for (var r = 0; r < rows; r++) {
					p = new makePiece(c * pieceSize, r * pieceSize, c*pieceSize + pieceSize, r * pieceSize + pieceSize);
					piecesArray.push(p);
				};	
			};
			scramblePieces(piecesArray, totalPieces);
			drawPieces();
		};

		function selectPiece(e) {
	
			if (puzzleLoaded == false) {return};
			
			clickX = e.offsetX==undefined?e.layerX:e.offsetX;
			clickY = e.offsetY==undefined?e.layerY:e.offsetY;
			
			// Not working on firefox
			//clickX = e.offsetX;
			//clickY = e.offsetY;
	
			var drawX = Math.floor(clickX / pieceSize);
			var drawY = Math.floor(clickY / pieceSize);
			
			var index = drawX * rows + drawY;
			var targetPiece = piecesArray[index];
			var drawHighlight = true;
	
			drawX *= pieceSize;
			drawY *= pieceSize;
	
			ctx.clearRect(0, 0, canW, canH);
	
			if (selected1 != undefined && selected2 != undefined) {
				selected1 = selected2 = undefined;
			};
	
			if (selected1 == undefined) {
				selected1 = targetPiece;
			}
			else {
				selected2 = targetPiece;
				swapPieces(selected1, selected2);
				drawHighlight = false;
			};
	
			drawPieces();

			if (drawHighlight) {
				highlightPiece(drawX, drawY);
			}
		};

		function highlightPiece(drawX, drawY) {
			console.log(drawX, drawY);
			ctx.beginPath();
			ctx.moveTo(drawX, drawY);
			ctx.lineTo(drawX + pieceSize, drawY);
			ctx.lineTo(drawX + pieceSize, drawY + pieceSize);
			ctx.lineTo(drawX, drawY + pieceSize);
			ctx.lineTo(drawX, drawY);
			ctx.lineWidth = strokeSize;
			// set stroke color
			ctx.strokeStyle = strokeColor;
			ctx.stroke();
		};

		function swapPieces(p1, p2) {
			var index1;
			var index2;
			var temp = p1;
	
			index1 = piecesArray.indexOf(p1);
			index2 = piecesArray.indexOf(p2);
	
			piecesArray[index1] = p2;
			piecesArray[index2] = temp;			
		};

		function drawPieces() {
			for (var c = 0; c < cols; c++) {
				for (var r = 0; r < rows; r++) {
					p = piecesArray[c*rows+r];					
					ctx.drawImage(img, p.left, p.top, p.width, p.height, c*pieceSize, r*pieceSize, pieceSize, pieceSize);
				}
			}
		};

		function scramblePieces(array, times) {
			var count = 0;
			var temp;
			var index1;
			var index2;
			while (count < times) {
				index1 = Math.floor(Math.random()*piecesArray.length);
				index2 = Math.floor(Math.random()*piecesArray.length);
		
				temp = piecesArray[index1];
				piecesArray[index1] = piecesArray[index2];
				piecesArray[index2] = temp;
		
				count++;
			}
		};

		function makePiece(left, top, right, bottom) {
			this.left = left;
			this.top  = top;
			this.right = right;
			this.bottom = bottom;
	
			this.width = right - left;
			this.height = bottom - top;
		}
	}