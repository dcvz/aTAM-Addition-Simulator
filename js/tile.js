
$(document).ready(function(){
	$(".error").hide();
})

// var drawingCanvas = document.getElementById('Box');
// if(drawingCanvas.getContext) 
// {
// var context = drawingCanvas.getContext('2d');
// moveTo(0,0);
// }

/*
$("#input1").click(function(){
	$("#error").hide();
})

$("#input2").click(function(){
	$("#error").hide();
})
*/

$("#input1").blur(function(){
	checkInput();
	// var input1 = $("#input1").val();
	// console.log(input1);
	// for( i in input1)
	// {

	// 	if(input1[i]!=0 && input1[i]!=1)
	// 	{
	// 		$(".error").html('<p class="errors" id="errors"> You Entered A NON-binary number</p>');
	// 	}

	// }
})

$("#input2").blur(function() {
	checkInput();
	// var input2 = $("#input2").val();
	// console.log(input2);
	// for( i in input2)
	// {
	// 	if(input2[i]!=0 && input2[i]!=1)
	// 	{
	// 		$(".error").html('<p class="errors" id="errors"> You Entered A NON-binary number</p>');
	// 	}

	// }
})

function checkInput() {
	var err=false;
	var input1=$("#input1").val();
	var input2=$("#input2").val();

	for( i in input1) {
		if(input1[i]!=0 && input1[i]!=1) {
			err=true;
			break;
			//$(".error").html('<p class="errors" id="errors"> You Entered A NON-binary number</p>');
		}
	}

	for( j in input2) {
		if(input2[j]!=0 && input2[j]!=1) {
			err=true;
			break;
			//$(".error").html('<p class="error" id="errors"> You Entered A NON-binary number</p>');
		}
	}

	console.log("input1: " + input1 + " input2: " + input2 + err);

	if(err) {
		//$(".error").html('You Entered A NON-binary number');
		$(".error").show();
	}
	else {
		$(".error").hide();
	}
}

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