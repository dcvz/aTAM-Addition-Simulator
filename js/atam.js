var atam = angular.module('atam', []);

//The set of unique tiles to be used in the construct
atam.factory('tileSet', [function() {
	var tileSet = {};
	//Holds the set of unique tiles that are possible to use
	tileSet.set = [];
	//Insert
	tileSet.insert = function(tile){
		tileSet.set.push(tile);
	}
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
	return tileSet;
}]);

//The current universe of active tiles
atam.factory('universe', ['tileSet', 'graphics', function(tileSet, graphics) {
	//The universe object
	var universe = new Object();
	//The temperature of the universe
	universe.temp = 2;
	//An optional cycle counter
	universe.cycleCount = null;
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
		//Optional cycle checker
		var currentCycle = 0;
		while(true){
			//Dequeue the first item out of the unique tileset
			var candidateTile = tileSet.set.shift();
			if(candidateTile === undefined){
				break;
			}
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
				
				//Check north of tile
				if((universe.grid[sticky_y - 1] === undefined || universe.grid[sticky_y - 1][sticky_x] === undefined) && universe.sticky[i].nglue !== null && candidateTile.sglue !== null && candidateTile.sglue.label == universe.sticky[i].nglue.label){
					//Add the strength to the bind sum
					bindSum = bindSum + candidateTile.sglue.strength;
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
						if((universe.grid[sticky_y - 2] !== undefined && universe.grid[sticky_y - 2][sticky_x] !== undefined) && candidateTile.nglue !== null && universe.grid[sticky_y - 2][sticky_x].sglue !== null && candidateTile.nglue.label == universe.grid[sticky_y - 2][sticky_x].sglue.label){
							//Add the strength to the bind sum
							bindSum = bindSum + candidateTile.nglue.strength;
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
						if((universe.grid[sticky_y - 1] !== undefined && universe.grid[sticky_y - 1][sticky_x + 1] !== undefined) && candidateTile.eglue !== null && universe.grid[sticky_y - 1][sticky_x + 1].wglue !== null && candidateTile.eglue.label == universe.grid[sticky_y - 1][sticky_x + 1].wglue.label){
							//Add the strength to the bind sum
							bindSum = bindSum + candidateTile.eglue.strength;
							console.log(bindSum);
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
						if((universe.grid[sticky_y - 1] !== undefined && universe.grid[sticky_y - 1][sticky_x - 1] !== undefined) && candidateTile.wglue !== null && universe.grid[sticky_y - 1][sticky_x - 1].eglue !== null &&  candidateTile.wglue.label == universe.grid[sticky_y - 1][sticky_x - 1].eglue.label){
							//Add the strength to the bind sum
							bindSum = bindSum + candidateTile.wglue.strength;
							console.log(bindSum);
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
				else if(universe.grid[sticky_y][sticky_x + 1] === undefined && universe.sticky[i].eglue !== null && candidateTile.wglue !== null && candidateTile.wglue.label == universe.sticky[i].eglue.label){
					//Add the strength to the bind sum
					bindSum = bindSum + candidateTile.wglue.strength;
					//If the bind sum is greater than or equal to the temp
					if(bindSum >= universe.temp){
						//Insert the candidate tile
						universe.insert(sticky_x + 1, sticky_y, candidateTile);
						//Tile match!
						match = true;
						loopBreaker = 0;
						continue;
					}
					//If the bind sum is not greater than or equal to the temp, check for cooperative binding
					else{
						//Check north of the cadidate tile
						if((universe.grid[sticky_y - 1] !== undefined && universe.grid[sticky_y - 1][sticky_x + 1] !== undefined) && candidateTile.nglue !== null && universe.grid[sticky_y - 1][sticky_x + 1].sglue !== null &&  candidateTile.nglue.label == universe.grid[sticky_y - 1][sticky_x + 1].sglue.label){
							//Add the strength to the bind sum
							bindSum = bindSum + candidateTile.nglue.strength;
							console.log(bindSum);
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
						if(universe.grid[sticky_y][sticky_x + 2] !== undefined && candidateTile.eglue !== null && universe.grid[sticky_y][sticky_x + 2].wglue !== null && candidateTile.eglue.label == universe.grid[sticky_y][sticky_x + 2].wglue.label){
							//Add the strength to the bind sum
							bindSum = bindSum + candidateTile.eglue.strength;
							console.log(bindSum);
							if(bindSum >= universe.temp){
								//Insert the candidate tile
								universe.insert(sticky_x + 1, sticky_y, candidateTile);
								//Tile match!
								match = true;
								loopBreaker = 0;
								continue;
							}
						}
						if((universe.grid[sticky_y + 1] !== undefined && universe.grid[sticky_y + 1][sticky_x + 1] !== undefined) && candidateTile.sglue !== null &&  candidateTile.sglue.label == universe.grid[sticky_y + 1][sticky_x + 1].nglue.label){
							//Add the strength to the bind sum
							bindSum = bindSum + candidateTile.sglue.strength;
							console.log(bindSum);
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
					console.log(bindSum);
				}
				//If the tile south of the sticky tile is not set and the glue matches
				else if((universe.grid[sticky_y + 1] === undefined || universe.grid[sticky_y + 1][sticky_x] === undefined) && universe.sticky[i].sglue !== null && candidateTile.nglue !== null &&  candidateTile.nglue.label == universe.sticky[i].sglue.label){
					//Add the strength to the bind sum
					bindSum = bindSum + candidateTile.nglue.strength;
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
						if((universe.grid[sticky_y + 2] !== undefined && universe.grid[sticky_y + 2][sticky_x] !== undefined) && candidateTile.sglue !== null &&  candidateTile.sglue.label == universe.grid[sticky_y + 2][sticky_x].nglue.label){
							//Add the strength to the bind sum
							bindSum = bindSum + candidateTile.sglue.strength;
							console.log(bindSum);
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
						if((universe.grid[sticky_y + 1] !== undefined && universe.grid[sticky_y + 1][sticky_x + 1] !== undefined) && candidateTile.eglue !== null && candidateTile.eglue.label == universe.grid[sticky_y + 1][sticky_x + 1].wglue.label){
							//Add the strength to the bind sum
							bindSum = bindSum + candidateTile.eglue.strength;
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
						if((universe.grid[sticky_y + 1] !== undefined && universe.grid[sticky_y + 1][sticky_x - 1] !== undefined) && candidateTile.wglue !== null &&  candidateTile.wglue.label == universe.grid[sticky_y + 1][sticky_x - 1].eglue.label){
							//Add the strength to the bind sum
							bindSum = bindSum + candidateTile.wglue.strength;
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
				else if(universe.grid[sticky_y][sticky_x - 1] === undefined && universe.sticky[i].wglue !== null && candidateTile.eglue !== null && candidateTile.eglue.label == universe.sticky[i].wglue.label){
					//Add the strength to the bind sum
					bindSum = bindSum + candidateTile.eglue.strength;
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
						if((universe.grid[sticky_y + 1] !== undefined && universe.grid[sticky_y + 1][sticky_x - 1] !== undefined) && candidateTile.nglue !== null && universe.grid[sticky_y + 1][sticky_x - 1].sglue !== null && candidateTile.nglue.label == universe.grid[sticky_y + 1][sticky_x - 1].sglue.label){
							//Add the strength to the bind sum
							bindSum = bindSum + candidateTile.nglue.strength;
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
						if(universe.grid[sticky_y][sticky_x - 2] !== undefined && candidateTile.wglue !== null && universe.grid[sticky_y][sticky_x - 2].eglue !== null && candidateTile.wglue.label == universe.grid[sticky_y][sticky_x - 2].eglue.label){
							//Add the strength to the bind sum
							bindSum = bindSum + candidateTile.wglue.strength;
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
						if((universe.grid[sticky_y + 1] !== undefined && universe.grid[sticky_y + 1][sticky_x - 1] !== undefined) && candidateTile.sglue !== null &&  universe.grid[sticky_y + 1][sticky_x - 1].nglue !== null && candidateTile.sglue.label == universe.grid[sticky_y + 1][sticky_x - 1].nglue.label){
							//Add the strength to the bind sum
							bindSum = bindSum + candidateTile.sglue.strength;
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
					console.log(bindSum);
				}
			}
			//If match set loopbreaker to 0
			if(match){
				loopBreaker = 0;
			} else {
				loopBreaker ++;
			}

			//If the loopbreaker is bigger than the tileset array, break out because nothing else can be assembled
			if(loopBreaker > tileSet.set.length+1){
				break;
			}
			//Push the candidate tile back onto the array
			tileSet.set.push(candidateTile);
			//If cycleCounter is set
			if(universe.cycleCount !== null){
				currentCycle ++;
				if(currentCycle > universe.cycleCount){
					break;
				}
			}
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
				x = 0;
			}
			// Readjust coordinates
			for(var i=0; i<universe.sticky.length; i++){
				universe.sticky[i].x ++;
			}
		}
		//If the y value is less than zero (outside upper bound)
		if(y < 0){
			//Insert a new array at the beginning with a length of the other arrays
			universe.grid.unshift(new Array());
			y = 0;
			// Readjust coordinates
			for(var i=0; i<universe.sticky.length; i++){
				universe.sticky[i].y ++;
			}
		}
		//If there is not an array at the y value create one
		if( universe.grid[y] === undefined ) {
			universe.grid[y] = [];
		}
		//Insert the tile into the location
		universe.grid[y][x] = newTile;
		//console.log(x + ", " + y);
		//Add the coordinates to the sticky array
		var occ = new Object();
		occ.x = x;
		occ.y = y;
		occ.nglue = newTile.nglue;
		occ.eglue = newTile.eglue;
		occ.sglue = newTile.sglue;
		occ.wglue = newTile.wglue;
		occ.label = newTile.label;
		universe.sticky.push(occ);

	};
	return universe;
}]);

atam.controller('atamCtrl', ['$scope', '$http', 'universe', 'tileSet', 'graphics', '$timeout', function($scope, $http, universe, tileSet, graphics, $timeout) {
	$scope.numberB = "100110101";
	$scope.numberA = "110101100";
	
	//Number of digits
	var numDigits = $scope.numberA.length;
	//Get the square root and floor it
	var numSections = Math.sqrt(numDigits);
	numSections = Math.floor(numSections);
	console.log(numSections);
	
	
	
	$scope.fastAdder = function(){
		var glue1 = new Object();
		glue1.label = "1";
		glue1.strength = 1;
		
		var glue0 = new Object();
		glue0.label = "0";
		glue0.strength = 1;
		
		var glueNc = new Object();
		glueNc.label = "NC";
		glueNc.strength = 1;
		
		var glueZ = new Object();
		glueZ.label = "Z";
		glueZ.strength = 1;
	
		var glueF1 = new Object();
		glueF1.label = "F1";
		glueF1.strength = 1;
		
		//Seed tiles
		var z = new Object();
		z.nglue = null;
		z.eglue = null;
		z.sglue = null;
		z.wglue = glueZ;
		z.label = " ";
		
		var blank = new Object();
		blank.nglue = null;
		blank.eglue = null;
		blank.sglue = null;
		blank.wglue = null;
		blank.label = " ";
		
		var one = new Object();
		one.nglue = glue1;
		one.eglue = null;
		one.sglue = null;
		one.wglue = null;
		one.label = "1";
		
		var zero = new Object();
		zero.nglue = glue0;
		zero.eglue = null;
		zero.sglue = null;
		zero.wglue = null;
		zero.label = "0";
		
		var F1 = new Object();
		F1.nglue = null;
		F1.eglue = null;
		F1.sglue = null;
		F1.wglue = glueF1;
		F1.label = " ";
		
		var NC = new Object();
		NC.nglue = null;
		NC.eglue = null;
		NC.sglue = null;
		NC.wglue= glueNc;
		NC.label = " ";
		
		var Nc1 = new Object();
		Nc1.nglue = glueNc;
		Nc1.eglue = null;
		Nc1.sglue = null;
		Nc1.wglue = null;
		Nc1.label = " ";
		
		var sectionCounter = 0;
		var intCounter = 1;
		var y = 2;
		//Insert seed tiles
		universe.insert(1, 1, z);
		//Create the blank top row
		while(intCounter <= 2 * numSections){
			universe.insert(intCounter, y, blank);
			intCounter++;
		}
		intCounter = 1;
		
		for(var i=0; i<numSections; i++)
		{
			universe.insert((2 * numSections) + 1, y, blank);
			universe.insert((2 * numSections) + 1, ++y, blank);
			universe.insert((2 * numSections) + 1, ++y, F1);
			universe.insert((2 * numSections) + 1, ++y, NC);
			while(intCounter <= 2 * numSections){
				if(intCounter % 2 != 0){
					if($scope.numberA[0] == "1"){
						universe.insert(intCounter, y+1, one); 
						console.log($scope.numberA[0]);
						$scope.numberA = $scope.numberA.substr(1);
						console.log($scope.numberA);
					} else {
						universe.insert(intCounter, y+1, zero);
						$scope.numberA = $scope.numberA.substr(1);
					}
				} else {
					if($scope.numberB[0] == "1"){
						universe.insert(intCounter, y+1, one);
						$scope.numberB = $scope.numberB.substr(1);
					} else {
						universe.insert(intCounter, y+1, zero);
						$scope.numberB = $scope.numberB.substr(1);
					}
				}
				intCounter++;
			}
			intCounter = 1;
			y++;
		}
		universe.insert(0, y, Nc1);
		universe.insert((2 * numSections) + 1, y, blank);
		console.log(universe);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 1;
		nglue.label = "B";
		eglue.strength = 1;
		eglue.label = "NC";
		sglue.strength = 1;
		sglue.label = "0";
		wglue.strength = 1;
		wglue.label = "0";
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 1;
		nglue.label = "B";
		eglue.strength = 1;
		eglue.label = "NC";
		sglue.strength = 1;
		sglue.label = "1";
		wglue.strength = 1;
		wglue.label = "1";
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
	
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 1;
		nglue.label = "B";
		eglue.strength = 1;
		eglue.label = "C";
		sglue.strength = 1;
		sglue.label = "0";
		wglue.strength = 1;
		wglue.label = "1";
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);	
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 1;
		nglue.label = "B";
		eglue.strength = 1;
		eglue.label = "C";
		sglue.strength = 1;
		sglue.label = "1";
		wglue.strength = 1;
		wglue.label = "10";
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
				var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 1;
		nglue.label = "0";
		eglue.strength = 1;
		eglue.label = "0";
		sglue.strength = 1;
		sglue.label = "0";
		wglue.strength = 1;
		wglue.label = "NC";
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
				var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 1;
		nglue.label = "1";
		eglue.strength = 1;
		eglue.label = "0";
		sglue.strength = 1;
		sglue.label = "1";
		wglue.strength = 1;
		wglue.label = "NC";
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
				var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 1;
		nglue.label = "1";
		eglue.strength = 1;
		eglue.label = "1";
		sglue.strength = 1;
		sglue.label = "0";
		wglue.strength = 1;
		wglue.label = "NC";
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
				var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 1;
		nglue.label = "0";
		eglue.strength = 1;
		eglue.label = "1";
		sglue.strength = 1;
		sglue.label = "1";
		wglue.strength = 1;
		wglue.label = "C";
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 1;
		nglue.label = "1";
		eglue.strength = 1;
		eglue.label = "10";
		sglue.strength = 1;
		sglue.label = "1";
		wglue.strength = 1;
		wglue.label = "C";
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
				var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 1;
		nglue.label = "0";
		eglue.strength = 1;
		eglue.label = "10";
		sglue.strength = 1;
		sglue.label = "0";
		wglue.strength = 1;
		wglue.label = "C";
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 0;
		nglue.label = null;
		eglue.strength = 1;
		eglue.label = "C";
		sglue.strength = 1;
		sglue.label = "0_1";
		wglue.strength = 1;
		wglue.label = "C";
		tileSet.newTile("1", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 0;
		nglue.label = null;
		eglue.strength = 1;
		eglue.label = "C";
		sglue.strength = 1;
		sglue.label = "1_0";
		wglue.strength = 1;
		wglue.label = "C";
		tileSet.newTile("0", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 0;
		nglue.label = null;
		eglue.strength = 1;
		eglue.label = "C";
		sglue.strength = 1;
		sglue.label = "0_0";
		wglue.strength = 1;
		wglue.label = "C";
		tileSet.newTile("0", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 0;
		nglue.label = null;
		eglue.strength = 1;
		eglue.label = "C";
		sglue.strength = 1;
		sglue.label = "1_1";
		wglue.strength = 1;
		wglue.label = "C";
		tileSet.newTile("1", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 0;
		nglue.label = null;
		eglue.strength = 1;
		eglue.label = "C";
		sglue.strength = 1;
		sglue.label = "B";
		wglue.strength = 1;
		wglue.label = "C";
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 0;
		nglue.label = null;
		eglue.strength = 1;
		eglue.label = "NC";
		sglue.strength = 1;
		sglue.label = "0_1";
		wglue.strength = 1;
		wglue.label = "NC";
		tileSet.newTile("0", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 0;
		nglue.label = null;
		eglue.strength = 1;
		eglue.label = "NC";
		sglue.strength = 1;
		sglue.label = "1_0";
		wglue.strength = 1;
		wglue.label = "NC";
		tileSet.newTile("1", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 0;
		nglue.label = null;
		eglue.strength = 1;
		eglue.label = "NC";
		sglue.strength = 1;
		sglue.label = "0_0";
		wglue.strength = 1;
		wglue.label = "NC";
		tileSet.newTile("0", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 0;
		nglue.label = null;
		eglue.strength = 1;
		eglue.label = "NC";
		sglue.strength = 1;
		sglue.label = "1_1";
		wglue.strength = 1;
		wglue.label = "NC";
		tileSet.newTile("1", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 0;
		nglue.label = null;
		eglue.strength = 1;
		eglue.label = "NC";
		sglue.strength = 1;
		sglue.label = "B";
		wglue.strength = 1;
		wglue.label = "NC";
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 0;
		nglue.label = null;
		eglue.strength = 1;
		eglue.label = "Z";
		sglue.strength = 1;
		sglue.label = "C";
		wglue.strength = 0;
		wglue.label = null;
		tileSet.newTile("1", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 0;
		nglue.label = null;
		eglue.strength = 1;
		eglue.label = "Z";
		sglue.strength = 1;
		sglue.label = "NC";
		wglue.strength = 0;
		wglue.label = null;
		tileSet.newTile("0", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 1;
		nglue.label = "NC_C1";
		eglue.strength = 1;
		eglue.label = "C";
		sglue.strength = 1;
		sglue.label = "NC";
		wglue.strength = 0;
		wglue.label = null;
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 1;
		nglue.label = "NC_NC1";
		eglue.strength = 1;
		eglue.label = "NC";
		sglue.strength = 1;
		sglue.label = "NC";
		wglue.strength = 0;
		wglue.label = null;
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 1;
		nglue.label = "C_C1";
		eglue.strength = 1;
		eglue.label = "C";
		sglue.strength = 1;
		sglue.label = "C";
		wglue.strength = 0;
		wglue.label = null;
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 1;
		nglue.label = "C_NC1";
		eglue.strength = 1;
		eglue.label = "NC";
		sglue.strength = 1;
		sglue.label = "C";
		wglue.strength = 0;
		wglue.label = null;
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 2;
		nglue.label = "NC_C";
		eglue.strength = 1;
		eglue.label = "F1";
		sglue.strength = 1;
		sglue.label = "NC_C1";
		wglue.strength = 0;
		wglue.label = null;
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 2;
		nglue.label = "NC_NC";
		eglue.strength = 1;
		eglue.label = "F1";
		sglue.strength = 1;
		sglue.label = "NC_NC1";
		wglue.strength = 0;
		wglue.label = null;
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 2;
		nglue.label = "C_C";
		eglue.strength = 1;
		eglue.label = "F1";
		sglue.strength = 1;
		sglue.label = "C_C1";
		wglue.strength = 0;
		wglue.label = null;
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 2;
		nglue.label = "C_C";
		eglue.strength = 1;
		eglue.label = "F1";
		sglue.strength = 1;
		sglue.label = "C_NC1";
		wglue.strength = 0;
		wglue.label = null;
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 2;
		nglue.label = "NC_C";
		eglue.strength = 1;
		eglue.label = "F";
		sglue.strength = 1;
		sglue.label = "NC_C1";
		wglue.strength = 0;
		wglue.label = null;
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 2;
		nglue.label = "NC_NC";
		eglue.strength = 1;
		eglue.label = "F";
		sglue.strength = 1;
		sglue.label = "NC_NC1";
		wglue.strength = 0;
		wglue.label = null;
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 2;
		nglue.label = "C_C";
		eglue.strength = 1;
		eglue.label = "F";
		sglue.strength = 1;
		sglue.label = "C_C1";
		wglue.strength = 0;
		wglue.label = null;
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 2;
		nglue.label = "C_NC";
		eglue.strength = 1;
		eglue.label = "F";
		sglue.strength = 1;
		sglue.label = "C_NC";
		wglue.strength = 0;
		wglue.label = null;
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 2;
		nglue.label = "2C";
		eglue.strength = 1;
		eglue.label = "NC";
		sglue.strength = 2;
		sglue.label = "NC_C";
		wglue.strength = 0;
		wglue.label = null;
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 2;
		nglue.label = "2NC";
		eglue.strength = 1;
		eglue.label = "NC";
		sglue.strength = 2;
		sglue.label = "NC_NC";
		wglue.strength = 0;
		wglue.label = null;
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 2;
		nglue.label = "2C";
		eglue.strength = 1;
		eglue.label = "C";
		sglue.strength = 2;
		sglue.label = "C_C";
		wglue.strength = 0;
		wglue.label = null;
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 2;
		nglue.label = "2NC";
		eglue.strength = 1;
		eglue.label = "C";
		sglue.strength = 2;
		sglue.label = "C_NC";
		wglue.strength = 0;
		wglue.label = null;
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 1;
		nglue.label = "C";
		eglue.strength = 0;
		eglue.label = null;
		sglue.strength = 2;
		sglue.label = "2C";
		wglue.strength = 0;
		wglue.label = null;
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 1;
		nglue.label = "NC";
		eglue.strength = 0;
		eglue.label = null;
		sglue.strength = 2;
		sglue.label = "2NC";
		wglue.strength = 0;
		wglue.label = null;
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 1;
		nglue.label = "1_0";
		eglue.strength = 1;
		eglue.label = "F1";
		sglue.strength = 1;
		sglue.label = "1";
		wglue.strength = 1;
		wglue.label = "F";
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 1;
		nglue.label = "0_1";
		eglue.strength = 1;
		eglue.label = "F1";
		sglue.strength = 1;
		sglue.label = "0";
		wglue.strength = 1;
		wglue.label = "F";
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 1;
		nglue.label = "B";
		eglue.strength = 1;
		eglue.label = "F1";
		sglue.strength = 1;
		sglue.label = "B";
		wglue.strength = 1;
		wglue.label = "F";
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 1;
		nglue.label = "1_1";
		eglue.strength = 1;
		eglue.label = "F";
		sglue.strength = 1;
		sglue.label = "1";
		wglue.strength = 1;
		wglue.label = "F";
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 1;
		nglue.label = "0_0";
		eglue.strength = 1;
		eglue.label = "F";
		sglue.strength = 1;
		sglue.label = "0";
		wglue.strength = 1;
		wglue.label = "F";
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		var tile = new Object();
		var nglue = new Object();
		var eglue = new Object();
		var sglue = new Object();
		var wglue = new Object();
		nglue.strength = 1;
		nglue.label = "B";
		eglue.strength = 1;
		eglue.label = "F";
		sglue.strength = 1;
		sglue.label = "B";
		wglue.strength = 1;
		wglue.label = "F";
		tileSet.newTile(" ", nglue, eglue, sglue, wglue);
		
		universe.assemble();
		console.log(universe.sticky);
		delayDraw = function(){
			$timeout(function(){
				var tile = universe.sticky.shift();
				if(tile !== undefined){
					graphics.drawTile(tile.x, tile.y, tile.label);
					delayDraw();
				}
			}, 50);
		};
		delayDraw();
		
	};
	
	$scope.readDataSet = function(){
		$http({method: 'GET', url: 'js/tileset.json'}).success(function(data, status, headers, config) {
			console.log(data);
			var list = data;

			for(var i=0; i<list.Tiles.length; i++)
			{
			console.log("loop");
				var tile = new Object();
				var nglue = new Object();
				var eglue = new Object();
				var sglue = new Object();
				var wglue = new Object();
				
				nglue.strength = list.Tiles[i].Nstrength;
				nglue.label = "B";
				
				eglue.strength = list.Tiles[i].Estrength;
				eglue.label = "NC";
				
				sglue.strength = list.Tiles[i].Sstrength;
				sglue.label = "0";
				
				wglue.strength = list.Tiles[i].Wstrength;
				wglue.label = "0";
				
				tile.nglue = nglue;
				tile.eglue = eglue;
				tile.sglue = sglue;
				tile.wglue = wglue;
				console.log(tile);
				tileSet.insert(tile);
				
				//Add the tile to the tile set
				tileSet.newTile(list.Tiles[i].tileName, nglue, eglue, sglue, wglue);
			}
			console.log("HELLO");
			console.log(tileSet);
		});
	};
	$scope.readDataSet();
	$scope.fastAdder();
	
	$scope.createConstruct = function(){
		//Test tile
		//var l=new Object();
		//var r=new Object();
		/*
		var glue1 = new Object();
		var glue2 = new Object();
		var glue3 = new Object();
		var glue4 = new Object();
		var glue5 = new Object();
		var glue6 = new Object();
		var glue7 = new Object();
		var glue8 = new Object();
		
		glue1.label = "1";
		glue2.label = "2";
		glue3.label = "3";
		glue4.label = "4";
		glue5.label = "5";
		glue6.label = "6";
		glue7.label = "7";
		glue8.label = "8";
		glue1.strength = 2;
		glue2.strength = 2;
		glue3.strength = 2;
		glue4.strength = 2;
		glue5.strength = 2;
		glue6.strength = 2;
		glue7.strength = 1;
		glue8.strength = 1;

		var glue1 = new Object();
		gluen.label = "1";
		gluen.strength = 1;
		
		var glue0 = new Object();
		glue0.label = "0";
		glue0.strength = 1;
		
		var gluec = new Object();
		gluec.label = "c";
		gluec.strength = 1;
		
		var glue1 = new Object();
		glue1.label = "1";
		glue1.strength = 1;
		
		l.nglue = glue0;
		l.eglue = null;
		l.sglue = null;
		l.wglue = null;
		l.label = "L";
		
		r.nglue = null;
		r.eglue = gluec;
		r.sglue = null;
		r.wglue = null;
		r.label = "R";
		
		universe.insert(1, 1, r);
		universe.insert(1, 2, r);
		universe.insert(1, 3, r);
		universe.insert(1, 4, r);
		universe.insert(1, 5, r);
		universe.insert(1, 6, r);
		universe.insert(1, 7, r);
		universe.insert(1, 8, r);
		universe.insert(1, 9, r);
		universe.insert(1, 10, r);
		universe.insert(2, 11, l);
		universe.insert(3, 11, l);
		universe.insert(4, 11, l);
		universe.insert(5, 11, l);
		universe.insert(6, 11, l);
		universe.insert(7, 11, l);
		universe.insert(8, 11, l);
		universe.insert(9, 11, l);
		universe.insert(10, 11, l);
		
		tileSet.newTile("1", glue1, gluen, glue1, gluen);
		tileSet.newTile("0", glue0, gluen, glue0, gluen);
		tileSet.newTile("l", glue1, gluen, glue0, gluec);
		tileSet.newTile("0", glue0, gluec, glue1, gluec);
		
		//Add tiles to tileset

		tileSet.newTile("new1", glue7, glue3, null, glue2 );
		tileSet.newTile("new2", glue7, null, null, glue3 );
		tileSet.newTile("new3", glue5, glue8, glue1, null );
		tileSet.newTile("new4", null, glue8, glue5, null );
		tileSet.newTile("new5", glue7, glue8, glue7, glue8 );
		
		tileSet.newTile("B", glue7, glue3, null, glue1 );
		tileSet.newTile("C", glue4, glue8, glue2, null );
		tileSet.newTile("D", glue7, glue5, null, glue3 );
		tileSet.newTile("E", glue6, glue8, glue4, null );
		tileSet.newTile("F", glue7, null, null, glue5 );
		tileSet.newTile("G", null, glue8, glue6, null );
		tileSet.newTile("H", glue7, glue8, glue7, glue8 );
		*/
		universe.assemble();

		delayDraw = function(){
			$timeout(function(){
				var tile = universe.sticky.shift();
				if(tile !== undefined){
					graphics.drawTile(tile.x, tile.y, tile.label);
					delayDraw();
				}
			}, 50);
		};
		delayDraw();
		
		console.log(universe.sticky);
		console.log("testing");
			
	};
	//$scope.createConstruct();
}]);


atam.factory('graphics', ['tileSet', '$timeout', function(tileSet, $timeout) {
		

	var graphics = new Object();
	canvas = document.getElementById("theUniverse");
	context = canvas.getContext("2d");

	scale = 40;
	offset = 200;

	graphics.drawTile = function(x, y, state) {
		context.rect(offset + (x*scale) + 1, offset + (y*scale) + 1, scale, scale);
		context.lineWidth = 1;
		context.strokeStyle = createRandomColor();
		context.stroke();
		context.font = "25px Garmond";
		context.fillText(state, offset + (x*scale) + 12, offset + (y*scale) + 29);
	}
	
	function createRandomColor() {
		var letters = '0123456789ABCDEF'.split('');
		var color = '#';
		for (var i = 0; i < 6; i++ ) {
			color += letters[Math.round(Math.random() * 15)];
		}
		return color;
	}
	return graphics;
}]);