
//$(document).ready(function(){
	//$(".error").hide();
//})

var drawingCanvas = document.getElementById('Box');
if(drawingCanvas.getContext) 
{
var context = drawingCanvas.getContext('2d');
moveTo(0,0);
}

$("#input1").blur(function(){

	var input1 = $("#input1").val();
	console.log(input1);
	for( i in input1)
	{

		if(input1[i]!=0 && input1[i]!=1)
		{
			$(".error").html('<p class="errors"> You Entered A NON-binary number</p>');
			$(".errors").show();
		}

	}
})

$("#input2").blur(function(){

	var input2 = $("#input2").val();
	console.log(input2);
	for( i in input2)
	{
		if(input2[i]!=0 && input2[i]!=1)
		{
			$(".error").html('<p class="errors"> You Entered A NON-binary number</p>');
			$(".errors").show();
		}

	}
})

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