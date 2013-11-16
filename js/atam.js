var atam = angular.module('atam', []);

//The set of unique tiles to be used in the construct
atam.factory('tileSet', [function() {
	var tileSet = [];
	//Holds all tiles in the tileset

	return tileset;
}]);

//The current universe of active tiles
atam.factory('universe', [function() {
	var Universe = new Object();
	//Holds all the current active tiles
	universe.grid = [];
	//Initialize the universe with a seed construct
	universe.init = function(seed){
		//Set the current universe's grid to the seed grid
		universe.grid = seed;
	}
	//Assemble the construct
	universe.assemble = function(){
		
	}
	
	//Insert a tile into at a specific location
	//Input: X coord, Y coord, a tile object
	function insert(x, y, newTile){
		//If the x value to insert is less than zero (outside left bound)
		if(x < 0){
			universe.grid.splice(0, 0, nil
	}
	return universe;
}]);

