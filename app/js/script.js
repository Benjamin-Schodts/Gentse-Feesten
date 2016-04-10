$(document).ready(function () {
	var myJson;
	var list = [];
	var categories = [];

	var weekday=new Array(7);
	weekday[0]="Monday";
	weekday[1]="Tuesday";
	weekday[2]="Wednesday";
	weekday[3]="Thursday";
	weekday[4]="Friday";
	weekday[5]="Saturday";
	weekday[6]="Sunday";


	$('.categories').on('click','.category-entry a',function() {
		$("#events").text("");
		$(".categories").addClass("overlay-categories");
		var category = $(this).text();
		setTimeout(function(){
			
		
			for (i = 0; i < list.length; i++) { 
				if(list[i][0] == category) {
					$('.category-container').append('<p>' + list[i][1] + '</p>');
					
					var str = "<tr><td>" + list[i][1] + "</td>"
					var str = "<tr><td>" + list[i][0] + "</td><td>" + list[i][1] + "</td><td><table class='table'>";
					for (j = 0; j < list[i][2].length; j++) { 
						var start = new Date(list[i][2][j] * 1000);
						str += "<tr><th>" + weekday[start.getDay()] + " (" + start.getDate() + ")</th></th><td>" + list[i][3][j] + "</td>";
					}
					str += "</table></td><td>" + list[i][4] + "</td>";
					if(list[i][5] == 1) {
						str += "<td><i class='fa fa-wheelchair'></i></td>";
					} else {
						str += "<td></td>";
					}
					str += "<td><a href='https://www.google.com/maps/place/" + list[i][7] + "+" + list[i][8] + "/@" + list[i][7] + "," + list[i][8] + ",15z' target='_blank'>" + list[i][6] + "</a></td></tr>";
					$("#events").append(str);
					

				}
			}
			$(".categories").css("display", "none");	 
			//$("#eventtab").text("Events (" + list.length + ")");
		}, 1000);
	});

	function indexLookup(listt, name) {
		for (i = 0; i < listt.length; i++) {
			if (listt[i][1] == name) {
				return i;
			}
		}

		return -1;
	}

	function loaded(){
		$(".overlay").addClass("overlay-loaded");
	}

	$.getJSON('json/gentsefeestenevents.json', function (data) {
    	myJson = data;
    	$.each(myJson, function(key,val){

    		var category = "";
    		if (val.categorie_naam != false) {
    			category = val.categorie_naam;
    		}

	   		if (category.indexOf("Concerten") > -1) {
				category = "Concerten";
			}

		   	if (categories.indexOf(category) == -1 && val.categorie_naam != false) {
		   		categories.push(category);
		   	}

		   	if(val.startuur != false) {
 		   		var titleIndex = indexLookup(list, val.titel);
		   		if(list.length > 0 && titleIndex > -1) {
			   		if(list[titleIndex][2].indexOf(val.datum) != -1) {
			   			if(list[titleIndex][3][list[titleIndex][3].length-1] instanceof Array) {
			   				if(list[titleIndex][3][list[titleIndex][2].indexOf(val.datum)].indexOf(val.startuur) == -1) {
			   					list[titleIndex][3][list[titleIndex][2].indexOf(val.datum)].push(val.startuur);
			   				}
						}
			   		} else {
			   			list[titleIndex][2].push(val.datum);
			   			list[titleIndex][3].push(val.startuur);
			   		}
			   	} else {
			   		var prijs = "";
			   		if (val.prijs != false) {
			   			prijs = val.prijs;
			   		} else {
			   			prijs = "Gratis";
			   		}
			   		list.push([category, val.titel, new Array(), new Array(), prijs, val.toegankelijk_rolstoel, val.locatie, val.latitude, val.longitude]);
			   		list[list.length-1][2].push(val.datum);
			   		list[list.length-1][3].push(new Array());
			   		list[list.length-1][3][list[list.length-1][3].length-1].push(val.startuur);
			   	}
			} 
		});	

		for (i = 0; i < categories.length; i++) { 
			$(".categories").append("<li class='category-entry'><a href='#'>" + categories[i] + "</a></li>");
		}

		// sort rolstoel 
		//list.sort(function(a, b){return b[5]-a[5]});

		// sort title 
		list.sort(function(a, b){return a[1].localeCompare(b[1])});
		loaded();
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

