// assuming it's OK for the token to be public
var token = '6f7906ec9b8bb7a1d467169f920dcdc6';
var base_url = "http://lucysurvey.com/api/converse/";

function getLucyResponse(payload) {
	/* Get the response from the Lucy API for the given payload, and if successful 
	call updatePage with the returned JSON object */

	// ref is passed from node to the view, check to make sure it is defined
	if (ref == null) {
		return;
	}
	
	$.ajax({
		url: base_url + ref, 
		type: 'POST',
		data : {"token" : token, "payload" : payload},
		success: function(response) {
    	// parse the string into a JSON object and use it to update the page
    	console.log(response);
    	var parsedResponse = JSON.parse(response);
    	updatePage(parsedResponse);
    }})};

	function updatePage(response) {
	/* Update the message and user response options on the page
	given the response from the Lucy API */
	var answers = response['answers'];
	var followup = response['followup'];
	var type = response['type'];
	var message = response['text'];

	// update the message
	// if there is an image in the response text, this will put <img> tags around it assuming the filename has 3 letters (jpg, png, etc)
	var message_parsed = message.replace(/#lucyimage:(.+\....)/, "<img style='height: 100%; width: 100%; object-fit: contain' src=\$1></img>");
	$('#msg').html(message_parsed);

	// clear existing answers
	$("button").remove(".answer");
	$("div").remove(".feedback");
	
	// add each answer as a new button, if there are any
	if (answers != null) {
		for(i = 0; i < answers.length; i++) {
			var answer_text = answers[i][0];
			var answer_value = answers[i][1];
			var input_html = "<button type='button' class='btn btn-default btn-lg answer' value="+answer_value+">"+answer_text+"</button>"
			$(".answers").append(input_html);
		}
	}
	// if a text answer is requested, append the form
	console.log(followup);
	console.log(type);
	if (followup != null) {
		var input_html = '<div class="input-group feedback">' +
						'<input id="feedback" type="text" class="form-control" placeholder="Your feedback">' +
						'<span class="input-group-btn">' +
						'<button class="btn btn-default" id="submit" type="button" value='+followup+'>Submit</button>' +
						'</span></div>';
		$(".answers").append(input_html);
	}
}

$(document).ready(function() {
	// button triggers
	$(".answers").on("click", ".answer", function() {
	// when a button is pressed, get the response from the Lucy API
		getLucyResponse($(this).attr("value"));
	});

	$(".answers").on("click", "#submit", function() {
	// when a button is pressed, get the response from the Lucy API
		getLucyResponse($('#submit').val());
	});

	// initialize with Lucy's greeting
	getLucyResponse("START");
})

