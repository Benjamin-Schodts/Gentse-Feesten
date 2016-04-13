$(document).ready(function () {

	var jsonfile = 'json/gentsefeestenevents.json';
	var weekday = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];
	var month = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"];
	var showtimes = [];

	$("#menu").load('../includes/menu.html');

	$("#menu").load('../dist/includes/menu.html');

	// Get a variable from URL
	function getQueryVariable(variable) {
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i = 0; i < vars.length; i++) {
           	var pair = vars[i].split("=");
           	if (pair[0] == variable) {
           		return pair[1];
           	}
       }
       return(false);
	}	

	// Strip all HTML tags from the parameter
	function strip(html) {
	   var tmp = document.createElement("DIV");
	   tmp.innerHTML = html;
	   return tmp.textContent || tmp.innerText || "";
	}

	// Get event with ID provided by URL
	function getEvent() {
		$.getJSON(jsonfile, function (data) {
	    	$.each(data, function(key,val){
	    		if (val.id == getQueryVariable("id")) {
	    			getShowtimes(val);
	    			return false;
	    		}
	    	});	
	    	return false;
	    });	
	}

	function getShowtimes(event) {
		var datum = new Date(event.datum * 1000);
		$.getJSON(jsonfile, function (data) {
	    	$.each(data, function(key,val){
	    		if (val.activiteit_id == event.activiteit_id && val.startuur != false) {
	    			var foundDate = new Date(val.datum * 1000);
	    			if (datum.getDate() == foundDate.getDate()) {
	    				showtimes.push(val.startuur);
	    			}
	    		}
    		});	
    		processEventInformation(event);
    	});	

	}

	// Process and event and print the specified values
	function processEventInformation(val) {
		// Title
		$(".name").append(val.titel);
		$("title").html(val.titel);

		// Detail-left
		var datum = new Date(val.datum * 1000);
		$(".date").append(weekday[datum.getDay()] + " " + datum.getDate() + " " + month[datum.getMonth()] + " " + datum.getFullYear());
		//$(".time").append(val.startuur);
		for (var i = 0; i < showtimes.length; i++) {
			if (i == 0) {
				$(".time").append(showtimes[i]);
			} else {
				$(".time").append(", " + showtimes[i]);
			}
		}

		if (val.omschrijving != false && val.omschrijving != "" && val.omschrijving.length > 0) {
			$(".description").append(strip(val.omschrijving));
			if (val.meer_info != false && val.meer_info != "" && val.meer_info.length > 0) {
				$(".description").append('<br/><a class="see see-more">Meer &gt;&gt;</a><a class="see see-less">&lt;&lt; Minder</a>');
			}
			$(".extra").append(strip(val.meer_info));
		}
		
		// Detail-right
		if (val.prijs != false) {
			$(".price").append('<i class="fa fa-tag"></i>€' + val.prijs);
		} else if (val.prijs_omschrijving != false) {
			$(".price").append('<i class="fa fa-tag"></i>' + val.prijs_omschrijving);
		} else {
			$(".price").append('<i class="fa fa-tag"></i>GRATIS');
		}
		if (val.prijs_vvk != false) {
			$(".price").append('<br/><i class="fa fa-tags"></i>€' + val.prijs_vvk);
		} 
		if (val.prijs_vvk_omschrijving != false) {
			$(".price").append(" " + val.prijs_vvk_omschrijving);
		} 
		if (val.korting != false) {
			$(".price").append('<br/><i class="fa fa-star"></i>Korting voor ' + val.korting);
		} 
		if (val.locatie != "") {
			$(".location").append('<i class="fa fa-location-arrow"></i>' + val.locatie);
		}
		var straat = "", huisnummer = "", postcode = "", gemeente = "";
		if(val.straat != false) {
			straat = val.straat;
		}
		if(val.huisnummer != false) {
			huisnummer = " " + val.huisnummer;
		}
		if(val.postcode != false) {
			postcode = ", " + val.postcode;
		}
		if(val.gemeente != false) {
			gemeente = " " +val.gemeente;
		}
		if (straat != "" &&  huisnummer != "" && postcode != "" && gemeente != "") {
			$(".address").append('<i class="fa fa-map-marker"></i>' + straat + huisnummer +  postcode + gemeente);
		}
		if (val.toegankelijk_rolstoel == 1) {
			$(".handicap").append("Ja");
		} else {
			$(".handicap").append("Neen");
		}

		// Scene
		$(".scene").css("background", "url(http://lorempixel.com/1170/300/nightlife/) no-repeat top left / 100% 100%");

		// Gmap
		$(".gmap").append('<iframe width="300" height="300" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?q='+val.latitude+','+val.longitude+'&hl=es;z=14&amp;output=embed"></iframe>');
	
		if(window.matchMedia( "(max-width: 991px)" ).matches) {
			$(".navbar-items").css("padding-left", function() { 
			    return ($(".container").width() / 2) - 180;
			});
		} else {
			$(".navbar-items").css("padding-left", 60);
		}
	}

	// Flip see more and see less
	function flipSee() {
		if ($(".see-less").css("display") == "none") {
			$(".see-less").css("display", "inline-block");
			$(".see-more").css("display", "none");
		} else {
			$(".see-more").css("display", "inline-block");
			$(".see-less").css("display", "none");
		}
	}

	// SlideToggle the extra content
	$(".node").on("click", ".see", function() {
		$(".extra").slideToggle();
		flipSee();
	});

	$(window).resize(function() {
		if(window.matchMedia( "(max-width: 991px)" ).matches) {
			$(".navbar-items").css("padding-left", function() { 
			    return ($(".container").width() / 2) - 180;
			});
		} else {
			$(".navbar-items").css("padding-left", 60);
		}
	});

	// Startup event
	getEvent();

});