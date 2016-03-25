$(document).ready(function () {
	var myJson;


// Create the XHR object.
	function createCORSRequest(method, url) {
	  var xhr = new XMLHttpRequest();
	  if ("withCredentials" in xhr) {
	    // XHR for Chrome/Firefox/Opera/Safari.
	    xhr.open(method, url, true);
	  } else if (typeof XDomainRequest != "undefined") {
	    // XDomainRequest for IE.
	    xhr = new XDomainRequest();
	    xhr.open(method, url);
	  } else {
	    // CORS not supported.
	    xhr = null;
	  }
	  return xhr;
	}

	// Helper method to parse the title tag from the response.
	function getTitle(text) {
	  return text.match('<title>(.*)?</title>')[1];
	}

	// Make the actual CORS request.
	function makeCorsRequest() {
	  // All HTML5 Rocks properties support CORS.
	  var url = 'http://updates.html5rocks.com';

	  var xhr = createCORSRequest('GET', url);
	  if (!xhr) {
	    alert('CORS not supported');
	    return;
	  }

	  // Response handlers.
	  xhr.onload = function() {
	    var text = xhr.responseText;
	    var title = getTitle(text);
	    alert('Response from CORS request to ' + url + ': ' + title);
	  };

	  xhr.onerror = function() {
	    alert('Woops, there was an error making the request.');
	  };

	  xhr.send();
	}


	$("#button1").click(function () {
	   //$.getJSON('http://api.opencultuurdata.nl/v0/openbeelden/4558763df1b233a57f0176839dc572e9e8726a02',
	    $.getJSON('http://www.uitinnoordholland.nl/api/agenda/plaatsen',


	    function (data) {
	    	myJson = data;
	    });
	});

	$("#button2").click(function () {


		jQuery.support.cors = true;
		$.ajax({
		    url: "http://www.uitinnoordholland.nl/api/agenda/plaatsen",
		    type: "GET",
		    timeout: 30000,
		    dataType: "text/plain", // "xml", "json"
		    success: function(data) {
		        // show text reply as-is (debug)
		        alert(data);

		        // show xml field values (debug)
		        //alert( $(data).find("title").text() );

		        // loop JSON array (debug)
		        //var str="";
		        //$.each(data.items, function(i,item) {
		        //  str += item.title + "\n";
		        //});
		        //alert(str);
		    },
		    error: function(jqXHR, textStatus, ex) {
		        alert(textStatus + "," + ex + "," + jqXHR.responseText);
		    }
});

	});




	



});