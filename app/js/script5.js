$(document).ready(function () {

	var jsonfile = 'json/gentsefeestenevents.json';
	var events = [];
	var categories = [];
	var chosen = [];
	var chosenDays = [];
	var favourited = [];
	var weekday = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];
	var month = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"];
	var days = {"17": "Zaterdag",  "18" : "Zondag", "19" : "Maandag", "20" : "Dinsdag", "21" : "Woensdag", "22" : "Donderdag", "23" : "Vrijdag", "24" : "Zaterdag", "25" : "Zondag", "26" : "Maandag", "27" : "Dinsdag"};

	$("#menu").load('includes/menu.html');
	$("#about").load('includes/gentseFeesten.txt');

	getLocalStorage();

	// Load JSON into array
	function loadJsonFull() {
		var list = [];
		$.getJSON(jsonfile, function (data) {
	    	$.each(data, function(key,val){
	    		list.push(val);
	    	});	
	    	list.sort(function(a,b) { return a.datum - b.datum});
	    	createEventList(list);
		});
	}

	// Load the jsonfile
	function createEventList(list) {
    	$.each(list, function(key,val){

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
			   			events[titleIndex][9].push(val.id); // Push a new id for the new date into the event
			   		}
			   	} else {
			   		// Check if event is free
			   		var prijs = "";	
			   		if (val.prijs != false) { 
			   			prijs = val.prijs;
			   		} else {
			   			prijs = "Gratis";
			   		}
			   		events.push([category, val.titel, new Array(), new Array(), prijs, val.toegankelijk_rolstoel, val.locatie, val.latitude, val.longitude, new Array(), val.prijs_vvk, val.omschrijving, val.prijs_omschrijving]); // Create new event
			   		events[events.length-1][2].push(val.datum); // Push a new date into the event
			   		events[events.length-1][3].push(new Array()); // Create a timetable
			   		events[events.length-1][3][events[events.length-1][3].length-1].push(val.startuur); // push new starting hour into the timetable 
			   		events[events.length-1][9].push(val.id); // Push a new ID corresponding to the date
			   	}
			} 
		});	
		fill_category_list();
		fill_days_list();
		getEvent();
	}

	// Check the "genericList" for occurances of "item"
	function indexLookup(genericList, item) {
		for (i = 0; i < genericList.length; i++) {
			if (genericList[i][1] == item) {
				return i;
			}
		}
		return -1;
	}

	// Make new items for each category in the categories array
	function fill_category_list() {
		for (i = 0; i < categories.length; i++) { 
			$("#category-select").append("<option value='" + categories[i] + "''>" + categories[i] + "</option>");
		}
	}

	function fill_days_list() {
		for(var day in days) {
			$("#day-select").append("<option value='" + day + "''>" + days[day] + " " + day + "</option>");
		}
	}

	// Get event with ID provided by URL
	function getEvent() {
		$("#event-list").html("");
		var i = 0;
    	$.each(events, function(key,val){
    		if(chosen.length == 0 && chosenDays.length == 0) {
	    		$("#exposed_filter").removeClass("col-md-2");
	    		$("#exposed_filter").addClass("col-md-12");
    		} else if (chosen.length != 0 && chosenDays != 0) {
    			if(chosen.indexOf(val[0]) != -1) {
    				$("#exposed_filter").removeClass("col-md-12");
	    			$("#exposed_filter").addClass("col-md-2");
    				var found = false;
    				for (var x = 0; x < val[2].length && !found; x++) {
    					var dat = new Date(val[2][x] * 1000);
		    			if (chosenDays.indexOf(dat.getDate().toString()) != -1) {
		    				if(i % 2) {
			    				processEventInformation(val, "even");
			    			} else {
			    				processEventInformation(val, "uneven");
			    			}
			    			i++;
			    			found = true;
	    				}
    				}
	    		} 
    		} else if (chosen.length != 0) {
	    		if (chosen.indexOf(val[0]) != -1) {
	    			$("#exposed_filter").removeClass("col-md-12");
	    			$("#exposed_filter").addClass("col-md-2");
    				if(i % 2) {
	    				processEventInformation(val, "even");
	    			} else {
	    				processEventInformation(val, "uneven");
	    			}
	    			i++;
	    		} 
    		} else if (chosenDays.length != 0) {
    			$("#exposed_filter").removeClass("col-md-12");
	    		$("#exposed_filter").addClass("col-md-2");
    			var found = false;
				for (var x = 0; x < val[2].length && !found; x++) {
					var dat = new Date(val[2][x] * 1000);
	    			if (chosenDays.indexOf(dat.getDate().toString()) != -1) {
	    				if(i % 2) {
		    				processEventInformation(val, "even");
		    			} else {
		    				processEventInformation(val, "uneven");
		    			}
		    			i++;
		    			found = true;
    				}
				}
    		}
    	});	
	}

	function createElement(type, content, classes) {
		var el = document.createElement(type);
		$(el).html(content);
		$(el).addClass(classes);
		return $(el);
	}

	// Strip all HTML tags from the parameter
	function strip(html) {
	   var tmp = document.createElement("DIV");
	   tmp.innerHTML = html;
	   return tmp.textContent || tmp.innerText || "";
	}

	// Trim val to a certain length
	function trim(val, length) {
		if (val.length > length) {
			var nohtml = strip(val);
			var trimmedString = nohtml.substr(0, length);
			if (trimmedString.indexOf(".") == -1) {
				return trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf(" "))) + " ...";
			} else {
				return trimmedString.substr(0, Math.min(trimmedString.length, trimmedString.lastIndexOf("."))) + ".";
			}
		} else {
			return val;
		}
		
	}
	
	function getDetails(val) {
		var details = createElement("div", null, "event-details col-xs-12");
		if (val[3][0] != false && val[3][0] != "") { // Starting hour
			$(details).append(createElement("span", "<i class='fa fa-clock-o'></i>" + val[3][0], "detail"));
		}
		if (val[4] != false && val[4] != "Gratis") { // Price
			$(details).append(createElement("span", "<i class='fa fa-tag'></i>" + "€" + val[4], "detail"));
		} else if (val[12] != false){
			$(details).append(createElement("span", "<i class='fa fa-tag'></i>" + val[12], "detail"));
		} else {
			$(details).append(createElement("span", "<i class='fa fa-tag'></i>" + "Gratis", "detail"));
		}
		if (val[10] != false) { // Pre-sale
			$(details).append(createElement("span", "<i class='fa fa-tags'></i>" + "vvk €" + val[10], "detail"));
		} 
		if (val[6] != "" && val[6] != false) { // Location
			$(details).append(createElement("span", "<i class='fa fa-location-arrow'></i>" + val[6], "detail"));
		}
		if (val[5] == 1) { // Handicap
			$(details).append(createElement("span", "<i class='fa fa-wheelchair'></i>" + "Ja", "detail"));
		} else {
			$(details).append(createElement("span", "<i class='fa fa-wheelchair'></i>" + "Neen", "detail"));
		}
		return $(details);
	}

	function getDates(val) {
		var dates = createElement("div", createElement("span", null, "event-other-dates-label"), "event-other-dates col-xs-12 col-md-8");
		if (val[2].length > 1) {
			dates = createElement("div", createElement("span", "Andere dagen: ", "event-other-dates-label"), "event-other-dates col-xs-12 col-md-8");
			for (var i = 0; i < val[2].length; i++) {
				var datum = new Date(val[2][i] * 1000);
				if (datum.getDate() != chosenDays[0]) {
					$(dates).append(createElement("span", "<a href='detail.html?id=" + val[9][i] + "'>" + datum.getDate() + "</a>", "event-other-date"));
				}
			}
		}
		return $(dates);
	}

	function processEventInformation(val, rank) {
		var datum, found = false;
		if (chosenDays.length > 0) {
			for (var i = 0; i < val[2].length && !found; i++) {
				var tempDate = new Date(val[2][i] * 1000);
				if (tempDate.getDate() == chosenDays[0]) {
					datum = tempDate;
					found = true;
				}
			}
		} else {
			datum = new Date(val[2][0] * 1000);
		}
		var container = createElement("div", null, "row event " + rank);
		var left = createElement("div", null, "event-left col-xs-12 col-md-2")
			.append(createElement("div", null, "event-date-col col-xs-12")
				.append(createElement("div", weekday[datum.getDay()], "event-day-name"))
				.append(createElement("div", datum.getDate(), "event-day-number"))
				.append(createElement("div", month[datum.getMonth()] + " " + datum.getFullYear(), "event-month-year")))
				.append(createElement("div", weekday[datum.getDay()] + " " + datum.getDate() + " " + month[datum.getMonth()] + " " + datum.getFullYear(), "event-date-row col-xs-12"));
			
		var right = createElement("div", null, "event-right col-xs-12 col-md-10")
			.append(createElement("div", "<a href='detail.html?id=" + val[9][0] + "'>" + trim(strip(val[1]), 50) + "</a>", "event-title col-xs-12"))
			.append(getDetails(val))
			.append(createElement("div", trim(val[11], 200), "event-description col-xs-12"))
			.append(createElement("div", null, "event-extra col-xs-12")
				.append(getDates(val))
				.append(createElement("div", "<a href='detail.html?id=" + val[9][0] + "' class='pull-right'>Lees verder</a>", "event-read-more col-xs-12 col-md-4")))

			if (JSON.stringify(favourited).indexOf(val[9][0]) > -1) {
				right.append(createElement("div", '<i class="fa fa-star favourite favourited" aria-hidden="true" title="Verwijderen uit favorieten" data-id="' + val[9][0] + '"></i>', "event-favourite"));
			} else {
				right.append(createElement("div", '<i class="fa fa-star-o favourite" aria-hidden="true" title="Toevoegen aan favorieten" data-id="' + val[9][0] + '"></i>', "event-favourite"));
			}
			

		$(container).append(left).append(right);

		$("#event-list").append(container);
		$(".event-date-col").css("height", $(this).parent().css("height"));
		$(".event-left").css("height", $(this).parent().css("height"));
		$(".event-right").css("height", $(this).parent().css("height"));
		if(window.matchMedia( "(max-width: 991px)" ).matches) {
			$(".navbar-items").css("padding-left", function() { 
			    return ($(".container").width() / 2) - 180;
			});
		} else {
			$(".navbar-items").css("padding-left", 60);
		}
	}

	$(window).resize(function() {
		$(".event-date-col").css("height", $(this).parent().css("height"));
		$(".event-left").css("height", $(this).parent().css("height"));
		$(".event-right").css("height", $(this).parent().css("height"));
		if(window.matchMedia( "(max-width: 991px)" ).matches) {
			$(".navbar-items").css("padding-left", function() { 
			    return ($(".container").width() / 2) - 180;
			});
		} else {
			$(".navbar-items").css("padding-left", 60);
		}
	});

	$("#category-select").change(function(){
	    addCategory();
	});

	$("#day-select").change(function(){
	    addDay();
	});

	function addCategory() {
	    if (chosen.indexOf($("#category-select").val()) == -1) {
	        chosen.push($("#category-select").val());
	        setLocalStorage();
	        generateCategoryList();
	    }
	    $("#category-select").val($("#category-select option:first").val());
	}

	function addDay() {
	    if (chosenDays.indexOf($("#day-select").val()) == -1) {
	        chosenDays.push($("#day-select").val());
	        setLocalStorage();
	        generateDayList();
	    }
	    $("#day-select").val($("#day-select option:first").val());
	}

	function generateCategoryList() {
	    $("#categories").html("");
	    for (var i = 0; i < chosen.length; i++) {
	    	$("#categories").append(createElement("div", chosen[i], "cat"));
	    }
	    getEvent();
	}

	function generateDayList() {
	    $("#days").html("");
	    for (var i = 0; i < chosenDays.length; i++) {
	        $("#days").append(createElement("div", days[chosenDays[i]] + " " + chosenDays[i], "cat"));
	    }
	    getEvent();
	}

	function createElement(type, content, classes) {
	    var el = document.createElement(type);
	    $(el).html(content);
	    $(el).addClass(classes);
	    return $(el);
	}

	$("#categories").on("click", ".cat", function() {
	    chosen.splice(chosen.indexOf($(this).html()), 1);
	    setLocalStorage();
	    generateCategoryList();
	});

	$("#days").on("click", ".cat", function() {
		chosenDays.splice(chosenDays.indexOf($(this).html().split(" ")[1]), 1);
		setLocalStorage();
		generateDayList();
	});

	$('.scrollup').click(function(){
		$("html, body").animate({ scrollTop: 600 }, 500);
		return false;
	});

	$(window).scroll(function(){
		if ($(this).scrollTop() > 700) {
			$('.scrollup').fadeIn();
		} else {
			$('.scrollup').fadeOut();
		}
	});

	function setLocalStorage() {
		localStorage.savedChosen = JSON.stringify(chosen);
		localStorage.savedChosenDays = JSON.stringify(chosenDays);
		localStorage.favourited = JSON.stringify(favourited);
	}

	function getLocalStorage() {
		if (localStorage.savedChosen) {
			
           chosen = JSON.parse(localStorage.savedChosen);
           generateCategoryList();
        } else {
        	chosen = [];
        }

        if (localStorage.savedChosenDays) {
           chosenDays = JSON.parse(localStorage.savedChosenDays);
           generateDayList();
        } else {
        	chosenDays = [];
        }

        if (localStorage.favourited) {
           favourited = JSON.parse(localStorage.favourited);
        } else {
        	favourited = [];
        }
	}

	function resetStorage() {
	}

	$("#reset").click(function() {
		localStorage.removeItem("savedChosen");
		localStorage.removeItem("savedChosenDays");
		getLocalStorage();
		generateDayList();
		generateCategoryList();
	});

	$("html").on("click", ".favourite", function() {
		if (favourited.indexOf($(this).data("id")) == -1) {
			favourited.push($(this).data("id"));
	    	setLocalStorage();
	    	$(this).addClass("fa-star favourited");
			$(this).removeClass("fa-star-o");
		} else {
			favourited.splice(favourited.indexOf($(this).data("id")), 1);
			setLocalStorage();
			$(this).addClass("fa-star-o");
			$(this).removeClass("fa-star favourited");
		}
	});

	loadJsonFull();



});