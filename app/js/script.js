$(document).ready(function () {
	var myJson;
	var list = [];

	$.getJSON('json/gentsefeestenevents.json',
	    function (data) {
	    	myJson = data;
	    	$.each(myJson, function(key,val){
			   	if(val.id == "12433"){
			   		$(".c-category-text").text(val.categorie_naam);
					$(".c-title-text").text(val.titel);
			   	}
			   	
			});
	    });
	

	$("#button1").click(function () {
	    $.getJSON('json/gentsefeestenevents.json',


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
	    $.getJSON('json/gentsefeestenevents.json',


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

