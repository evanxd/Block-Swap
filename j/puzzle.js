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

// disabled because apparently this script is not strict enough
//"use strict";

// function to check if canvas is supported
function canvasSupport() {
	var elt = document.createElement('canvas');
	return !!(elt.getContext && elt.getContext('2d'));
};

// only enable puzzle functionality if canvas support exists
if (!canvasSupport) {
	alert("Your browser does not support Canvas! You must be using Internet Explorer 8 or older - Please maim yourself and update your browser.")
} else {

	// define global variables
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
				
		if (puzzleLoaded == true) {
			return;
		};

		can = document.getElementById("puzzle");
		canW = can.width;
		canH = can.height;
		can.className = "playing";
		ctx = can.getContext('2d');

		img = new Image();
		img.src = "i/o/i.jpg";

		img.onload = createPieces();
		puzzleLoaded = true;
		
	};

	function createPieces() {
		var r;
		for (var i = 0; i < cols; i++) {
			for (var j = 0; j < rows; j++) {
				r = new makePiece(i * pieceSize, j * pieceSize, i*pieceSize + pieceSize, j * pieceSize + pieceSize);
				piecesArray.push(r);
			};	
		};
	
		scramblePieces(piecesArray, totalPieces);
		drawPieces();
	};

	function selectPiece(e) {
	
		if (puzzleLoaded == false) {
			return;
		};

		clickX = e.offsetX;
		clickY = e.offsetY;
	
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
		};
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

	function swapPieces(r1, r2) {
		var index1;
		var index2;
		var temp = r1;
	
		index1 = piecesArray.indexOf(r1);
		index2 = piecesArray.indexOf(r2);
	
		piecesArray[index1] = r2;
		piecesArray[index2] = temp;			
	};

	function drawPieces() {
		for (var k = 0; k < cols; k++) {
			for (var l = 0; l < rows; l++) {
				r = piecesArray[k*rows+l];					
				ctx.drawImage(img, r.left, r.top, r.width, r.height, k*pieceSize, l*pieceSize, pieceSize, pieceSize);
			};
		};
	};

	function scramblePieces(ar, times) {
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
		};
	};

	function makePiece(left, top, right, bottom) {
		this.left = left;
		this.top  = top;
		this.right = right;
		this.bottom = bottom;
	
		this.width = right - left;
		this.height = bottom - top;
	};
};