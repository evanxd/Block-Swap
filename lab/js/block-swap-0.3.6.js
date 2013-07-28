// Below is a function that finds all possible divisors of two numbers in order to
// calculate the number of equally proportioned squares that can be made, without clipping,
// using the area of a quadrilateral shape, specifically a canvas element
// Similar to finding the how much a square "foot" is of an area
var allDivisors = function(num1, num2, min) {
  var i, n1, n2, ns, n = [], divisors = [],
		    x = Math.floor(num1 / min),
		    y = Math.floor(num2 / min);
		if (min === undefined) { x = 1; y = x; };
		while (x <= num1 && y <= num2) {
				n1 = Math.floor(num1 / x);
				n2 = Math.floor(num2 / y);
				if (n1 <= num1 && n2 <= num2) {
						n.push(n1);
						n.push(n2);
						x--;
						y--;
				} else { break; }
		ns = n.sort();
		}
  for (i = 0; i < n.length-1; i++) {
    if (ns[i + 1] === ns[i]) {
      divisors.push(ns[i]);
    }
  }
  //console.log(divisors[0])
  return divisors;
};



// User configured variables
var canvasElement =	       document.getElementById("puzzle"),
    canvasMask =           document.getElementById("mask"),
    artPath =              "images/can-img-big.jpg", // image path
    enableGrid =           true, // true or false
    enableHover =          true, // true or false
    gridColor =            "rgba(60, 40, 20, 1)", // hex or rgba
    selectedColor =        "rgba(0, 0, 0, 0.65)", // hex or rgba
    hoverColor =           "rgba(0, 0, 0, 0.25)"; // hex or rgba

// Our Puzzle object, where all the goods are stored
var	Puzzle = {
	 
	 // Let us prepare a few things like setting up some definitions and sizing some elements
		setup : function() {
				this.canvas = canvasElement;
				// Store the parent of the canvas so we can
				// size it dynamically based on the size of our canvas
				this.canvasParent = canvasElement.parentNode;
				this.mask = canvasMask;
		  this.blocks = [];
				this.blocksize = (parseInt(allDivisors(this.canvas.width, this.canvas.height, 44)));
				this.cols = (this.canvas.width / this.blocksize);
				this.rows = (this.canvas.height / this.blocksize);
		},

		// Here we outline the block by connecting the points of each side
		outlineBlock : function(p1, p2) {
				var ctx = this.canvas.getContext("2d"), blocksize = this.blocksize;
				canvasMask.style.width = blocksize;
				canvasMask.style.height = blocksize;
				ctx.beginPath();
				ctx.moveTo(p1, p2);
				ctx.lineTo(p1 + blocksize, p2);
				ctx.lineTo(p1 + blocksize, p2 + blocksize);
				ctx.lineTo(p1, p2 + blocksize);
				ctx.lineTo(p1, p2);
				ctx.lineWidth = 0;		
				ctx.fillStyle = selectedColor;
				ctx.fill();
		},
	
		// Store each blocks data so we can reference it later
		craftBlock : function(id, blocksize, left, top, right, bottom) {
				// block number
				this.id = id;
				// block exact X/Y position
				this.left = left;
				this.top  = top;
				this.right = right;
				this.bottom = bottom;
				// block dimensions
				this.width = right - left;
				this.height = bottom - top;
				// square dimension of our block
				this.blocksize = blocksize;
				// block column/row position
				this.originCol = left / this.blocksize;
				this.originRow = top / this.blocksize;
				// track current position
				this.currentCol = undefined;
				this.currentRow = undefined;
		},
	
		// Function to swap blocks in our array
		swapBlocks : function(firstPick, secondPick) {
				var index1, index2, lastPick = firstPick, blocks = this.blocks,
						thisPick = blocks.indexOf(firstPick),
						thatPick = blocks.indexOf(secondPick);
				blocks[thisPick] = secondPick;
				blocks[thatPick] = lastPick;
		},

		// Create the blocks that will store the blocks data
		makePuzzle : function() {
				var col, row, thisBlock = {}, blocks = this.blocks, blocksize = (this.image.width / canvasElement.width) * this.blocksize;
				for (col = 0; col < this.cols; col++){
						for (row = 0; row < this.rows; row++){
								// each block is passed its current position on the canvas
								thisBlock = new this.craftBlock(blocks.length, blocksize, col * blocksize, row * blocksize, col * blocksize + blocksize, row * blocksize + blocksize);
								// before being stored in the blocks array
								blocks.push(thisBlock);
						}
				}
		},
		
		// The block shuffling function
		mixBlocks : function() {
				var tmp, pick1, pick2, times = 0, b = this.blocks;
				while (times < 666){
						pick1 = (Math.floor(Math.random() * b.length));
						pick2 = (Math.floor(Math.random() * b.length));
						tmp = this.blocks[pick1];
						b[pick1] = this.blocks[pick2];
						b[pick2] = tmp;
						times++;
				}
		},
	
		// Function to draw our blocks - used AFTER something changes on the canvas
		drawBlocks : function() {
				var col, row, block;
				var size = this.blocksize;
				for (col = 0; col < this.cols; col++){
						for (row = 0; row < this.rows; row++){
							// Find each block of our array going from top to bottom, left to right
							block = this.blocks[col * this.rows + row];
							this.canvas.getContext("2d").drawImage(
									this.image, block.left, block.top, block.width, block.height, col * size, row * size, size, size);
						}
				}
				//
				// Draw a grid over our puzzle
				//	
				if (enableGrid !== false) {
						var col, row, ctx = canvasElement.getContext("2d");
						for (col = 0; col <= canvasElement.width; col += this.blocksize) {
								for (row = 0; row <= canvasElement.height; row += this.blocksize) {
										ctx.strokeStyle = gridColor;
										ctx.moveTo(0.5 + col, 0);
										ctx.lineTo(0.5 + col, canvasElement.height);
										ctx.stroke();
										ctx.moveTo(0, 0.5 + row);
										ctx.lineTo(canvasElement.width, 0.5 + row);
										ctx.stroke();
								}
						}
				}
		},
	
	 // Check if each position of our blocks are correct
		checkBlocks : function(blocks) {
				var checked, right = 0, wrong = 0;
				for (checked = 0; checked < blocks.length; checked++) {
						// If a block is where it should be, count it
						if (blocks[checked].id === checked){ right++; }
				}
				if (right == blocks.length) {
						canvasMask.style.display = "none";
						console.log("All blocks correctly positioned. You did it!")
				} else {
						wrong = blocks.length - right;
						console.log("Correct: " + right + "/" + blocks.length + "." + " Incorrect: " + wrong);
				}	
		},

		// Block selection function
		selectBlock : function(event) {
		  // We need to track the last blocks selected for our mouse effects
		  this.firstPick = this.selected1;
		  this.lastPick = this.selected2;
				if (this.selected1 !== undefined && this.selected2 !== undefined) {
					 this.selected1 = undefined; this.selected2 = undefined;
				}
				var thisX,
								thisY,
								clickX = event.offsetX === undefined ? event.layerX: event.offsetX,
								clickY = event.offsetY === undefined ? event.layerY: event.offsetY,
								blockX = (Math.floor(clickX / this.blocksize)),
								blockY = (Math.floor(clickY / this.blocksize)),
								// Find and store the index number of our selected block
								index = ((blockX * this.rows) + blockY),
								thisBlock = this.blocks[index];
								// Store current position of the selected block inside of its own block reference
								thisBlock.currentCol = blockX;
								thisBlock.currentRow = blockY;
        
								thisX = ((blockX *= this.blocksize) / this.blocksize);
								thisY = ((blockY *= this.blocksize) / this.blocksize);
		
				// Is this block home?
				if (thisX == thisBlock.originCol && thisY == thisBlock.originRow) {
						console.log("This block is in place")
						return;
				}
				// Did we select the first block?
				if (this.selected1 === undefined){
						this.selected1 = thisBlock;
						this.drawBlocks();
						this.outlineBlock(blockX, blockY);
						canvasMask.style.display = "none";
				}
				// Did we select the second block?
				else {
				  // BUG
						// Run the function without passing any data to clear the last outline
						this.outlineBlock();	
						this.selected2 = thisBlock;
						this.swapBlocks(this.selected1, this.selected2);
						// Reset the selected blocks so we still see our hover effect
						this.selected1 = this.selected2 = undefined;
						this.drawBlocks();
						// Check if blocks are all in their correct positions
						this.checkBlocks(this.blocks);
				}
		},
	
		// Create our puzzle by running the major functions	and attaching some handlers
		create : function(image){
				var that = this;
		  this.image = image;
				this.setup();
				this.makePuzzle();
				this.mixBlocks();
				this.drawBlocks();
				// enable some event handlers so we can interact with the puzzle objects
				canvasElement.addEventListener("click", function(e) {
						that.selectBlock(e);
				}, false);
				canvasElement.addEventListener("mousemove", function(e) {
						if (enableHover !== false) {
								var rect = canvasElement.getBoundingClientRect(),
												mouseX = (Math.floor(e.clientX - rect.left)),
												mouseY = (Math.floor(e.clientY - rect.top)),
												newX = (Math.floor(mouseX / that.blocksize)),
												newY = (Math.floor(mouseY / that.blocksize));
								// if a block is selected
								if (that.selected1){
										// and that block is the current block we are hovering over, hide the hover effect
										if (newX === that.selected1.currentCol && newY === that.selected1.currentRow) {
												canvasMask.style.display = "none";
												return;
										}
								};
								// make sure that when no blocks are selected
								// or when just the first block is selected
								// we can still see our hover effect
								if (that.selected1 !== undefined || that.selected2 === undefined) {
										canvasMask.style.left = (newX * that.blocksize) + "px";
										canvasMask.style.top = (newY * that.blocksize) + "px";			
										canvasMask.style.display = "block";
										canvasMask.style.background = hoverColor;
								}
						canvasMask.style.width = (that.blocksize -1) + "px"; // -1 because border has been added in CSS
				  canvasMask.style.height = canvasMask.style.width;
						}
				}, false);
				canvasElement.addEventListener("mouseout", function() {
						canvasMask.style.display = "none";
				}, false);	
		}	
};

// Function to check if the HTML5 Canvas tag is supported in the current browser
var canvasExists = function() { var elt = document.createElement("canvas"); return !!(elt.getContext && elt.getContext("2d")); };
// If there is no canvas functionality even after a polyfill
if (!canvasExists) {
	 console.log("Your browser does not support the Canvas element. Please update your browser.");
}
// If there is Canvas support
else {
  // Create a new image
		var artwork = new Image();
		artwork.src = artPath;
		artwork.onload = function() {
		  // and make a puzzle out of it
				Puzzle.create(artwork);
				
				// Then dynamically make sure that the canvas' parent container is the right size
				Puzzle.canvasParent.style.width = canvasElement.width + "px";
				Puzzle.canvasParent.style.height = canvasElement.height + "px";
		}
}