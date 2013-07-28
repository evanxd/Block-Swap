

// Last jsLint: 7/9/13
// global definitions
var selected1, selected2, blockType;
    // options
var puzzleDiv =            document.getElementById("puzzlebox"),
		  loaderImg =            "images/loading.gif",
		  canvasDiv =	           document.getElementById("puzzle"), can = canvasDiv,
    canvasArt =            "images/i-2.jpg", // image path
    selectedEffect =       "rgba(0, 0, 0, 0.75)", // hex or rgb
    // grid
    gridEnable =           true, // true or false
    gridColor =            "#000000", // hex or rgb
    // hover effects
    hoverEnable =          true, // true or false
    hoverDiv =             document.getElementById("hover"), // html element
    hoverEffect =          "rgba(0, 0, 0, 0.25)"; // hex or rgba

function mouseEffects(event, args, dims) {
	var rect = can.getBoundingClientRect(),
			mouseX = Math.floor(event.clientX - rect.left),
			mouseY = Math.floor(event.clientY - rect.top),
			newX = Math.floor(mouseX / dims),
			newY = Math.floor(mouseY / dims);
	if (args !== false) {
		// make sure that when no blocks are selected
		// or when just the first block is selected
		// we can still see our hover effect
		if (selected1 !== undefined || selected2 == undefined) {
			hoverDiv.style.left = (newX * dims) + "px";
			hoverDiv.style.top = (newY * dims) + "px";			
			hoverDiv.style.display = "block";
			hoverDiv.style.background = hoverEffect;
		}
	}
}

function calculateSize(num1, num2){
	var n1, n2, x = 1, y = 1, arr = [], sorted;
		while (x < num1) {
			while (y < num2){
				if (y !== num2){
					n2 = Math.floor(num2 / y);
					if (n2 > 44){
						arr.push(n2);
						y++;	
					} else { break }
				} else { break }
			}
			if (x !== num1){
				n1 = Math.floor(num1 / x);
				if (n1 > 44){
					arr.push(n1)
					x++;
				} else { break }
			} else { break }
		}
	sorted = arr.sort();
	var common = [];
	for (var i = 0; i < arr.length - 1; i++) {
		if (sorted[i + 1] == sorted[i]) {
			common.push(sorted[i]);
		}
	}
	console.log("Common divsors/denominators for this images' dimensions: " + common);
	return common;
}

// function to check if canvas is supported. will return false if not supported
function canvas(){var elt = document.createElement('canvas'); return !!(elt.getContext && elt.getContext('2d'));}
// if there is no canvas functionality
if (!canvas) {
	console.log("Your browser does not support Canvas even after a polyfill... Yikes!");
}
// but if there is
else {
	var a = new Image();
	a.src = canvasArt;
	a.width = can.width;
	a.height = can.height;
	a.onload = function(){
		window.addEventListener('load', function() { Puzzle.init(); }, false);	
	}
}

// our Puzzle object, where all the goods are stored
var	Puzzle = {
	// the array that will hold all the blocks
	blocks : [],
	
	cols : function(blockSize){
		var x = can.width / blockSize;
		return x;
	},
	
	rows : function(blockSize){
		var y = can.height / blockSize;
		return y;
	},
	
	// how we build our image
	makeArt : function(art){
		var a = new Image();
		a.src = canvasArt;
		a.style.width = can.width;
		a.style.height = can.height;
		return a;
	},
	
	// block size
	blockSize : parseInt(calculateSize(can.width, can.height)),
	
	// here we outline the block by connecting the points of each side
	outlineBlock : function(p1, p2){
		hoverDiv.style.width = this.blockSize;
		hoverDiv.style.height = this.blockSize;
		var ctx = can.getContext('2d');
		ctx.beginPath();
		ctx.moveTo(p1, p2);
		ctx.lineTo(p1 + this.blockSize, p2);
		ctx.lineTo(p1 + this.blockSize, p2 + this.blockSize);
		ctx.lineTo(p1, p2 + this.blockSize);
		ctx.lineTo(p1, p2);
		ctx.lineWidth = 0;		
		ctx.fillStyle = selectedEffect;
		ctx.fill();
	},
	
	// here we store each blocks data so we can use it again
	craftBlock : function(id, size, left, top, right, bottom){
		// block number
		this.id = id;
		// square dimension of our block
		this.size = size;
		// block exact X/Y position
		this.left = left;
		this.top  = top;
		this.right = right;
		this.bottom = bottom;
		// block column/row position
		this.col = left / this.size; this.row = top / this.size;
		// block dimensions
		this.width = right - left; this.height = bottom - top;
	},
	
	// the function to swap blocks
	swapBlocks : function(firstPick, secondPick) {
		var index1, index2, lastPick = firstPick,
				// store the positions of our blocks
				thisPick = this.blocks.indexOf(firstPick),
				thatPick = this.blocks.indexOf(secondPick);
		// and now swap the blocks in the array by switching their indexes
		this.blocks[thisPick] = secondPick;
		this.blocks[thatPick] = lastPick;
	},



	// lets create the blocks that will store the block data
	makePuzzle : function() {
		var cols, rows, thisBlock = {}, blocks = this.blocks, size = this.blockSize;
		for (cols = 0; cols < this.cols(size); cols++){
			for (rows = 0; rows < this.rows(size); rows++){
				// each block is passed its current position on the canvas
				thisBlock = new this.craftBlock(blocks.length, size, cols * size, rows * size, cols * size + size, rows * size + size);
				// before being stored in the blocks array
				blocks.push(thisBlock);
			}
		}
	},
		
	// this is the shuffle function
	mixBlocks : function(blocks) {
		var swap, pick1, pick2,
		    times = 0,
		    b = this.blocks;
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
	drawBlocks : function(image, array) {
		// later hook for something other than a square size
		if (!blockType || blockType == square){
			var c, r, s, x, y, slice,
			    //i = image,
			    i = this.makeArt(),
			    
			    shape = this.blockSize;
			for (c = 0; c < this.cols(shape); c++){
				for (r = 0; r < this.rows(shape); r++){
					// slice our array in to individual blocks,
					// going from top to bottom, left to right...
					slice = this.blocks[c * this.rows(shape) + r];
					i.width = can.width;
					i.height = can.height;
					can.getContext('2d').drawImage(
					  i, slice.left, slice.top, slice.width, slice.height, c * shape, r * shape, shape, shape);
				}
			}
			
		}
		
		// here we draw the grid over our sliced blocks
		if (gridEnable !== false) {
			var ctx = can.getContext('2d');
			for (x = 0; x <= can.width; x += this.blockSize) {
				for (y = 0; y <= can.height; y += this.blockSize) {
					ctx.strokeStyle = gridColor;
					ctx.moveTo(0.5 + x, 0);
					ctx.lineTo(0.5 + x, can.height);
					ctx.stroke();
					ctx.moveTo(0, 0.5 + y);
					ctx.lineTo(can.width, 0.5 + y);
					ctx.stroke();
				}
			}
		}
	},
	
	checkBlocks : function(array){
		var i, b = this.blocks, right = 0, wrong = 0;
		// optional array
		// b = array;
		for (i = 0; i < b.length; i++){
			// if a block is where it should be, increase the count
			if (b[i].id === i){ right++; }
		}
		if (right == b.length){
			hoverDiv.style.display = "none";
			console.log("Finished!")
		} else {
			wrong = b.length - right;
			console.log("Correct: " + right + "/" + b.length + "." + " Incorrect: " + wrong);
		}	
	},

	// block selection is done via the mouse position on the canvas
	selectBlock : function(event, artwork, array){
		// store the x and y position of where we selected
		var thisX,
				thisY,
				clickX = event.offsetX === undefined ? event.layerX: event.offsetX,
				clickY = event.offsetY === undefined ? event.layerY: event.offsetY,
				size = this.blockSize,
				b = this.blocks,
				// find our rows and columns by rounding our mouse position
				blockX = Math.floor(clickX / size),
				blockY = Math.floor(clickY / size),
				// find and store the index of our selected block
				index = blockX * this.rows(size) + blockY,
				thisBlock = b[index];

				blockX *= size;
				blockY *= size;

				thisX = blockX / size;
				thisY = blockY / size;
		
		// block is in its true position
		if (thisX == thisBlock.col && thisY == thisBlock.row){
			console.log("This block is in place")
			return;
		}
		
		// reset the selected blocks
		if (selected1 !== undefined && selected2 !== undefined){
			selected1 = selected2 = undefined;
		}
		
		// if this is our first block
		if (selected1 === undefined){
			selected1 = thisBlock;
			// draw our blocks on the canvas
			Puzzle.drawBlocks();
			Puzzle.outlineBlock(blockX, blockY);	
		}
		// if this is our second block
		else {
			// run the function without passing any data to clear the last outline
			Puzzle.outlineBlock();	
			selected2 = thisBlock;
			Puzzle.swapBlocks(selected1, selected2);
			// draw our blocks on the canvas
			Puzzle.drawBlocks(artwork, b);
			// check if blocks are all in their true positions
			Puzzle.checkBlocks(b);
		}
	},
	// Lets create our puzzle by running the major functions	
	init : function(artwork, array){
		// track the mouse and hover effects of blocks on our canvas
		can.addEventListener('click', function(e) {
		  Puzzle.selectBlock(e, artwork, array);
		}, false);
		can.addEventListener('mousemove', function(e) {
		  mouseEffects(e, hoverEnable, Puzzle.blockSize);
		}, false);
		can.addEventListener('mouseout', function() {
		  hoverDiv.style.display = "none";
		}, false);		
		
						hoverDiv.style.width = 79 -1 + "px";
						hoverDiv.style.height = hoverDiv.style.width;
		
		this.makePuzzle();
		this.mixBlocks();
		this.drawBlocks();
	}	
};