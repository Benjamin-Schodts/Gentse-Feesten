$(document).ready(function () {

	var events = [];
	var categories = [];
	var weekday = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

	function loadJson() {
		$.getJSON('json/gentsefeestenevents.json', function (data) {
	    	$.each(data, function(key,val){

	    		// Fill category variable if a category is provided
	    		var category = "";
	    		if (val.categorie_naam != false) {
	    			category = val.categorie_naam;
	    		}

	    		// Combine all events that are types of Concerts
		   		if (category.indexOf("Concerten") > -1) {
					category = "Concerten";
				}

				// Fill categories array with distinct category names
			   	if (categories.indexOf(category) == -1 && val.categorie_naam != false) {
			   		categories.push(category);
			   	}

			   	// Fill events array with event objects
			   	if(val.startuur != false) { // Only add events that have a start date
	 		   		var titleIndex = indexLookup(events, val.titel); // Check if event with a certain name already exists and return the index
			   		if(events.length > 0 && titleIndex > -1) { // Only enter this part if the event already exists
				   		if(events[titleIndex][2].indexOf(val.datum) != -1) { // Check if the given date for this event is already set
				   			if(events[titleIndex][3][events[titleIndex][3].length-1] instanceof Array) { // Check if there is a timetable present
				   				if(events[titleIndex][3][events[titleIndex][2].indexOf(val.datum)].indexOf(val.startuur) == -1) { // Check if starting hour is already present or not 
				   					events[titleIndex][3][events[titleIndex][2].indexOf(val.datum)].push(val.startuur); // Set a new starting hour for the event on a certain date
				   				}
							}
				   		} else {
				   			events[titleIndex][2].push(val.datum); // Push a new date into the event
				   			events[titleIndex][3].push(val.startuur); // Push a new starting hour for the new date into the event
				   		}
				   	} else {
				   		// Check if event is free
				   		var prijs = "";	
				   		if (val.prijs != false) { 
				   			prijs = val.prijs;
				   		} else {
				   			prijs = "Gratis";
				   		}
				   		events.push([category, val.titel, new Array(), new Array(), prijs, val.toegankelijk_rolstoel, val.locatie, val.latitude, val.longitude, val.id]); // Create new event
				   		events[events.length-1][2].push(val.datum); // Push a new date into the event
				   		events[events.length-1][3].push(new Array()); // Create a timetable
				   		events[events.length-1][3][events[events.length-1][3].length-1].push(val.startuur); // push new starting hour into the timetable 
				   	}
				} 
			});	
			
			events.sort(function(a, b){return a[1].localeCompare(b[1])}); // Sort events by title

			fill_category_list();
		
			loaded(); // JSON processing complete
		});
	}

	function indexLookup(genericList, item) {
		// Check the "genericList" for occurances of "item"
		for (i = 0; i < genericList.length; i++) {
			if (genericList[i][1] == item) {
				return i;
			}
		}
		return -1;
	}

	function fill_category_list() {
		// Make new items for each category in the categories array
		for (i = 0; i < categories.length; i++) { 
			$(".categories").append("<li class='category-entry'><a href='#'>" + categories[i] + "</a></li>");
		}
	}

	function loaded(){
		$(".overlay").addClass("overlay-loaded"); // Fade-out into website homepage
	}

	function getQueryVariable(variable){
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
	}	

	function getEvent() {
		$.getJSON('json/gentsefeestenevents.json', function (data) {
	    	$.each(data, function(key,val){

	    		if(val.id = getQueryVariable("id")) {
	    			alert(JSON.stringify(val));
	    			return false;
	    		}
	    	});	
	    	return false;
	    });	
	}

	$('.categories').on('click','.category-entry a',function() {
		$("#events").text("");
		$(".categories").addClass("overlay-categories");
		var category = $(this).text();
		setTimeout(function(){
			
		
			for (i = 0; i < events.length; i++) { 
				if(events[i][0] == category) {
					$('.category-container').append('<p>' + events[i][9] + '</p>');
					
					var str = "<tr><td>" + events[i][1] + "</td>"
					var str = "<tr><td>" + events[i][0] + "</td><td>" + events[i][1] + "</td><td><table class='table'>";
					for (j = 0; j < events[i][2].length; j++) { 
						var start = new Date(events[i][2][j] * 1000);
						str += "<tr><th>" + weekday[start.getDay()] + " (" + start.getDate() + ")</th></th><td>" + events[i][3][j] + "</td>";
					}
					str += "</table></td><td>" + events[i][4] + "</td>";
					if(events[i][5] == 1) {
						str += "<td><i class='fa fa-wheelchair'></i></td>";
					} else {
						str += "<td></td>";
					}
					str += "<td><a href='https://www.google.com/maps/place/" + events[i][7] + "+" + events[i][8] + "/@" + events[i][7] + "," + events[i][8] + ",15z' target='_blank'>" + events[i][6] + "</a></td></tr>";
					$("#events").append(str);
					

				}
			}
			$(".categories").css("display", "none");	 
			//$("#eventtab").text("Events (" + list.length + ")");
		}, 1000);
	});

	loadJson();
	getEvent();

});