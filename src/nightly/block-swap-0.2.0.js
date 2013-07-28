// function to check if canvas is supported
function canvasSupport(){
	var elt = document.createElement('canvas');
	return !!(elt.getContext && elt.getContext('2d'));
};

// enable puzzle functionality if canvas support exists
if (!canvasSupport){
	alert("Your browser does not support Canvas or the script is disabled!")
} else {

	// vars
	var picSrc = "images/i.jpg";
	var time = 300; // seconds 300 = 5 minutes
	
	var can = document.getElementById("puzzle");
	var ctx = can.getContext('2d');
	
	var ctaDiv = document.getElementById("cta");
	var timerDiv = document.getElementById("timer");
	var minutesDiv = document.getElementById("mins");
	var secondsDiv = document.getElementById("secs");	

	var pic, selected1, selected2;
	var cols = 8;
	var rows = 5;
	var blockSize = 80;

	
	Puzzle = {
	
		blocks : [],

// This function can be used to draw a center stroke around the block
// 		blockOutline: function(drawX, drawY){
// 			ctx.beginPath();
// 			ctx.moveTo(drawX, drawY);
// 			ctx.lineTo(drawX + blockSize, drawY);
// 			ctx.lineTo(drawX + blockSize, drawY + blockSize);
// 			ctx.lineTo(drawX, drawY + blockSize);
// 			ctx.lineTo(drawX, drawY);
// 			ctx.lineWidth = 2;
// 			ctx.strokeStyle = "#292929";
// 			ctx.stroke();
// 		},
	
		scrambleBlocks: function(arr){
			var count = 0;
			var temp;
			var index1;
			var index2;
			while (count < ((cols * rows) * (rows + cols))){
				index1 = Math.floor(Math.random()*arr.length);
				index2 = Math.floor(Math.random()*arr.length);
				temp = arr[index1];
				arr[index1] = arr[index2];
				arr[index2] = temp;
				count++;
			}
		},
	
		makeBlock: function(id, left, top, right, bottom){
			this.id = id;
			this.left = left;
			this.top  = top;
			this.right = right;
			this.bottom = bottom;
			this.posX = left / blockSize;
			this.posY = top / blockSize;
			this.width = right - left;
			this.height = bottom - top;
		},
	
		storeBlocks: function(arr){
			var p = {};
			for (var c = 0; c < cols; c++){
				for (var r = 0; r < rows; r++){
					p = new Puzzle.makeBlock(arr.length, c * blockSize, r * blockSize, c*blockSize + blockSize, r * blockSize + blockSize);
					arr.push(p);
				};
			};
		},

		blockSwap: function(array, p1, p2){
			var index1;
			var index2;
			var temp = p1;
			index1 = array.indexOf(p1);
			index2 = array.indexOf(p2);
			array[index1] = p2;
			array[index2] = temp;	
		},
		
		drawBlocks: function(image){
			for (var c = 0; c < cols; c++){
				for (var r = 0; r < rows; r++){
					p = Puzzle.blocks[c*rows+r];
					ctx.drawImage(image, p.left, p.top, p.width, p.height, c*blockSize, r*blockSize, blockSize, blockSize);
				}
			}
		},

		selectBlock: function(e){
			// disable clicking if the puzzle isnt started
			if (puzzleReady == false){
				return;
			} else {
				thisBlock = true;
			}

			clickX = e.offsetX == undefined ? e.layerX: e.offsetX;
			clickY = e.offsetY == undefined ? e.layerY: e.offsetY;
	
			var drawX = Math.floor(clickX / blockSize);
			var drawY = Math.floor(clickY / blockSize);
			
			var index = drawX * rows + drawY;
			var targetBlock = Puzzle.blocks[index];

			drawX *= blockSize;
			drawY *= blockSize;
			
			thisX = drawX / blockSize;
			thisY = drawY / blockSize;
			
			startX = targetBlock.posX;
			startY = targetBlock.posY;
			
			// what to do when the block is in its correct position
			if (thisX == startX && thisY == startY){
				//alert("This block is in its correct position. ID: " + targetBlock.id);
				return; 
			}
			// block styling
			document.getElementById("active").style.display = "block";
			document.getElementById("active").style.left = drawX + "px";
			document.getElementById("active").style.top = drawY + "px";	

			ctx.clearRect(0, 0, cols * blockSize, rows * blockSize);
	
			if (selected1 != undefined && selected2 != undefined){
				selected1 = selected2 = undefined;
			};
	
			if (selected1 == undefined){
				selected1 = targetBlock;
			}
			else {
				selected2 = targetBlock;
				Puzzle.blockSwap(Puzzle.blocks, selected1, selected2);
				thisBlock = undefined;
				// if the block selected was swapped, disengage outline
				if (thisBlock == undefined){
							document.getElementById("active").style.display = "none";
				}
			};
			//
			// DRAGONS: this technique is highly volatile
			//
			Puzzle.drawBlocks(pic);
	
			// lets outline our block if it was selected first
			//if (thisBlock === true){
				//Puzzle.blockOutline(drawX, drawY);	
			//}
		},
		
		startTimer: function(){

			var Timer = {
				totalSeconds: time,
				minsDiv: minutesDiv,
				secsDiv: secondsDiv,
			
				pad: function(num, size){
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
					if (Timer.totalSeconds < 60){
						timerDiv.style.color = "red";
					};
					// Out of time
					if (Timer.totalSeconds == 0){
						// Unload puzzle and timer
						puzzleReady = false;
						timerStarted = false;
						//ctx.clearRect(0, 0, canW, canH);
						// remove red alert from time
						timerDiv.style.color = "inherit";
						// Set time back to original
						Timer.totalSeconds = time;
						Timer.updateTime();
						Timer.updateDisplay();
					} else {
						Timer.totalSeconds -= 1;
						t = window.setTimeout(Timer.countdown, 1000);
						t;
					}
				}
			};
			Timer.countdown();
		},
		
		init: function(){
		
			// if our blocks are already made, clear our array for initiation
			// and restart our timer
			if (isNaN(Puzzle.blocks)){
				Puzzle.blocks.length = 0;
				window.clearTimeout(t);
			};
			can.style.cursor = "pointer";
			pic = new Image();
			pic.src = picSrc;
			pic.onload = function(){
			
				Puzzle.storeBlocks(Puzzle.blocks);
				Puzzle.scrambleBlocks(Puzzle.blocks);
				Puzzle.drawBlocks(pic);
				Puzzle.startTimer(Puzzle);
				puzzleReady = true;
			}
		}
		
	}// close Puzzle object
	
	ctaDiv.addEventListener('click', function(){
		Puzzle.init();
		this.className = "a";
		this.getElementsByTagName('div')[0].style.width = "100px";
		this.getElementsByTagName('p')[0].innerHTML = "Restart?";
		}
	);
	
}//close else canvasSupport statement