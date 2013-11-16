//Tile


function getResults()
{
	$.ajax({crossDomain:true, url:"tileset.json"}).done(function(data)
	{
		var list = $.parseJSON(data);
		console.log(list);
	});
};

/*
function glue( label, strength ) {
	this.Label = label;
	this.Strength = strength;
}

function tile( nglue, sglue, eglue, wglue ){
	this.Nglue = nglue;
	this.Sglue = sglue;
	this.Eglue = eglue;
	this.Wglue = wglue;
}
*/
/*
var Tile=new Object();
Tile.Nglue= Nglue();
Tile.Eglue= Eglue();
Tile.Sglue= Sglue();
Tile.Wglue= Wglue();

var Nglue= new Object();
Nglue.Label= ; 					//Nglue label input
Nglue.Strength= ;				//Nglue strength input

var Eglue= new Object();
Eglue.Label= ; 					//Eglue label input
Eglue.Strength= ;				//Eglue strength input

var Sglue= new Object();
Sglue.Label= ; 					//Sglue label input
Sglue.Strength= ;				//Sglue strength input

var Wglue= new Object();
Wglue.Label= ; 					//Wglue label input
Wglue.Strength= ;				//Wglue strength input
*/