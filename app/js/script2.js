$(document).ready(function () {
	var myJson;

	$("#button1").click(function () {
	    $.getJSON('json/gentsefeestenevents.json',


	    function (data) {
	    	myJson = data;
	    	$("body").append(JSON.stringify(myJson, null, "\t"));
	    });
	});
});