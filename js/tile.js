
function getResults()
{
	$.ajax({url:"tileset.json",success:function(result){
    console.log(result);
    var list = result;

    for(i in list.Tiles)
    {
    	console.log(list.Tiles[i].tileName);
    }
    
  }});
}