let grid = [];
let cwh = 800;
let delta = 40;
let cellSize = cwh / delta;

let current;
let path = [];
let done = false;

function setup() {
	createCanvas(cwh + 1,cwh + 1);
	
	// fill the grid with cell objects
	for (let i = 0; i < cellSize; i++) {
		grid[i] = [];
		for (let j = 0; j < cellSize; j++) {
			// put a cell in this new array
			grid[i][j] = Cell(i * delta,j * delta);
		}
	}
	current = grid[0][0];
}

function draw() {
	background(200);
	
	// mark the current cell as visited
	current.visited = true;
	current.current = true;

	// draw cells
	for (let i = 0; i < cellSize; i++) {
		for (let j = 0; j < cellSize; j++) {
			grid[i][j].drawLines();
		}
	}

	current.current = false;

	// find a random neighbor
	let next = current.randomNeighbor();

	// if next is equal to null
	if (next == null) {
		// make current the last one in the path
		current = path.pop();
	} else {
		// put current on the path
		path.push(current);

		// destroy walls
		removeWalls(current, next);

		// make next current
		current = next;
	}
	if (done) {
		noLoop();
	}
	if (path.length <= 0) {
		//noLoop();
		done = true;
	}
}



// Objects
function Cell(x, y) {
	var obj = {};
	obj.x = x;
	obj.y = y;
	obj.i = x / delta;
	obj.j = y / delta;
	obj.walls = { top: true, left: true, bottom: true, right: true };
	obj.visited = false;
	obj.current = false;
	
	obj.drawLines = function() {
		// draw rect for color
		fill(200);
		if (obj.visited)
			fill(0,100,200);
		if (obj.current)
			fill(100,200,0);
		noStroke();
		rect(this.x, this.y, this.x + delta, this.y + delta);

		stroke(4);
		// top line
		if (obj.walls.top) 
			line(this.x, this.y, this.x + delta, this.y);
		// left line
		if (obj.walls.left) 
			line(this.x, this.y, this.x, this.y + delta);
		// draw bottom line
		if (obj.walls.bottom)
			line(this.x, this.y + delta, this.x + delta, this.y + delta);
		// right line
		if (obj.walls.right)
			line(this.x + delta, this.y, this.x + delta, this.y + delta);
	}

	obj.randomNeighbor = function() {
		let neighbors = [];
		let numNeighbors = 0;
		console.log(this.i,this.j);
		// finds neighbors and returns one of them randomly
		if (this.i > 0 && !(grid[this.i - 1][this.j]).visited) {
			// has a top neighbor
			neighbors.push(grid[this.i - 1][this.j]);
			numNeighbors++;
		}
		if (this.i < cellSize - 1 && !(grid[this.i + 1][this.j]).visited) {
			// has a right neighbor
			neighbors.push(grid[this.i + 1][this.j]);
			numNeighbors++;
		}
		if (this.j > 0 && !(grid[this.i][this.j - 1]).visited) {
			// has a top neighbor
			neighbors.push(grid[this.i][this.j - 1]);
			numNeighbors++;
		}
		if (this.j < cellSize - 1 && !(grid[this.i][this.j + 1]).visited) {
			// has a bottom neighbor
			neighbors.push(grid[this.i][this.j + 1]);
			numNeighbors++;
		}
		// pick a random index
		if (numNeighbors == 0) {
			return null;
		}
		return neighbors[Math.floor(Math.random() * numNeighbors)];
	}

	return obj;
}

// remove walls from Cells
function removeWalls(cell1, cell2) {
	// subtract x,y position to determine position of cells
	if (cell1.x - cell2.x < 0) {
		// if this is negative, then cell1 is to the left of cell2 : [1][2]
		// remove the right wall of cell1
		cell1.walls.right = false;
		// remove the left wall of cell2
		cell2.walls.left = false;
	} else if (cell2.x - cell1.x < 0) {
		// if this is negative, then cell2 is to the left of cell1 : [2][1]
		// remove the right wall of cell2
		cell2.walls.right = false;
		// remove the left wall of cell1
		cell1.walls.left = false;
	} else if (cell1.y - cell2.y < 0) {
		// if this is negative, then cell1 is above cell2 : [1]/[2]
		// remove the bottom wall of cell1
		cell1.walls.bottom = false;
		// remove the top wall of cell2
		cell2.walls.top = false;
	} else if (cell2.y - cell1.y < 0) {
		// if this is negative, then cell2 is above cell1 : [2]/[1]
		// remove the bottom wall of cell2
		cell2.walls.bottom = false;
		// remove the top wall of cell1
		cell1.walls.top = false;
	}
}