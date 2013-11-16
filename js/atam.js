//The set of unique tiles to be used in the construct
myApp.factory('tileSet', [function() {
	var tileSet = new Object();
	//Holds all tiles in the tileset
	universe.grid = {};
	return universe;
}]);

//The current universe of active tiles
myApp.factory('universe', [function() {
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
	
	//
	return universe;
}]);

