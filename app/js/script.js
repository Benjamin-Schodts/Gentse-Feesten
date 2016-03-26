$(document).ready(function () {
	var myJson;
	var list = [];

	$("#button1").click(function () {
	    $.getJSON('js/gentsefeestenevents.json',


	    function (data) {
	    	myJson = data;
	    	$.each(myJson, function(key,val){
	    		if(list.indexOf(val.activiteit_id) == -1){
	    			list.push(val.activiteit_id);
	    			var date = new Date((val.datum * 1000 + 7200000));
	    			$("#movielist").append("<p>" + (val.datum * 1000 + 7200000) + " -- " + date.getUTCDate()+ "<br/></p>");
	    		}
	    		/*
			   	if(val.id == "12433" || val.id == "12434"){
			   		$("#movielist").append("<p>" + JSON.stringify(val, null, "<br/>") + "</p>");
			   	}
			   	*/
			});
			alert(list.length);
	    });
	});
	$("#button2").click(function () {
	    $.getJSON('js/gentsefeestenevents.json',


	    function (data) {
	    	myJson = data;
	    	$.each(myJson, function(key,val){
			   	if(val.id == "12433"){
			   		$("#movielist").append("<p>" + JSON.stringify(val, null, "<br/>") + "</p>");
		
			   	}
			   	
			});
	    });
	});
});

