var atam = angular.module('atam', []);

//The set of unique tiles to be used in the construct
atam.factory('tileSet', [function() {
	var tileSet = {};
	//Holds the set of unique tiles that are possible to use
	tileSet.set = [];
	//Create a new tile in the tile set
	tileSet.newTile = function(label, n_glue, e_glue, s_glue, w_glue){
		var new_tile = new Object();
		new_tile.label = label;
		new_tile.nglue = n_glue;
		new_tile.eglue = e_glue;
		new_tile.sglue = s_glue;
		new_tile.wglue = w_glue;
		tileSet.set.push(new_tile);
	}
	return tileset;
}]);

//The current universe of active tiles
atam.factory('universe', 'tileSet', [function(tileSet) {
	//The universe object
	var universe = new Object();
	//The temperature of the universe
	universe.temp = 2;
	//Holds all the current active tiles
	universe.grid = [];
	//An array that contains all the currently sticky tiles
	universe.sticky = [];
	//Initialize the universe with a seed construct
	universe.init = function(seed){
		//Set the current universe's grid to the seed grid
		universe.grid = seed;
	};
	//Assemble the construct
	universe.assemble = function(){
		//Dequeue the first item out of the unique tileset
		var candidateTile = tileSet.set.shift();
		//Iterate through the occupied tiles and see if the tile will fit
		for(var i=0; i<universe.sticky.length; i++){
			//The x coordinate of the current sticky tile
			var sticky_x = universe.sticky[i].x;
			//The y coordinate of the current sticky tile
			var sticky_y = universe.sticky[i].y;
			//If the tile north of the current tile isnt set
			if(universe.grid[universe.sticky[i] === undefined
		}
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
		//Add the coordinates to the sticky array
		var occ = new Object();
		occ.x = x;
		occ.y = y;
		universe.sticky.push(occ);
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


