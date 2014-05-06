var login = {}

login.forgot_fail = function() {
	alert('forgot email function failed, please try again');
}

/**
 * set up the forgot password form
 */
login.forgot_setup = function() {
	// highlight the email field
	$('#reset_username').focus();

	// get the prefix from the form div data field
	var prefix = $('#dialog_form > form').data('prefix');

	// add the buttons
	$("#dialog_form").dialog("option", "buttons", {
		"Send Password": function() { login.send_password(); },
		"Cancel": function() { $(this).dialog( "close" );}
	});
}

login.send_password = function() {
	$("#dialog_form").dialog("option", "buttons", {
		"Please wait...": function() {}
	});
	$.ajax({
		type: 'POST',
		url: 'forgot',
		data: 'reset_username=' + $('#reset_username').val(),
		dataType: 'json',
		success: function(data) {
			if (timeportal.process_ajax(data)) {
				// the results should be stored in Messages
				// populate the dialog
				$("#dialog_form").html(data['html']);
				// change buttons
				$("#dialog_form").dialog("option", "buttons", {
					"Cancel": function() { $(this).dialog( "close" );}
				});
			}
		},
		error: function(msg) {
			$("#dialog_form").html('Sorry, an error occured.  The ajax call failed to populate the dialog.');
			// change buttons
			$("#dialog_form").dialog("option", "buttons", {
				"Cancel": function() { $(this).dialog( "close" );}
			});
		}
	});
}