
// Hooks
// canvas specific
var canvasDiv = 						document.getElementById("puzzle"); // html element
var canvasArt = 						"images/i-2.jpg"; // image path
var selectedEffect = 				"rgba(0, 0, 0, 0.75)"; // hex or rgba

// grid lines
var gridEnable =						true; // true or false
var gridColor = 						"#000000"; // hex or rgb

// hover effects
var hoverEnable =						true; // true or false
var hoverDiv =							document.getElementById("hover"); // html element
var hoverEffect = 					"rgba(0, 0, 0, 0.25)"; // hex or rgba

// Lets define our variables that we need before the Puzzle is started
var selected1,
		selected2;
var	ctx = canvasDiv.getContext('2d');
var	art = new Image();
		art.src = canvasArt;
			
// function to check if canvas is supported. will return false if not supported
function canvas(){var elt = document.createElement('canvas'); return !!(elt.getContext && elt.getContext('2d'));};
	
// function to find the highest common divisor of our image dimensions to create our block size
function gcd(x, y){while (y != 0){var z = Math.floor(x % y); x = y; y = z; } return x;};

var blockSize = gcd(canvasDiv.width, canvasDiv.height);
var cols = canvasDiv.width / blockSize;
var rows = canvasDiv.height / blockSize;
// these are the numbers we are trying to obtain in this specific case
//var blockSize = 80;
//var cols = 8;
//var rows = 5;

// function to draw our grid lines
function drawGrid(args, elt, style) {
	if (args != false) {
		for (var x = 0; x <= elt.width; x += 80) {
			for (var y = 0; y <= elt.height; y += 80) {
				ctx.strokeStyle = style;
				ctx.moveTo(0.5 + x, 0);
				ctx.lineTo(0.5 + x, elt.height);
				ctx.stroke();
				ctx.moveTo(0, 0.5 + y);
				ctx.lineTo(elt.width, 0.5 + y);
				ctx.stroke();
			}
		}
	}
	return;
}

// function to add effects to our mouse movements
// as well, this function creates the positions needed to select a block
function mouseEffects(e, args) {
	var rect = canvasDiv.getBoundingClientRect();
	var mouseX = Math.floor(e.clientX - rect.left);
	var mouseY = Math.floor(e.clientY - rect.top);
	var newX = Math.floor(mouseX / blockSize);
	var newY = Math.floor(mouseY / blockSize);
	if (args != false) {
		// make sure that when no blocks are selected
		// or when just the first block is selected
		// we canvasDiv still see our hover effect
		if (selected1 != undefined || selected2 == undefined) {
			// position and show our html element that highlights blocks
			hoverDiv.style.left = (newX * blockSize) + "px";
			hoverDiv.style.top = (newY * blockSize) + "px";			
			hoverDiv.style.display = "block";
			hoverDiv.style.background = hoverEffect;
		}
		//console.log(mouseX + ", " + mouseY);
	}
}

// our Puzzle object, where all the goods are stored
var	Puzzle = {

	// the array that will hold all the blocks
	blocks : [],
	
	// here we outline the block by connecting the points of each side
	outlineBlock: (function(args, p1, p2){
		if ((isNaN(args)) == true && args == false){
			console.log("great, we were going to outline this block, but we told ourselves not to this time")
			return;
		}
		ctx.beginPath();
		ctx.moveTo(p1, p2);
		ctx.lineTo(p1 + blockSize, p2);
		ctx.lineTo(p1 + blockSize, p2 + blockSize);
		ctx.lineTo(p1, p2 + blockSize);
		ctx.lineTo(p1, p2);
		ctx.lineWidth = 0;		
		ctx.fillStyle = selectedEffect;
		ctx.fill();
	}),
	
	// here we store each blocks data so we canvasDiv use it again
	makeBlock: (function(id, elt, left, top, right, bottom){
		// this copies the interation we are in of intially finding blocks
		// with this we canvasDiv easily track block by number
		this.id = id;
		// lets just store our all around values of the block so we know
		// exactly where our block is on the canvas
		this.left = left;
		this.top  = top;
		this.right = right;
		this.bottom = bottom;
		// this is where we store the position of where a block first exists
		// so we canvasDiv compare to it later when swapping blocks
		this.col = left / blockSize;		
		this.row = top / blockSize;
		// is this block where it should be?
		this.home = undefined;
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
	mixBlocks: (function(array){
	
    var counter = array.length, temp, index;
    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = (Math.random() * counter--) | 0;
        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }
    return array;	
// 		var count = 0;
// 		var temp;
// 		var index1;
// 		var index2;
// 		// while our count is less than a number, multiply our rows by our columns
// 		while (count < ((cols * rows) * (rows + cols) * blockSize)){
// 			// randomize the positions of our blocks in the array
// 			index1 = Math.floor(Math.random()*arr.length);
// 			index2 = Math.floor(Math.random()*arr.length);
// 			temp = arr[index1];
// 			arr[index1] = arr[index2];
// 			arr[index2] = temp;
// 			count++;
// 		}
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
				block = new Puzzle.makeBlock(blocksArray.length, canvasDiv, c * blockSize, r * blockSize, c*blockSize + blockSize, r * blockSize + blockSize);
				// before finally being pushed in to our blocks array
				blocksArray.push(block);
			}
		}
	}),
	
	// here we create a function to slice our canvas so
	// that we canvasDiv utilize and move them around on the canvas
	cutBlocks: (function(i, a){
	// for every column
		for (var c = 0; c < cols; c++){
			// and every row
			for (var r = 0; r < rows; r++){
				// slice our array in to individual blocks,
				// going from top to bottom, left to right...
				var s = a[c*rows+r];
				i.width = canvasDiv.width;
				i.height = canvasDiv.height;
				// and draw them on the canvas as stored
				ctx.drawImage(i, s.left, s.top, s.width, s.height, c*blockSize, r*blockSize, blockSize, blockSize);
			}
		}
		
		// here we draw the grid
		drawGrid(gridEnable, canvasDiv, gridColor);
		
	}),
	
	checkBlocks: (function(){
		var a = Puzzle.blocks;
		var temp = 0;
		var count = 0;
		// lets iterate over our blocks
		for (var i = 0; i < a.length; i++){
			temp = count;
			if (a[i].id == i){
				a[i].home = true;
				// then we increase the count
				count++;
			}	
			console.log(temp + " " + count);
		};
		// if all blocks are marked as correctly positioned
		if (count >= a.length){
			console.log("all blocks are correct");
			// exit this function;
			//return true;
		} else {
			//temp = count;
			console.log("Puzzle is not complete. Blocks correct: " + count + "/" + a.length);
		}
	}),

	// block selection is done via the mouse position on the canvas
	selectBlock: (function(e){

		// store the x and y position of where we selected
		var clickX = e.offsetX == undefined ? e.layerX: e.offsetX;
		var clickY = e.offsetY == undefined ? e.layerY: e.offsetY;
		// find our rows and columns by rounding our mouse position
		var blockX = Math.floor(clickX / blockSize);
		var blockY = Math.floor(clickY / blockSize);
		// find and store the index of our selected block
		var index = blockX * rows + blockY;
		var targetBlock = Puzzle.blocks[index];

		blockX *= blockSize;
		blockY *= blockSize;

		var thisX = blockX / blockSize;
		var thisY = blockY / blockSize;
		
		// compare positions
		if (thisX == targetBlock.col && thisY == targetBlock.row){
			// because they are the same, disable the block
			console.log("This block (ID: " + targetBlock.id + ") is in its correct position. (Home variable set to: " + targetBlock.home + ")");
			return;
		}
		// because both possible blocks dont exist
		if (selected1 != undefined && selected2 != undefined){
			// define them as undefined
			selected1 = selected2 = undefined;
		}
		// if our selected block is undefined
		if (selected1 == undefined){
			// define it as the current block
			selected1 = targetBlock;
			//console.log("first block selected")
			// cut our blocks again
			Puzzle.cutBlocks(art, Puzzle.blocks);
			// and outline the current block
			Puzzle.outlineBlock(true, blockX, blockY);	
		}
		// but if we already selected a block
		else {
			// run our outline function to clear the original outline
			// not sure why we have to do this, but if we dont, a glow will appear
			// on the first selected block until we pick another
			Puzzle.outlineBlock(false);	
			// define the second block as our target block
			selected2 = targetBlock;
			//console.log("second block selected")
			// then lets swap both of our blocks from their positions
			Puzzle.swapBlock(Puzzle.blocks, selected1, selected2);
			//console.log("blocks swapped")
			// re-cut the blocks again so we canvasDiv pick any block we want
			Puzzle.cutBlocks(art, Puzzle.blocks);

			Puzzle.checkBlocks();

			return;
		}
	}),
	// Lets create our puzzle by running the major functions	
	init: function(){	
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
if (!canvas) {
	console.log("Your browser does not support Canvas even after a polyfill... Yikes!")
}
// but if there is
else {
	var window;
	// load the puzzle when the page loads
	window.addEventListener('load', function() {
		new Puzzle.init()
		// track the mouse and hover effects of blocks on our canvas
		canvasDiv.addEventListener('mouseover', function(e) {
			canvasDiv.addEventListener('mousemove', function(e) {
			mouseEffects(e, hoverEnable) }, false);	
		}, false);
		canvasDiv.addEventListener('mouseout', function(e) {
			hoverDiv.style.display = "none";}, false);
		// enable selection functionality on our canvas
		canvasDiv.addEventListener('click', function(e) { Puzzle.selectBlock(e) }, false);
	}, false);
}