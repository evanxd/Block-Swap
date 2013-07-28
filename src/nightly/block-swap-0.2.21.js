// Last jsLint: 7/9/13

// canvas
var canvasDiv =							 document.getElementById("puzzle"), // html element
		can = canvasDiv,
		canvasArt = 						"images/i-2.jpg", // image path
		selectedEffect = 				"rgba(0, 0, 0, 0.75)", // hex or rgba
// grid
		gridEnable =						true, // true or false
		gridColor = 						"#000000", // hex or rgb
// hover effects
		hoverEnable =						true, // true or false
		hoverDiv =							document.getElementById("hover"), // html element
		hoverEffect = 					"rgba(0, 0, 0, 0.25)"; // hex or rgba

// global definitions
var selected1, selected2;

// our Puzzle object, where all the goods are stored
var	Puzzle = {
	// the array that will hold all the blocks
	blocks : [],
	// block size
	blockSize : 80,
	// function to find the highest common divisor of our image dimensions to create our block size
	//function gcd(x, y){var t; while (y !== 0){t = Math.floor(x % y); x = y; y = t; } return x;}
	//blockSize : gcd(can.width, can.height),
	
	cols : function(blockSize){
		var x = can.width / blockSize;
		return x;
	},
	
	rows : function(blockSize){
		var y = can.height / blockSize;
		return y;
	},
	
	// how we build our image
	makeArt : function(artwork){
		var a = new Image();
		a.src = artwork;
		return a;
	},
	
	// here we outline the block by connecting the points of each side
	outlineBlock : function(p1, p2){
		var ctx = can.getContext('2d');
		ctx.beginPath();
		ctx.moveTo(p1, p2);
		ctx.lineTo(p1 + Puzzle.blockSize, p2);
		ctx.lineTo(p1 + Puzzle.blockSize, p2 + Puzzle.blockSize);
		ctx.lineTo(p1, p2 + Puzzle.blockSize);
		ctx.lineTo(p1, p2);
		ctx.lineWidth = 0;		
		ctx.fillStyle = selectedEffect;
		ctx.fill();
	},
	
	// here we store each blocks data so we can use it again
	makeBlock : function(id, left, top, right, bottom){
		// this copies the interation we are in of intially finding blocks
		// with this we can easily track block by number
		this.id = id;
		// lets just store our all around values of the block so we know
		// exactly where our block is on the canvas
		this.left = left;
		this.top  = top;
		this.right = right;
		this.bottom = bottom;
		// this is where we store the position of where a block first exists
		// so we can compare to it later when swapping blocks
		this.col = left / Puzzle.blockSize;		
		this.row = top / Puzzle.blockSize;
		// store the dimensions of the block
		this.width = right - left;
		this.height = bottom - top;
		// is this block where it should be?
		//this.home = undefined;
	},
	
	// the function to swap blocks
	swapBlocks : function(array, selected1, selected2) {
		var index1,
				index2,
				temp = selected1;
		// store the positions of our blocks
		index1 = array.indexOf(selected1);
		index2 = array.indexOf(selected2);
		// and now swap the blocks in the array by switching their indexes
		array[index1] = selected2;
		array[index2] = temp;
	},


	// lets create the blocks that will store the block data
	makePuzzle : function(array) {
		// each block is an object
		var c,
				r,
				block = {};
		// and for every column...
		for (c = 0; c < Puzzle.cols(Puzzle.blockSize); c++){
		// and every row of our puzzle
			for (r = 0; r < Puzzle.rows(Puzzle.blockSize); r++){
				// each block is defined by its current position on the canvas
				block = new Puzzle.makeBlock(array.length, c * Puzzle.blockSize, r * Puzzle.blockSize, c*Puzzle.blockSize + Puzzle.blockSize, r * Puzzle.blockSize + Puzzle.blockSize);
				// before finally being pushed in to our blocks array
				array.push(block);
			}
		}
	},
	
	
	// this is the shuffle function
	mixBlocks : function(array) {
	
		var temp,
				index1,
				index2,
				count = 0,
				arr = array;
		// lets shuffle a little
		while (count < 666){
			// randomize the positions of our blocks in the array
			index1 = Math.floor(Math.random()*arr.length);
			index2 = Math.floor(Math.random()*arr.length);
			temp = arr[index1];
			arr[index1] = arr[index2];
			arr[index2] = temp;
			count++;
		}

	},
	
	// here we create a function to slice our canvas so
	// that we can utilize and move them around on the canvas
	drawBlocks : function(image, array) {
		var c, r, s, x, y,
				i = image,
				ctx = can.getContext('2d');
		// for every column
		for (c = 0; c < Puzzle.cols(Puzzle.blockSize); c++){
			// and every row
			for (r = 0; r < Puzzle.rows(Puzzle.blockSize); r++){
				// slice our array in to individual blocks,
				// going from top to bottom, left to right...
				s = array[c * Puzzle.rows(Puzzle.blockSize) + r];
				i.width = can.width;
				i.height = can.height;
				// and draw them on the canvas as stored
				//ctx = can.getContext('2d');
				can.getContext('2d').drawImage(i, s.left, s.top, s.width, s.height, c*Puzzle.blockSize, r*Puzzle.blockSize, Puzzle.blockSize, Puzzle.blockSize);
			}
		}
		// here we draw the grid over our sliced blocks
		if (gridEnable !== false) {
			for (x = 0; x <= can.width; x += Puzzle.blockSize) {
				for (y = 0; y <= can.height; y += Puzzle.blockSize) {
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
		var i,
				count = 0,
				a = array;
		// lets iterate over our blocks
		for (i = 0; i < a.length; i++){
			if (a[i].id === i){
				//a[i].home = true;
				// then we increase the count as we go
				count++;
			}	
			//console.log(temp + " " + count);
		}
		if (count >= a.length){
			//console.log("all blocks are correct");
			hoverDiv.style.display = "none";
			//return true;
		} else {
			//temp = count;
			console.log("Puzzle is not complete. Blocks correct: " + count + "/" + a.length);
		}
	},

	// block selection is done via the mouse position on the canvas
	selectBlock : function(event, artwork, array){
		// store the x and y position of where we selected
		var thisX,
				thisY,
				clickX = event.offsetX === undefined ? event.layerX: event.offsetX,
				clickY = event.offsetY === undefined ? event.layerY: event.offsetY,
				// find our rows and columns by rounding our mouse position
				blockX = Math.floor(clickX / Puzzle.blockSize),
				blockY = Math.floor(clickY / Puzzle.blockSize),
				// find and store the index of our selected block
				index = blockX * Puzzle.rows(Puzzle.blockSize) + blockY,
				target = array[index];

				blockX *= Puzzle.blockSize;
				blockY *= Puzzle.blockSize;

				thisX = blockX / Puzzle.blockSize;
				thisY = blockY / Puzzle.blockSize;
		
		// block is in its true position
		if (thisX == target.col && thisY == target.row){
			return;
		}
		// because both possible blocks dont exist
		if (selected1 !== undefined && selected2 !== undefined){
			// define them as undefined
			selected1 = selected2 = undefined;
		}
		// if our selected block is undefined
		if (selected1 === undefined){
			// define it as the current block
			selected1 = target;
			//console.log("first block selected")
			// cut our blocks again
			Puzzle.drawBlocks(artwork, array);
			// and outline the current block
			Puzzle.outlineBlock(blockX, blockY);	
		}
		// but if we already selected a block
		else {
			// run the function without passing any data to clear the last outline
			Puzzle.outlineBlock();	
			// define the second block as our target block
			selected2 = target;
			//console.log("second block selected")
			// then lets swap both of our blocks from their positions
			Puzzle.swapBlocks(array, selected1, selected2);
			//console.log("blocks swapped")
			// re-cut the blocks again so we can pick any block we want
			Puzzle.drawBlocks(artwork, array);
			// check if blocks are all in their true positions
			Puzzle.checkBlocks(array);
			//return;
		}
	},
	// Lets create our puzzle by running the major functions	
	init : function(artwork, array){	
	
	// function to add effects to our mouse movements
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
		// track the mouse and hover effects of blocks on our canvas
		can.addEventListener('click', function(e) { Puzzle.selectBlock(e, artwork, array); }, false);
		can.addEventListener('mousemove', function(e) { mouseEffects(e, hoverEnable, Puzzle.blockSize); }, false);
		can.addEventListener('mouseout', function() { hoverDiv.style.display = "none"; }, false);		
		// fills our array with all our blocks
		Puzzle.makePuzzle(array);
		// randomizes the location of our blocks
		Puzzle.mixBlocks(array);
		// slices the blocks on our canvas
		Puzzle.drawBlocks(artwork, array);
	}	
};

// function to check if canvas is supported. will return false if not supported
function canvas(){var elt = document.createElement('canvas'); return !!(elt.getContext && elt.getContext('2d'));}
// if there is no canvas functionality
if (!canvas) {
	console.log("Your browser does not support Canvas even after a polyfill... Yikes!");
}
// but if there is
else {
	// load the puzzle when the page loads
	window.addEventListener('load', function() { Puzzle.init(Puzzle.makeArt(canvasArt), Puzzle.blocks); }, false);		
}