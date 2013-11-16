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
		//Loop breaker
		var loopBreaker = 0;
		while(true){
			//Dequeue the first item out of the unique tileset
			var candidateTile = tileSet.set.shift();
			//If a tile is matched this will be set to true
			var match = false;
			//Iterate through the occupied tiles and see if the tile will fit
			for(var i=0; i<universe.sticky.length; i++){
				//The current sum of the binding strength
				var bindSum = 0;
				//The x coordinate of the current sticky tile
				var sticky_x = universe.sticky[i].x;
				//The y coordinate of the current sticky tile
				var sticky_y = universe.sticky[i].y;
				
				//If the tile north of the sticky tile is not set and the glue matches
				if(universe.grid[sticky_y - 1][sticky_x] === undefined && candidateTile.sglue.label == universe.sticky[i].nglue.label){
					//Add the strength to the bind sum
					bindSum += candidateTile.sglue.strength;
					//If the bind sum is greater than or equal to the temp
					if(bindSum >= universe.temp){
						//Insert the candidate tile
						universe.insert(sticky_x, sticky_y - 1, candidateTile);
						//Tile match!
						match = true;
						loopBreaker = 0;
						continue;
					}
					//If the bind sum is not greater than or equal to the temp, check for cooperative binding
					else{
						//Check north of the cadidate tile
						if(universe.grid[sticky_y - 2][sticky_x] !== undefined && candidateTile.nglue.label == universe.grid[sticky_y - 2][sticky_x].sglue){
							//Add the strength to the bind sum
							bindSum =+ candidateTile.nglue.strength;
							if(bindSum >= universe.temp){
								//Insert the candidate tile
								universe.insert(sticky_x, sticky_y - 1, candidateTile);
								//Tile match!
								match = true;
								loopBreaker = 0;
								continue;
							}
						}
						//Check east of the cadidate tile
						if(universe.grid[sticky_y - 2][sticky_x + 1] !== undefined && candidateTile.eglue.label == universe.grid[sticky_y - 2][sticky_x + 1].wglue){
							//Add the strength to the bind sum
							bindSum =+ candidateTile.eglue.strength;
							if(bindSum >= universe.temp){
								//Insert the candidate tile
								universe.insert(sticky_x, sticky_y - 1, candidateTile);
								//Tile match!
								match = true;
								loopBreaker = 0;
								continue;
							}
						}
						//Check west of the cadidate tile
						if(universe.grid[sticky_y - 2][sticky_x - 1] !== undefined && candidateTile.wglue.label == universe.grid[sticky_y - 2][sticky_x - 1].eglue){
							//Add the strength to the bind sum
							bindSum =+ candidateTile.wglue.strength;
							if(bindSum >= universe.temp){
								//Insert the candidate tile
								universe.insert(sticky_x, sticky_y - 1, candidateTile);
								//Tile match!
								match = true;
								loopBreaker = 0;
								continue;
							}
						}
					}
				}
				
				//If the tile east of the sticky tile is not set and the glue matches
				if(universe.grid[sticky_y][sticky_x + 1] === undefined && candidateTile.wglue.label == universe.sticky[i].eglue.label){
					//Add the strength to the bind sum
					bindSum += candidateTile.wglue.strength;
					//If the bind sum is greater than or equal to the temp
					if(bindSum >= universe.temp){
						//Insert the candidate tile
						universe.insert(sticky_x + 1, sticky_y, candidateTile);
						//Tile match!
						match = true;
						continue;
					}
					//If the bind sum is not greater than or equal to the temp, check for cooperative binding
					else{
						//Check north of the cadidate tile
						if(universe.grid[sticky_y - 1][sticky_x + 1] !== undefined && candidateTile.nglue.label == universe.grid[sticky_y - 1][sticky_x + 1].sglue){
							//Add the strength to the bind sum
							bindSum =+ candidateTile.nglue.strength;
							if(bindSum >= universe.temp){
								//Insert the candidate tile
								universe.insert(sticky_x + 1, sticky_y, candidateTile);
								//Tile match!
								match = true;
								loopBreaker = 0;
								continue;
							}
						}
						//Check east of the cadidate tile
						if(universe.grid[sticky_y][sticky_x + 2] !== undefined && candidateTile.eglue.label == universe.grid[sticky_y][sticky_x + 2].wglue){
							//Add the strength to the bind sum
							bindSum =+ candidateTile.eglue.strength;
							if(bindSum >= universe.temp){
								//Insert the candidate tile
								universe.insert(sticky_x + 1, sticky_y, candidateTile);
								//Tile match!
								match = true;
								loopBreaker = 0;
								continue;
							}
						}
						//Check south of the cadidate tile
						if(universe.grid[sticky_y + 1][sticky_x + 1] !== undefined && candidateTile.sglue.label == universe.grid[sticky_y + 1][sticky_x + 1].nglue){
							//Add the strength to the bind sum
							bindSum =+ candidateTile.sglue.strength;
							if(bindSum >= universe.temp){
								//Insert the candidate tile
								universe.insert(sticky_x + 1, sticky_y, candidateTile);
								//Tile match!
								match = true;
								loopBreaker = 0;
								continue;
							}
						}
					}
				}
				
				//If the tile south of the sticky tile is not set and the glue matches
				if(universe.grid[sticky_y + 1][sticky_x] === undefined && candidateTile.nglue.label == universe.sticky[i].sglue.label){
					//Add the strength to the bind sum
					bindSum += candidateTile.nglue.strength;
					//If the bind sum is greater than or equal to the temp
					if(bindSum >= universe.temp){
						//Insert the candidate tile
						universe.insert(sticky_x, sticky_y + 1, candidateTile);
						//Tile match!
						match = true;
						loopBreaker = 0;
						continue;
					}
					//If the bind sum is not greater than or equal to the temp, check for cooperative binding
					else{
						//Check south of the cadidate tile
						if(universe.grid[sticky_y + 2][sticky_x] !== undefined && candidateTile.sglue.label == universe.grid[sticky_y + 2][sticky_x].nglue){
							//Add the strength to the bind sum
							bindSum =+ candidateTile.nglue.strength;
							if(bindSum >= universe.temp){
								//Insert the candidate tile
								universe.insert(sticky_x, sticky_y + 1, candidateTile);
								//Tile match!
								match = true;
								loopBreaker = 0;
								continue;
							}
						}
						//Check east of the cadidate tile
						if(universe.grid[sticky_y + 1][sticky_x + 1] !== undefined && candidateTile.eglue.label == universe.grid[sticky_y + 1][sticky_x + 1].wglue){
							//Add the strength to the bind sum
							bindSum =+ candidateTile.eglue.strength;
							if(bindSum >= universe.temp){
								//Insert the candidate tile
								universe.insert(sticky_x, sticky_y + 1, candidateTile);
								//Tile match!
								match = true;
								loopBreaker = 0;
								continue;
							}
						}
						//Check west of the cadidate tile
						if(universe.grid[sticky_y + 1][sticky_x - 1] !== undefined && candidateTile.wglue.label == universe.grid[sticky_y + 1][sticky_x - 1].eglue){
							//Add the strength to the bind sum
							bindSum =+ candidateTile.wglue.strength;
							if(bindSum >= universe.temp){
								//Insert the candidate tile
								universe.insert(sticky_x, sticky_y + 1, candidateTile);
								//Tile match!
								match = true;
								loopBreaker = 0;
								continue;
							}
						}
					}
				}

				//If the tile west of the sticky tile is not set and the glue matches
				if(universe.grid[sticky_y][sticky_x - 1] === undefined && candidateTile.eglue.label == universe.sticky[i].wglue.label){
					//Add the strength to the bind sum
					bindSum += candidateTile.eglue.strength;
					//If the bind sum is greater than or equal to the temp
					if(bindSum >= universe.temp){
						//Insert the candidate tile
						universe.insert(sticky_x - 1, sticky_y, candidateTile);
						//Tile match!
						match = true;
						loopBreaker = 0;
						continue;
					}
					//If the bind sum is not greater than or equal to the temp, check for cooperative binding
					else{
						//Check north of the cadidate tile
						if(universe.grid[sticky_y + 1][sticky_x - 1] !== undefined && candidateTile.nglue.label == universe.grid[sticky_y + 1][sticky_x - 1].sglue){
							//Add the strength to the bind sum
							bindSum =+ candidateTile.nglue.strength;
							if(bindSum >= universe.temp){
								//Insert the candidate tile
								universe.insert(sticky_x - 1, sticky_y, candidateTile);
								//Tile match!
								match = true;
								loopBreaker = 0;
								continue;
							}
						}
						//Check west of the cadidate tile
						if(universe.grid[sticky_y][sticky_x - 2] !== undefined && candidateTile.wglue.label == universe.grid[sticky_y][sticky_x - 2].eglue){
							//Add the strength to the bind sum
							bindSum =+ candidateTile.wglue.strength;
							if(bindSum >= universe.temp){
								//Insert the candidate tile
								universe.insert(sticky_x - 1, sticky_y, candidateTile);
								//Tile match!
								match = true;
								loopBreaker = 0;
								continue;
							}
						}
						//Check south of the cadidate tile
						if(universe.grid[sticky_y + 1][sticky_x - 1] !== undefined && candidateTile.sglue.label == universe.grid[sticky_y + 1][sticky_x - 1].nglue){
							//Add the strength to the bind sum
							bindSum =+ candidateTile.sglue.strength;
							if(bindSum >= universe.temp){
								//Insert the candidate tile
								universe.insert(sticky_x - 1, sticky_y, candidateTile);
								//Tile match!
								match = true;
								loopBreaker = 0;
								continue;
							}
						}
					}
				}
			}
			//If match set loopbreaker to 0
			if(match){
				loopBreaker = 0;
			} else {
				loopBreaker ++;
			}
			//If the loopbreaker is bigger than the tileset array, break out because nothing else can be assembled
			if(loopBreaker > tileSet.set.length){
				break;
			}
			//Push the candidate tile back onto the array
			tileSet.set.push(candidateTile);
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


