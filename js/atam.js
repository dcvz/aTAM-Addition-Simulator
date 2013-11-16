var atam = angular.module('atam', []);

//The set of unique tiles to be used in the construct
atam.factory('tileSet', [function() {
	var tileSet = [];
	//Holds all tiles in the tileset

	return tileset;
}]);

//The current universe of active tiles
atam.factory('universe', [function() {
	//The universe object
	var universe = new Object();
	//Holds all the current active tiles
	universe.grid = [];
	//Initialize the universe with a seed construct
	universe.init = function(seed){
		//Set the current universe's grid to the seed grid
		universe.grid = seed;
	};
	//Assemble the construct
	universe.assemble = function(){
		
	};
	//Insert a tile into at a specific location
	//Input: X coord, Y coord, a tile object
	universe.insert = function insert(x, y, newTile){
		//If the x value to insert is less than zero (outside left bound)
		if(x < 0){
			//Add an element on to the front of each array
			for(var i=0; i<universe.grid.length; i++){
				universe.grid[i].splice(null, 0, null);
			}
		}
		//If the y value is less than zero (outside upper bound)
		if(y < 0){
			//Insert a new array at the beginning with a length of the other arrays
			universe.grid.unshift(new Array());
		}
		//If there is not an array at the y value create one
		if( universe.grid[y] === undefined ) {
			universe.grid[y] = [];
			console.log("Created new Array");
		}
		//Insert the tile into the location
		universe.grid[y][x] = newTile;
	};
	return universe;
}]);

atam.controller('atamCtrl', ['$scope', 'universe', function($scope, universe) {

	
	$scope.createConstruct = function(){
		//Test tile
		var Tile1=new Object();
		//Glue 1
		var glue1 = new Object();
		//Glue 2
		var glue2 = new Object();
		Tile1.nglue = glue1;
		Tile1.sglue = glue2;
		
		universe.insert(50, 50, Tile1);
		universe.insert(3, 58, Tile1);
		
		console.log(universe);
	};
	$scope.createConstruct();
}]);


