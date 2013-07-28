// Hooks
var canvasDiv = 						document.getElementById("puzzle");
var hoverDiv =							document.getElementById("hover");
var artPath = 							"images/i-2.jpg"; // should match the canvas dimensions
var selectedEffect = 				"rgba(0, 0, 0, 0.6)"; // HEX or rgb/a
var hoverEffect = 					"rgba(0, 0, 0, 0.25)"; // HEX or rgb/a

// vars we need to execute the Puzzle object
var art,
		selected1,
		selected2;
		can = canvasDiv;
		ctx = can.getContext('2d');
		hover = hoverDiv;
		art = new Image();
		art.src = artPath;

// This is how we make this script scalable. Using the brlow function
// we can calculate the common divisor of any two numbers
//
// in order to find a matching block size for the size of the artwork or canvas
// calculate our block size but finding the great common denominator
// this is not full proof but works with perfect aspect ratios
var blockSize = function(x, y) {while (y != 0) {var z = Math.floor(x % y); x = y; y = z;} return x; };
blockSize = blockSize(can.width, can.height);
var cols = can.width / blockSize;
var rows = can.height / blockSize;
// these are the numbers we are trying to obtain in this case
// DO NOT DELETE
//blockSize = 80;
//var cols = 8;
//var rows = 5;

// function to check if canvas is supported
function canvas(){
	var elt = document.createElement('canvas');
	return !!(elt.getContext && elt.getContext('2d'));
};

// function to find our current mouse position
function mouseEffects(e) {
	rect = can.getBoundingClientRect();
	mouseY = e.clientY - rect.top;
	mouseX = e.clientX - rect.left;
	// make sure that when no blocks are selected
	// or when just the first block is selected
	// we can still see our hover effect
	if (selected1 !== undefined || selected2 == undefined){
		newX = (Math.floor(mouseX / blockSize)) * blockSize;
		newY = (Math.floor(mouseY / blockSize)) * blockSize;
		// position and show our html element that highlights blocks
		hover.style.left = newX + "px";
		hover.style.top = newY + "px";			
		hover.style.display = "block";
		hover.style.background = hoverEffect;
	}
}

// our Puzzle object
var	Puzzle = {

	// the array that will hold all the blocks
	blocks : [],
	
	// here we outline the block we select
	outlineBlock: (function(x, y){
		ctx.beginPath();
		ctx.moveTo(x, y);
		ctx.lineTo(x + blockSize, y);
		ctx.lineTo(x + blockSize, y + blockSize);
		ctx.lineTo(x, y + blockSize);
		ctx.lineTo(x, y);
		ctx.lineWidth = 1;
		ctx.fillStyle = selectedEffect;
		ctx.fill();
	}),
	
	// here we store each blocks data so we can use it again
	makeBlock: (function(id, elt, left, top, right, bottom){
		// this copies the interation we are in of intially finding blocks
		// with this we can easily track block by number
		this.id = id;
		// lets store the row and column this block is in
		// while we have access to the element it is in
		this.col = (left / blockSize)+1;
		this.row = (top / blockSize)+1;
		// lets just store our all around values of the block so we know
		// exactly where our block is on the canvas
		this.left = left;
		this.top  = top;
		this.right = right;
		this.bottom = bottom;
		// this is where we store the position of where a block first exists
		// so we can compare to it later when swapping blocks
		this.startX = left / blockSize;
		this.startY = top / blockSize;
		// store the dimensions of the block
		// THIS IS A REDUNDANCY
		this.width = right - left;
		this.height = bottom - top;
	}),
	
	// the function to swap blocks
	swapBlock: (function(a, s1, s2){
		var index1, index2;
		// keep the first block saved
		var temp = s1;
		// store the positions of our blocks
		index1 = a.indexOf(s1);
		index2 = a.indexOf(s2);
		// and now swap the blocks in the array by switching their indexes
		a[index1] = s2;
		a[index2] = temp;	
	}),
	
	// this is the shuffle function
	mixBlocks: (function(arr){
		var count = 0;
		var temp;
		var index1;
		var index2;
		// while our count is less than a number, multiply our rows by our columns
		while (count < ((cols * rows) * (rows + cols))){
			// randomize the positions of our blocks in the array
			index1 = Math.floor(Math.random()*arr.length);
			index2 = Math.floor(Math.random()*arr.length);
			temp = arr[index1];
			arr[index1] = arr[index2];
			arr[index2] = temp;
			count++;
		}
	}),
	
	// lets create the blocks that will store the block data
	createBlocks: (function(blocksArray){
		// each block is an object
		var block = {};
		// and for every column...
		for (var c = 0; c < cols; c++){
		// and every row of our puzzle
			for (var r = 0; r < rows; r++){
				// each block is defined by its current position on the canvas
				block = new Puzzle.makeBlock(blocksArray.length, can, c * blockSize, r * blockSize, c*blockSize + blockSize, r * blockSize + blockSize);
				// before finally being pushed in to our blocks array
				blocksArray.push(block);
			}
		}
	}),
	
	// here we create a function to slice our canvas so
	// that we can utilize and move them around on the canvas
	cutBlocks: (function(i, a){
	// for every column
		for (var c = 0; c < cols; c++){
			// and every row
			for (var r = 0; r < rows; r++){
				// slice our array in to individual blocks,
				// going from top to bottom, left to right...
				var s = a[c*rows+r];
				i.width = can.width;
				i.height = can.height;
				// and draw them on the canvas as stored
				ctx.drawImage(i, s.left, s.top, s.width, s.height, c*blockSize, r*blockSize, blockSize, blockSize);
			}
		}
	}),

	// block selection is done via the mouse position on the canvas
	selectBlock: (function(e){

		// alternately we could store the x and y position of where we selected
		// var clickX = e.offsetX == undefined ? e.layerX: e.offsetX;
		// var clickY = e.offsetY == undefined ? e.layerY: e.offsetY;
		
		// find our rows and columns by rounding our mouse position
		var blockX = Math.floor(mouseX / blockSize);
		var blockY = Math.floor(mouseY / blockSize);
		// find and store the index of our selected block
		var index = blockX * rows + blockY;
		var targetBlock = Puzzle.blocks[index];
		// lets make our block position based on its row and column position
		blockX *= blockSize;
		blockY *= blockSize;
		// store the current position of our selected block
		var nowX = (blockX / blockSize);
		var nowY = (blockY / blockSize);
		// store the starting position of our selected block
		var thenX = targetBlock.startX;
		var thenY = targetBlock.startY;
		// compare positions
		if (nowX == thenX && nowY == thenY){
			// because they are the same, disable the block
			return;
		}

		//ctx.clearRect(0, 0, cols * blockSize, rows * blockSize);
		
		// because both possible blocks dont exist
		if (selected1 != undefined && selected2 != undefined){
			// define them as undefined
			selected1 = selected2 = undefined;
		}
		// if our selected block is undefined
		if (selected1 == undefined){
			// define it as the current block
			selected1 = targetBlock;
			//console.log(selected1.startX)
			//console.log("first block selected")
			// cut our blocks again
			Puzzle.cutBlocks(art, Puzzle.blocks);
			// and outline the current block
			Puzzle.outlineBlock(blockX, blockY);	
		}
		// but if we already selected a block
		else {
			// define the second block as our target block
			selected2 = targetBlock;
			//console.log("second block selected")
			// then lets swap both of our blocks from their positions
			Puzzle.swapBlock(Puzzle.blocks, selected1, selected2);
			//console.log("blocks swapped")
			// re-cut the blocks again so we can pick any block we want
			Puzzle.cutBlocks(art, Puzzle.blocks);
			//selected1 = selected2 = undefined;
			// lets exit the function be safe sure that
			// nothing happens to our blocks after swapping
			return;
		}
	}),
	// Lets create our puzzle by running the major functions	
	createPuzzle: function(){	
		// fills our array with all our blocks
		Puzzle.createBlocks(Puzzle.blocks);
		// randomizes the location of our blocks
		// this also inherently enables movement of our blocks
		Puzzle.mixBlocks(Puzzle.blocks);
		// slices the blocks on our canvas
		Puzzle.cutBlocks(art, Puzzle.blocks);
	},		
};

// if there is no canvas functionality
if (!canvas){
	console.log("Your browser does not support Canvas even after a polyfill... Yikes!")
}
// but if there is
else {
	var window;
	// load the puzzle when the page loads
	window.addEventListener('load', function() {new Puzzle.createPuzzle()}, false);
	// track the mouse and hover effects of blocks on our canvas
	can.addEventListener('mousemove', function(e) {mouseEffects(e)}, false);
	// enable selection functionality on our canvas
	can.addEventListener('click', function(e) {Puzzle.selectBlock(e)}, false);
}