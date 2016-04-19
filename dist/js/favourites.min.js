$(document).ready(function () {

	var jsonfile = 'json/gentsefeestenevents.json';
	var favourited = [];
	var events = []
	var weekday = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];
	var month = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"];
	var days = {"17": "Zaterdag",  "18" : "Zondag", "19" : "Maandag", "20" : "Dinsdag", "21" : "Woensdag", "22" : "Donderdag", "23" : "Vrijdag", "24" : "Zaterdag", "25" : "Zondag", "26" : "Maandag", "27" : "Dinsdag"};

	$("#menu").load('includes/menu.html');

	function setLocalStorage() {
		localStorage.favourited = JSON.stringify(favourited);
	}

	function getLocalStorage() {
        if (localStorage.favourited) {
           favourited = JSON.parse(localStorage.favourited);
        } else {
        	favourited = [];
        }
	}

	function createElement(type, content, classes) {
	    var el = document.createElement(type);
	    $(el).html(content);
	    $(el).addClass(classes);
	    return $(el);
	}

	function getEvents() {
		events = [];
		$.getJSON(jsonfile, function (data) {
	    	$.each(data, function(key,val){
	    		if (JSON.stringify(favourited).indexOf(val.id) > -1) {
	    			events.push(val);
	    		}
	    	});	
	    	events.sort(function(a,b) { return a.datum - b.datum});
	    	createEventList();
		});
	}

	function createEventList() {
		$('#site-container').html("");
		if (events.length > 0) {
			for (var i = 0; i < events.length; i++) {
				$('#site-container').append(processEventInformation(events[i]));
			}
		} else {
			$('#site-container').append(createElement("p", "U hebt geen favorieten, gelieve er te selecteren via de <i class='fa fa-star-o'></i> icoontjes op de <a href='/index.html'>hoofdpagina</a>", "no-events"));
		}
	}

	function processEventInformation(val) {
		datum = new Date(val.datum * 1000);
		var straat = "", huisnummer = "", adres = "", locatie = "", prijs = "", omschrijving = "";

		if(val.straat != false) {
			straat = val.straat;
		}
		if(val.huisnummer != false) {
			huisnummer = " " + val.huisnummer;
		}
		if(val.locatie != false) {
			locatie = " " + val.locatie + ", ";
		}
		if (straat != "" ||  huisnummer != "" || locatie != "") {
			adres = locatie + straat + huisnummer ;
		}

		if (val.prijs != false) {
			prijs = "€" + val.prijs;
		} else if (val.prijs_omschrijving != false) {
			prijs = val.prijs_omschrijving;
		} else {
			prijs = "Gratis";
		}
		if (val.prijs_vvk != false) {
			prijs += "<br/><strong>VVK:</strong> €" + val.prijs_vvk;
		} 
		if (val.prijs_vvk_omschrijving != false) {
			prijs += "(" + val.prijs_vvk_omschrijving + ")";
		} 
		if (val.korting != false) {
			prijs += "<br/>**Korting voor " + val.korting;
		}
		if (val.omschrijving != false) {
			omschrijving += "<strong>Omschrijving:</strong> <br/>" + val.omschrijving;
		} 

		var event = createElement("div", null, "printable-event")
			.append(createElement("h1", val.titel, "printable p-title"))
			.append("<p class='remove-favourite' data-id='" + val.id + "'>Verwijder uit favorieten</p>")
			.append(createElement("p", "<strong>Datum:</strong> " + weekday[datum.getDay()] + " " + datum.getDate() + " " + month[datum.getMonth()] + " " + datum.getFullYear(), "printable p-datum"))
			.append(createElement("p", "<strong>Startuur:</strong> " + val.startuur, "printable p-startuur"))
			.append(createElement("p", "<strong>Prijs:</strong> " + prijs, "printable p-prijs"))
			.append(createElement("p", "<strong>Locatie:</strong> " + adres, "printable p-adres"))
			.append(createElement("p", omschrijving, "printable p-title"))
		return event;
	}

	$("html").on("click", ".remove-favourite", function() {
		favourited.splice(favourited.indexOf($(this).data("id")), 1);
		setLocalStorage();
		getEvents();
	});

	$("html").on("click", ".print-btn", function() {
		window.print();
	});

	getLocalStorage();
	getEvents();

});