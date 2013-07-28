// Function to check if the HTML5 Canvas tag is supported in the current browser
var canvasExists = function() { var elt = document.createElement("canvas"); return !!(elt.getContext && elt.getContext("2d")); };

// Below is a function that calculates all possible divisors of two numbers in order to
// calculate the number of equally portioned squares that can be made,
// without clipping, using the area of a quadrilateral shape, specifically a canvas element
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
    artPath =              "images/i-big.jpg", // image path
    enableGrid =           true, // true or false
    enableHover =          true, // true or false
    gridColor =            "rgba(60, 40, 20, 1)", // hex or rgba
    selectedColor =        "rgba(0, 0, 0, 0.75)", // hex or rgba
    hoverColor =           "rgba(0, 0, 0, 0.25)"; // hex or rgba

// our Puzzle object, where all the goods are stored
var	Puzzle = {
	
		setup : function() {
				this.canvas = canvasElement;
				this.mask = canvasMask;
		  this.blocks = [];
				this.blocksize = (parseInt(allDivisors(this.canvas.width, this.canvas.height, 44)));
				this.cols = (this.canvas.width / this.blocksize);
				this.rows = (this.canvas.height / this.blocksize);
		},

		// here we outline the block by connecting the points of each side
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
	
		// here we store each blocks data so we can use it again
		craftBlock : function(id, blocksize, left, top, right, bottom) {
				// block number
				this.id = id;
				// block exact X/Y position
				this.left = left;
				this.top  = top;
				this.right = right;
				this.bottom = bottom;
				// square dimension of our block
				this.blocksize = blocksize;
				// block column/row position
				this.col = left / this.blocksize;
				this.row = top / this.blocksize;
				// block dimensions
				this.width = right - left;
				this.height = bottom - top;
				// track current position
				this.thisCol = undefined;
				this.thisRow = undefined;
		},
	
		// the function to swap blocks
		swapBlocks : function(firstPick, secondPick) {
				var index1, index2, lastPick = firstPick, blocks = this.blocks;
						// store the positions of our blocks
						thisPick = blocks.indexOf(firstPick),
						thatPick = blocks.indexOf(secondPick);
				// and now swap the blocks in the array by switching their indexes
				blocks[thisPick] = secondPick;
				blocks[thatPick] = lastPick;
		},

		// lets create the blocks that will store the block data
		makePuzzle : function() {
				var cols, rows, thisBlock = {}, blocks = this.blocks, blocksize = (this.image.width / canvasElement.width) * this.blocksize;
				for (cols = 0; cols < this.cols; cols++){
						for (rows = 0; rows < this.rows; rows++){
								// each block is passed its current position on the canvas
								thisBlock = new this.craftBlock(blocks.length, blocksize, cols * blocksize, rows * blocksize, cols * blocksize + blocksize, rows * blocksize + blocksize);
								// before being stored in the blocks array
								blocks.push(thisBlock);
						}
				}
		},
		
		// this is the shuffle function
		mixBlocks : function() {
				var swap, pick1, pick2, times = 0, b = this.blocks;
				// optional passed array of blocks
				// b = blocks;
				while (times < 666){
						// randomize the positions of our blocks in the array
						// ~~ is a shorthand for rounding
						pick1 = Math.floor(Math.random() * b.length);
						pick2 = Math.floor(Math.random() * b.length);
						swap = b[pick1];
						b[pick1] = b[pick2];
						b[pick2] = swap;
						times++;
				}
		},
	
		// here we create a function to slice our canvas so
		// that we can utilize and move blocks around on the canvas
		drawBlocks : function() {
				var c, r, slice;
				var shape = this.blocksize;
				for (c = 0; c < this.cols; c++){
						for (r = 0; r < this.rows; r++){
							// slice our array in to individual blocks,
							// going from top to bottom, left to right...
							slice = this.blocks[c * this.rows + r];
							this.canvas.getContext("2d").drawImage(
									this.image, slice.left, slice.top, slice.width, slice.height, c * shape, r * shape, shape, shape);
						}
				}
				
				//
				// here we draw the grid over our sliced blocks
				//	
				if (enableGrid !== false) {
						var x, y, ctx = canvasElement.getContext("2d");
						for (x = 0; x <= canvasElement.width; x += this.blocksize) {
								for (y = 0; y <= canvasElement.height; y += this.blocksize) {
										ctx.strokeStyle = gridColor;
										ctx.moveTo(0.5 + x, 0);
										ctx.lineTo(0.5 + x, canvasElement.height);
										ctx.stroke();
										ctx.moveTo(0, 0.5 + y);
										ctx.lineTo(canvasElement.width, 0.5 + y);
										ctx.stroke();
								}
						}
				}
		},
	
	 // Check if each position of the blocks is correct
		checkBlocks : function(blocks) {
				var i, right = 0, wrong = 0;
				for (i = 0; i < blocks.length; i++) {
						// if a block is where it should be, increase the count
						if (blocks[i].id === i){ right++; }
				}
				if (right == blocks.length) {
						canvasMask.style.display = "none";
						console.log("All blocks correctly positioned. You did it!")
				} else {
						wrong = blocks.length - right;
						console.log("Correct: " + right + "/" + blocks.length + "." + " Incorrect: " + wrong);
				}	
		},

		// block selection is done via the mouse position on the canvas
		selectBlock : function(event) {
		  // we need to track the last blocks selected for our mouse effects
		  this.firstPick = this.selected1;
		  this.lastPick = this.selected2;
				if (this.selected1 !== undefined && this.selected2 !== undefined) {
					 this.selected1 = undefined; this.selected2 = undefined;
				}
				// store the x and y position of where we selected
				var thisX,
								thisY,
								clickX = event.offsetX === undefined ? event.layerX: event.offsetX,
								clickY = event.offsetY === undefined ? event.layerY: event.offsetY,
								blocksize = this.blocksize,
								b = this.blocks,
								// find our rows and columns by rounding our mouse position
								blockX = Math.floor(clickX / blocksize),
								blockY = Math.floor(clickY / blocksize),
								// find and store the index of our selected block
								index = blockX * this.rows + blockY,
								thisBlock = b[index];
								// store current position in the selected block
								thisBlock.thisCol = blockX;
								thisBlock.thisRow = blockY;

								blockX *= blocksize;
								blockY *= blocksize;

								thisX = blockX / blocksize;
								thisY = blockY / blocksize;
		
				// block is in its true position
				if (thisX == thisBlock.col && thisY == thisBlock.row) {
						console.log("This block is in place")
						return;
				}
				// if this is our first block
				if (this.selected1 === undefined){
						this.selected1 = thisBlock;
						// draw our blocks on the canvas
						Puzzle.drawBlocks();
						Puzzle.outlineBlock(blockX, blockY);
						canvasMask.style.display = "none";
				}
				// if this is our second block
				else {
						// run the function without passing any data to clear the last outline
						Puzzle.outlineBlock();	
						this.selected2 = thisBlock;
						Puzzle.swapBlocks(this.selected1, this.selected2);
						// reset the blocks so we still see our hover effect if enabled
						this.selected1 = this.selected2 = undefined;
						// draw our blocks on the canvas
						Puzzle.drawBlocks();
						// check if blocks are all in their true positions
						Puzzle.checkBlocks(this.blocks);
				}
		},
	
		// Lets create our puzzle by running the major functions	
		create : function(image){
		  this.image = image;
				// track the mouse and hover effects of blocks on our canvas
				canvasElement.addEventListener("click", function(e) {
						Puzzle.selectBlock(e);
				}, false);
				canvasElement.addEventListener("mousemove", function(e) {
						if (enableHover !== false) {
								var rect = canvasElement.getBoundingClientRect(),
												mouseX = Math.floor(e.clientX - rect.left),
												mouseY = Math.floor(e.clientY - rect.top),
												newX = Math.floor(mouseX / Puzzle.blocksize),
												newY = Math.floor(mouseY / Puzzle.blocksize);
								// if a block is selected
								if (Puzzle.selected1){
										// and that block is the current block we are hovering over, hide it
										if (newX === Puzzle.selected1.thisCol && newY === Puzzle.selected1.thisRow) {
												canvasMask.style.display = "none";
												return;
										}
								};
								// make sure that when no blocks are selected
								// or when just the first block is selected
								// we can still see our hover effect
								if (Puzzle.selected1 !== undefined || Puzzle.selected2 === undefined) {
										canvasMask.style.left = (newX * Puzzle.blocksize) + "px";
										canvasMask.style.top = (newY * Puzzle.blocksize) + "px";			
										canvasMask.style.display = "block";
										canvasMask.style.background = hoverColor;
								}
						canvasMask.style.width = (Puzzle.blocksize -1) + "px";
				  canvasMask.style.height = canvasMask.style.width;
						}
				}, false);
				canvasElement.addEventListener("mouseout", function() {
						canvasMask.style.display = "none";
				}, false);		
				this.setup();
				this.makePuzzle();
				this.mixBlocks();
				this.drawBlocks();
		}	
};

// if there is no canvas functionality
if (!canvasExists) {
	 console.log("Your browser does not support the Canvas element. Please update your browser.");
}
// but if there is
else {
		var artwork = new Image();
		artwork.src = artPath;
		artwork.onload = function() {
				Puzzle.create(artwork);
		}
}