$(document).ready(function () {
	var myJson;
	var list = [];

	$.getJSON('json/gentsefeestenevents.json', function (data) {
    	myJson = data;
    	$.each(myJson, function(key,val){
		   	if(val.id == "12433"){
		   		var str = [];
		   		str = val.categorie_naam.split(">");
		   		if(str.length > 1) {
		   			$(".c-category-text").text(str[0]);
		   			$('.c-category').append('<p class="sub-category">' + str[1] + '</p>');
		   		} else {
		   			$(".c-category-text").text(str[0]);
		   			$('.sub-category').text('');
		   		}
				$(".c-title-text").text(val.titel.substring(0, 60));
		   	}
		   	
		});
	});

	$('.c-right').click(
	  function() {
	    $.getJSON('json/gentsefeestenevents.json', function (data) {
	    	myJson = data;
	    	$.each(myJson, function(key,val){
			   	if(val.id == "12500"){
			   		var str = [];
			   		str = val.categorie_naam.split(">");
			   		if(str.length > 1) {
			   			$(".c-category-text").text(str[0]);
			   			$('.c-category').append('<p class="sub-category">' + str[1] + '</p>');
			   		} else {
			   			$(".c-category-text").text(str[0]);
			   			$('.sub-category').text('');
			   		}
					$(".c-title-text").text(val.titel.substring(0, 60));
			   	}
			   	
			});
		});
	  }
	)

	$('.c-left').click(
	  function() {
	    $.getJSON('json/gentsefeestenevents.json', function (data) {
	    	myJson = data;
	    	$.each(myJson, function(key,val){
			   	if(val.id == "12433"){
			   		var str = [];
			   		str = val.categorie_naam.split(">");
			   		if(str.length > 1) {
			   			$(".c-category-text").text(str[0]);
			   			$('.c-category').append('<p class="sub-category">' + str[1] + '</p>');
			   		} else {
			   			$(".c-category-text").text(str[0]);
			   			$('.sub-category').text('');
			   		}
					$(".c-title-text").text(val.titel.substring(0, 60));
			   	}
			   	
			});
		});
	  }
	)

	

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

