var dir = [{x:1,y:0},{x:-1,y:0},{x:0,y:1},{x:0,y:-1}];

function mazeInRange(pos,dir,maxX,maxY){
	return (pos.x+dir.x > -1 && pos.x+dir.x < maxX) && (pos.y+dir.y > -1 && pos.y+dir.y < maxY);
}

function checkNeighbours(pos,map,trait,target){
	var nearby = 0
	for (var i = 0; i < dir.length; i++) {
		if(mazeInRange(pos,dir[i],map[0].length,map.length)) {
			if((map[pos.y+dir[i].y][pos.x+dir[i].x][trait] == target)){
				nearby++
			}
		}
	}
	return nearby
}

// https://weblog.jamisbuck.org/2015/10/31/mazes-blockwise-geometry.html
// http://weblog.jamisbuck.org/2011/1/24/maze-generation-hunt-and-kill-algorithm
function getMazeCoords(width,height){
	var output = []
	var map = []

	for (var i = 0; i < height; i++) {
		map[i] = []
		for (var j = 0; j < width; j++) {
			map[i][j] = {vis: false, fill: true}
		}
	}

	var pos = {x:0, y:0}
	map[pos.y][pos.x] = {vis: true, fill: false}
	var mapFinished = false

	maxIter = width*height

	while(!mapFinished && maxIter>0) {
		dir.shuffle();
		var carveOptFound = false;
		for (var i = 0; i < dir.length && !carveOptFound; i++) {
			if(mazeInRange(pos,dir[i],width,height)) {
				var pC = {x:pos.x+dir[i].x,y:pos.y+dir[i].y}
				if(checkNeighbours(pC,map,"fill",false)==1){
					map[pC.y][pC.x].vis = true;
					map[pC.y][pC.x].fill = false;
					pos = pC;
					carveOptFound = true;
				}
			}
		}

		if(!carveOptFound) { //reached end of d-loop -> hunt process: unvisited cell with visited neighbour
			var continueHunt = true;
			for (var i = 0; i < height && continueHunt; i++) {
				for (var j = 0; j < width && continueHunt; j++) {
					if(map[i][j].vis == false){
						if(checkNeighbours({x:j,y:i},map,"fill",false)<2){
							if(checkNeighbours({x:j,y:i},map,"vis",true)>0){
								pos = {x:j, y:i}
								map[pos.y][pos.x] = {vis: true, fill: false}
								continueHunt = false
							}
						}
					}
				}
			}
			if(continueHunt) {
				mapFinished = true; 
				console.log("Reached end of hunt")
			}
		}
		maxIter--;
	}

	if(maxIter == 0) console.log("Maze timed out")

	for (var i = 0; i < height; i++) {
		for (var j = 0; j < width; j++) {
			if(map[i][j].fill){
				output.push({x:j,y:i});
			}
		}
	}
	return output
}