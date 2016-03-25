$(document).ready(function () {
	var myJson;
	$("#button1").click(function () {
	   //$.getJSON('http://api.opencultuurdata.nl/v0/openbeelden/4558763df1b233a57f0176839dc572e9e8726a02',
	    $.getJSON('http://www.uitinnoordholland.nl/api/agenda/plaatsen',


	    function (data) {
	    	myJson = data;
	    });
	});

	$("#button2").click(function () {
		$("#movielist").append(JSON.stringify(myJson, null, "\t"));
		/*
		$.each( myJson.media_urls, function( key, value ) {
			if(value.content_type === "video/mp4"){
				$("#movielist").append("<video src=" + value.url + " controls>Your browser does not support the video tag.</video><br>");
			}
		});
*/
	});
});