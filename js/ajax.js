/**
* AJAX methods to deal with the results of AJAX calls
* Helps dealing with errors that may result from an AJAX call, like auth or PHP errors
* Include after cl4.js
*/

/**
* Default error messages
*/
cl4.ajax_error_msgs = {
	default_msg : 'There was a error loading some of the content on this page.<br>Try reloading the page or contacting an administrator.',
	not_logged_in : 'You are no longer logged in. <a href="/login">Click here to login.</a>',
	timed_out : 'Your login has timed out. To continue using your current login, <a href="/login/timedout">click here to enter your password.</a>',
	not_allowed : 'You do not have the necessary permissions to access some of the functionality on this page.',
	not_found_404 : 'The requested URL was not found.'
};

/**
* ajax error function, will show a red div at the top of the page if there is a problem with any of the ajax on the page
*/
cl4.add_ajax_error = function(error) {
	cl4.add_message_div(error);
};

/**
* Adds an ajax validation message at the top of the page and hides and existing validation messages
*/
cl4.add_ajax_validation_msg = function(return_data) {
	cl4.hide_ajax_validation_msgs();
	if (return_data !== null && typeof return_data == 'object' && typeof return_data.validation_msg != 'undefined' && return_data.validation_msg !== '') {
		cl4.add_message_div(return_data.validation_msg, 'cl4_ajax_validation_msg');
	}
};

/**
 * Creates the div and adds the necessary click functions and body margin-top adjustment.
 */
cl4.add_message_div = function(msg, div_class) {
	if (arguments.length == 2) {
		div_class = ' class="' + div_class + '"';
	} else {
		div_class = '';
	}

	var $msg_div = $('<div' + div_class + '><span class="dismiss"><a href="">X</a></span>' + msg + '</div>');

	$('#cl4_ajax_errors').append($msg_div);
	$msg_div.slideDown(cl4.animate_ajax_body_margin)
	.find('span.dismiss a').click(function(e) {
		e.preventDefault();
		$(this).parent().parent().slideUp(function() {
			$(this).remove();
			cl4.animate_ajax_body_margin();
		});
	});
};

/**
* Hides existing validation messages within the cl4_ajax_errors container
*/
cl4.hide_ajax_validation_msgs = function() {
	$('#cl4_ajax_errors div.cl4_ajax_validation_msg').slideUp(function() {
		$(this).remove();
	});
};

/**
 * Animates the body so it slides up after the removal of a message.
 */
cl4.animate_ajax_body_margin = function() {
	$('body').animate({
		marginTop: $('#cl4_ajax_errors').height() + 'px'
	}, 'fast', 'linear');
};

/**
* Adds a default message if there is no error_msg in the return_data object
*/
cl4.add_default_ajax_error = function(return_data, default_msg) {
	if (arguments.length === 0) {
		return_data = null;
		default_msg = cl4.ajax_error_msgs.default_msg;
	} else if (arguments.length == 1) {
		default_msg = cl4.ajax_error_msgs.default_msg;
	}

	if (return_data !== null && typeof return_data == 'object' && typeof return_data.error_msg != 'undefined' && return_data.error_msg !== '') {
		cl4.add_ajax_error(return_data.error_msg);
	} else {
		cl4.add_ajax_error(default_msg);
	}
};

/**
* attach an AJAX error hander to the ajax_error element
*/
$('#cl4_ajax_errors').ajaxError(function(event, jqXHR, ajaxSettings, thrownError) {
	if (typeof ajaxSettings.cl4_ajax_error_display == 'undefined' || ajaxSettings.cl4_ajax_error_display) {
		cl4.add_ajax_error(cl4.ajax_error_msgs.default_msg);
		if (cl4_in_debug) {
			cl4.ajax_log_msg('AJAX Error: ' + thrownError);
		}
	}
});

/**
* Call within a ajax success function to deal with the response of an ajax call
*/
cl4.process_ajax = function(return_data) {
	if (typeof return_data != 'object' || jQuery.isEmptyObject(return_data)) {
		cl4.add_default_ajax_error();
		if (cl4_in_debug) {
			cl4.ajax_log_msg('JSON data is not parsable');
		}
		return false;
	}

	if (cl4_in_debug && typeof return_data.debug_msg != 'undefined' && return_data.debug_msg !== '') {
		cl4.add_ajax_error(return_data.debug_msg);
	}

	// check to see if we've received the status, because we need it for the rest
	if (typeof return_data.status == 'undefined') {
		if (cl4_in_debug) {
			cl4.ajax_log_msg('No status property in JSON data');
		}
		return;
	}

	switch (return_data.status) {
		// successful
		case 1 :
			if (cl4_in_debug) {
				cl4.ajax_log_msg('AJAX all good');
			}
			return true;
		// not logged in
		case 2 :
			cl4.add_default_ajax_error(return_data, cl4.ajax_error_msgs.not_logged_in);
			if (cl4_in_debug) {
				cl4.ajax_log_msg('The user is not logged in');
			}
			return false;
		// timed out
		case 3 :
			cl4.add_default_ajax_error(return_data, cl4.ajax_error_msgs.timed_out);
			if (cl4_in_debug) {
				cl4.ajax_log_msg('The user has timed out');
			}
			return false;
		// not allowed (permissions)
		case 4 :
			cl4.add_default_ajax_error(return_data, cl4.ajax_error_msgs.not_allowed);
			if (cl4_in_debug) {
				cl4.ajax_log_msg('The user does not have permissions');
			}
			return false;
		// not found 404
		case 5 :
			cl4.add_default_ajax_error(return_data, cl4.ajax_error_msgs.not_found_404);
			if (cl4_in_debug) {
				cl4.ajax_log_msg('The page/path could not be found');
			}
			return false;
		// validation error
		case 6 :
			cl4.add_ajax_validation_msg(return_data);
			if (cl4_in_debug) {
				cl4.ajax_log_msg('There was a validation error');
			}
			return false;
		// unknown error
		case 0 :
		default :
			cl4.add_default_ajax_error(return_data);
			if (cl4_in_debug) {
				if (typeof return_data.debug_msg != 'undefined' && return_data.debug_msg !== '') {
					cl4.ajax_log_msg('AJAX Error: ' + return_data.debug_msg);
				} else {
					cl4.ajax_log_msg('An unknown error occurred');
				}
			}
			return false;
	} // switch
};

cl4.ajax_log_msg = function(msg) {
	try {
		console.log(msg);
	} catch (e) {
		// don't do anything
	}
};