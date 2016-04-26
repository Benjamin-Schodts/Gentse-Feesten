(function(){

  	var app = angular.module('detail', []);
 	var jsonfile = 'json/gentsefeestenevents.json';
  	var categories = [];
  	var weekday = ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"];
	var month = ["Januari", "Februari", "Maart", "April", "Mei", "Juni", "Juli", "Augustus", "September", "Oktober", "November", "December"];
	var dayz = [];
  	app.controller("EventsController", function($scope, $sce, $http) {
	  	$scope.events = [];
	  	$scope.singleEvent;
		$http.get(jsonfile).success(function (data){
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

				var date = new Date(val.datum * 1000);	
				if(val.startuur) {
					dayz[date.getDate()] = val.datum;
				}

			   	// Fill events array with event objects
			   	if(val.startuur != false) { // Only add events that have a start date
			   		var e = {};
			   		var titleIndex = $scope.indexLookup("activiteit", val.activiteit_id); // Check if event with a certain name already exists and return the index
			   		if($scope.events.length > 0 && titleIndex > -1) { // Only enter this part if the event already exists
			   			if (val.datum in $scope.events[titleIndex]["dates"]) {
			   				$scope.events[titleIndex]["dates"][val.datum]["starturen"].push(val.startuur);
			   			} else {
			   				$scope.events[titleIndex]["dates"][val.datum] = {
			   					datum: val.datum, 
			   					starturen: [val.startuur],
			   					id: val.id
				   			};
				   			$scope.events[titleIndex]["datez"].push({
			   					datum: val.datum, 
			   					id: val.id
				   			});
			   			}
			   		} else {
			   			// Check if event is free
				   		e = {
				   			activiteit: val.activiteit_id,
				   			categorie: category, 
				   			titel: val.titel,
				   			dates: [],
				   			datez: [],
				   			prijs: val.prijs, 
				   			handicap: val.toegankelijk_rolstoel, 
				   			locatie: val.locatie, 
				   			straat: val.straat, 
				   			huisnummer: val.huisnummer, 
				   			postcode: val.postcode, 
				   			gemeente: val.gemeente, 
				   			latitude: val.latitude, 
				   			longitude: val.longitude, 
				   			vvk: val.prijs_vvk, 
				   			vvko: val.prijs_vvk_omschrijving,
				   			omschrijving: val.omschrijving, 
				   			prijsomschrijving: val.prijs_omschrijving,
				   			extra: val.meer_info,
				   			korting: val.korting,
				   			favourite: false
				   		}; // Create new Event
				   		e["dates"][val.datum] = {
			   					datum: val.datum, 
			   					starturen: [val.startuur],
			   					id: val.id
				   			};
				   		e["datez"].push({
			   					datum: val.datum, 
			   					id: val.id
				   			});

				   		$scope.events.push(e);
			   		}
		   		}
			});
			$scope.events.sort(function(a,b) { return Object.keys(a.dates)[0] - Object.keys(b.dates)[0]});
			$scope.fill_category_list();
			$scope.fill_dates_list();
		});

	  	$scope.getTotalEvents = function(){
	        return $scope.events.length;    
	    };

	    $scope.fill_category_list = function() {
	    	for (i = 0; i < categories.length; i++) { 
				$("#category-select").append("<option value='" + categories[i] + "''>" + categories[i] + "</option>");
			}
	    }

	    $scope.fill_dates_list = function() {
	    	for(var day in dayz) {
	    		if(day >=10 && day <= 27) {
	    			var datum = new Date(dayz[day] * 1000);
					$("#day-select").append("<option value='" + dayz[day] + "''>" + weekday[datum.getDay()] + " " + day  + "</option>");
	    		}
			}
	    }

		// Get vent corresponding with index
		$scope.getSingleEvent = function(index, d) {
			if (d > 0) {
				$scope.singleEvent = {
					datum: d,
					datumFull: "",
					timetable: "",
					e: $scope.events[index]
				};
			} else {
				$scope.singleEvent = {
					datum: Object.keys($scope.events[index].dates)[0],
					datumFull: "",
					timetable: "",
					e: $scope.events[index]
				};
			}

			$scope.se_process();
		}

		// Get index of item with certain value at certain key
		$scope.indexLookup = function(key, value) {
			for (i = 0; i < $scope.events.length; i++) {
				if ($scope.events[i][key] == value) {
					return i;
				}
			}
			return -1;
		}

		// Strip all HTML tags from the parameter
		$scope.strip = function(html) {
			var tmp = document.createElement("DIV");
		   	tmp.innerHTML = html;
		   	return tmp.textContent || tmp.innerText || "";
		}

		// Trim val to a certain length
		$scope.trim = function(val, length) {
			if (val.length > length) {
				var nohtml = $scope.strip(val);
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

		$scope.se_process = function () {
			$scope.se_processDate();
			$scope.se_processTimetable();
			$scope.se_processDescription();
			$scope.se_processHandicap();
			$scope.se_processImage();
			$scope.se_processGmap();
		}

		$scope.se_processDate = function() {
			var datum = new Date($scope.singleEvent.datum * 1000);
			$scope.singleEvent.datumFull = weekday[datum.getDay()] + " " + datum.getDate() + " " + month[datum.getMonth()] + " " + datum.getFullYear();
		}

		$scope.se_processTimetable = function() {
			$scope.singleEvent.timetable = $scope.singleEvent.e.dates[$scope.singleEvent.datum]["starturen"].toString();
		}

		$scope.se_processDescription = function() {
			$scope.singleEvent.e.omschrijving = $scope.strip($scope.singleEvent.e.omschrijving);
		}

		$scope.se_processHandicap = function() {
			$scope.singleEvent.e.handicap = ($scope.singleEvent.e.handicap) ? "Ja" : "Neen";
		}

		$scope.se_processImage = function() {
			$(".scene").css("background", "url(http://lorempixel.com/1170/300/nightlife/) no-repeat top left / 100% 100%");
		}

		$scope.se_processGmap = function() {
			$(".gmap").html('<iframe width="300" height="300" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" src="https://maps.google.com/maps?q='+ $scope.singleEvent.e.latitude+','+ $scope.singleEvent.e.longitude+'&hl=es;z=14&amp;output=embed"></iframe>');
		}

		$scope.getEventDayName = function(e, d) {
			var datum;
			if(d > 0) {
				datum = new Date(e.dates[d].datum * 1000);
			} else {
				datum = new Date(Object.keys(e.dates)[0] * 1000);
			}
			return weekday[datum.getDay()];
		}	

		$scope.getEventDayNumber = function(e,d) {
			var datum;
			if(d > 0) {
				datum = new Date(e.dates[d].datum * 1000);
			} else {
				datum = new Date(Object.keys(e.dates)[0] * 1000);
			}
			return datum.getDate();
		}

		$scope.getEventMonthYear = function(e,d) {
			var datum;
			if(d > 0) {
				datum = new Date(e.dates[d].datum * 1000);
			} else {
				datum = new Date(Object.keys(e.dates)[0] * 1000);
			}
			return month[datum.getMonth()] + " " + datum.getFullYear();
		}

		$scope.getEventFullDate = function(e,d) {
			return $scope.getEventDayName(e,d) + " " + $scope.getEventDayNumber(e,d) + " " + $scope.getEventMonthYear(e,d);
		}

		$scope.transformToDate = function(val) {
			var datum = new Date(val * 1000);
			return datum.getDate();
		}

		$scope.isCurrentDate = function(d, cd, col) {
			if(cd > 0) {
				return d == cd;
			} else {
				return d == col[0].datum;
			}
		}

		$scope.hasNoOtherDates = function(e) {
			return e.datez.length == 1;
		}

		$scope.flipFavourite = function(e) {
			if (e.favourite) {
				e.favourite = false;
			} else {
				e.favourite = true;
			}
		}

		$scope.isFavourited = function(e) {
			if(e) {
				if (e.favourite) {
					return "fa-star favourited";
				} else {
					return "fa-star-o";
				} 
			} else {
				return "fa-star-o";
			}
		}

		$scope.scrollTop = function() {
			$('.scrollup').click(function(){
				$("html, body").animate({ scrollTop: 680 }, 500);
				return false;
			});
		}

		$scope.hasEvents = function(e) {
			console.log(e.length);
			return (e.length > 0);
		}
	});

	app.controller('TabController', function(){
	    this.tab = 1;

	    this.setTab = function(newValue){
	      this.tab = newValue;
	      $("html, body").animate({ scrollTop: 0 }, 500);
	    };

	    this.isSet = function(tabName){
	      return this.tab === tabName;
	    };
	});

	app.filter('byFilter', function() {
	    return function(es, search) {
	      var filtered = [];

	      angular.forEach(es, function(e) {
	      	if(search && search["categorie"] && search["date"]) {
		      	if (e.categorie == search["categorie"]) {
		      		if(e.dates[search["date"]]) {
			          filtered.push(e);
			        }
		      	}
		    } else if (search && search["categorie"]) {
		    	if (e.categorie == search["categorie"]) {
			        filtered.push(e);
		      	}
		    } else if (search && search["date"]){
		    	if(e.dates[search["date"]]) {
		         	filtered.push(e);
		        }
		    }
	      });
	      return filtered;
	    };
	});

	app.directive("scroll", function ($window) {
	    return function(scope, element, attrs) {
	        angular.element($window).bind("scroll", function() {
	        	console.log("scrolling");
	             if ($(this).scrollTop() > 700) {
					$('.scrollup').fadeIn();
				} else {
					$('.scrollup').fadeOut();
				}
	        });
	    };
	});

})();

