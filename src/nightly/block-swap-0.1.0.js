//"use strict";
disablePuzzle = false;

var can = document.getElementById("puzzlebox");

var time = 7500; // total seconds, 7500 = 5 minutes
var timerDiv = document.getElementById("timer");
var minutesDiv = document.getElementById("mins");
var secondsDiv = document.getElementById("secs");

// function to check if canvas is supported
function canvasSupport(){
	var elt = document.createElement('canvas');
	return !!(elt.getContext && elt.getContext('2d'));
};
// enable puzzle functionality if canvas support exists



if (!canvasSupport || disablePuzzle === true){
	alert("Your browser does not support Canvas or the script is disabled!")
} else {

	// vars
	var window, timerStarted,
			puzzleLoaded, img,
			canW, canH, ctx,
			clickX, clickY,
			selected1, selected2;
	var cols = 8;
	var rows = 5;
	var totalPieces = cols * rows;
	var pieceSize = 80;
	var strokeSize = 2;
	var strokeColor = "#ffffff";
	


	
	Puzzle = {
	
		Pieces : [],
	
		ActivatePiece: function(drawX, drawY) {
			//console.log(drawX, drawY);
			ctx.beginPath();
			ctx.moveTo(drawX, drawY);
			ctx.lineTo(drawX + pieceSize, drawY);
			ctx.lineTo(drawX + pieceSize, drawY + pieceSize);
			ctx.lineTo(drawX, drawY + pieceSize);
			ctx.lineTo(drawX, drawY);
			ctx.lineWidth = strokeSize;
			
			//x = document.createElement('div');
			//can.innerHTML(x)
			
			// set stroke color
			ctx.strokeStyle = strokeColor;
			ctx.stroke();
		},
	
		ScramblePieces: function(array, times) {
			var count = 0;
			var temp;
			var index1;
			var index2;
			while (count < times) {
				index1 = Math.floor(Math.random()*Puzzle.Pieces.length);
				index2 = Math.floor(Math.random()*Puzzle.Pieces.length);
		
				temp = Puzzle.Pieces[index1];
				Puzzle.Pieces[index1] = Puzzle.Pieces[index2];
				Puzzle.Pieces[index2] = temp;
		
				count++;
			}
		},
	
		MakePiece: function(left, top, right, bottom) {
		
			this.left = left;
			this.top  = top;
			this.right = right;
			this.bottom = bottom;
	
			this.width = right - left;
			this.height = bottom - top;
		},
	
		CreatePieces: function(){
			
			var p;
			for (var c = 0; c < cols; c++) {
				for (var r = 0; r < rows; r++) {
					p = new Puzzle.MakePiece(c * pieceSize, r * pieceSize, c*pieceSize + pieceSize, r * pieceSize + pieceSize);
					Puzzle.Pieces.push(p);
					
				};	
			};
			Puzzle.ScramblePieces(Puzzle.Pieces, totalPieces);
			Puzzle.DrawPieces();			
		},
	
		SwapPieces: function(p1, p2) {
			var index1;
			var index2;
			var temp = p1;
	
			index1 = Puzzle.Pieces.indexOf(p1);
			index2 = Puzzle.Pieces.indexOf(p2);
	
			Puzzle.Pieces[index1] = p2;
			Puzzle.Pieces[index2] = temp;			
		},
		
		DrawPieces: function(){
			for (var c = 0; c < cols; c++) {
				for (var r = 0; r < rows; r++) {
					p = Puzzle.Pieces[c*rows+r];
					// use to find piece scramble locations
					//alert("piece 1")
					ctx.drawImage(img, p.left, p.top, p.width, p.height, c*pieceSize, r*pieceSize, pieceSize, pieceSize);
				}
			}
			puzzleReady = true;
		},
	
		PickPiece: function(e) {
			// enable piece selection in Firefox
			clickX = e.offsetX == undefined ? e.layerX: e.offsetX;
			clickY = e.offsetY == undefined ? e.layerY: e.offsetY;
	
			var drawX = Math.floor(clickX / pieceSize);
			var drawY = Math.floor(clickY / pieceSize);
			
			var index = drawX * rows + drawY;
			var targetPiece = Puzzle.Pieces[index];
			var thisPiece = true;
	
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
				Puzzle.SwapPieces(selected1, selected2);
				thisPiece = false;
			};
			
			// we needed to keep track of the current pieces
			// so we can clear the canvas to swap our pieces
			// then replace the other pieces not used
			Puzzle.DrawPieces();
	
			if (thisPiece) {
				Puzzle.ActivatePiece(drawX, drawY);
			}
		},
		
		StartTimer: function() {
			if (!timerStarted === true) {timerStarted = true};
			timerStarted = true;
	
			var Timer = {
				totalSeconds: time,
				minsDiv: minutesDiv,
				secsDiv: secondsDiv,
			
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
					this.minsDiv.innerHTML = this.pad(this.minutes);
					this.secsDiv.innerHTML = this.pad(this.seconds, 2);
				},
			
				countdown: function(){
					Timer.updateTime();
					Timer.updateDisplay();
					// Less than one minute left
					if (Timer.totalSeconds < 60) {
						timerDiv.className = "hurry";
					};
					// Out of time
					if (Timer.totalSeconds == 0) {
						// Unload puzzle and timer
						puzzleReady = false;
						timerStarted = false;
						// Clear puzzle
						ctx = can.getContext('2d');
						canW = can.width;
						canH = can.height;
						can.className = "not-playing";
						ctx.clearRect(0, 0, canW, canH);
						// remove red alert from time
						timerDiv.className = "";
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
		},
		
		Init: function() {
	
			can = document.getElementById("puzzle");
			ctx = can.getContext('2d');
			canW = can.width;
			canH = can.height;
			can.className = "playing";
			
			img = new Image();
			img.src = "images/image.jpg";
	
			img.onload = function(){
				img.width = canW;
				img.height = canH;
				Puzzle.CreatePieces();
				//puzzleLoaded = true;
				if (puzzleReady) {
					Puzzle.StartTimer();
				};
			}
		}	
	}// close Puzzle object
}//close else statement

window.addEventListener('load', Puzzle.Init);

//var toybox = function exists(){!canvasSupport || Puzzle.Init };
//if(toybox){alert("game started")};