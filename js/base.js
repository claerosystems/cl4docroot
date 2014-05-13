var base = {};

/**
 * ********************************************************************************************************************************
 * add the page event actions:
 * ********************************************************************************************************************************
 */
$(document).on("mobileinit", function () {
	// Reference: http://api.jquerymobile.com/global-config/
	$.mobile.ajaxEnabled = false;
	//$.mobile.ignoreContentEnabled = true;

});

// PERFORM ACTIONS ON PAGE LOAD SINCE PAGES ARE LOADED VIA AJAX WITH JQUERY MOBILE
// These are based on the page div id

$(document).on( "pageshow", "[data-role='page']", function() {
});

$(document).on('pageshow', function () {
});

$(document).on('pageload', function () {
});

$(document).on('pagebeforeshow', function () {
	// clear any messages
	$('div.messages').html();
});

$(document).on('pageshow', "#page_cl4admin", function () {
});

$(document).on('pagebeforeshow', "#page_login", function () {
	if ($('#username').val() == '') {
		$('#username').focus();
	} else {
		$('#password').focus();
	}
});

$(document).on( "click", ".show-page-loading-msg", function() {
	main.show_page_load(this);
}).on( "click", ".hide-page-loading-msg", function() {
	$.mobile.loading( "hide" );
});

/**
 * ********************************************************************************************************************************
 * Here are the base methods:
 * ********************************************************************************************************************************
 */

/**
 * log a message to the javascript console if supported
 *
 * @type Object
 */
base.console = function(msg) {
	if (window.console && cl4_in_debug) console.log(msg);
}

/**
 * Retreive the smart parameter.
 *
 * @param parameter_name
 * @param default_value
 * @param type
 */
base.get_smart_parameter = function(parameter_name, default_value, type) {
	$.ajax({
		type: 'POST',
		url: '/ajax/get_smart_parameter?parameter_name=' + parameter_name + '&default=' + default_value + '&type='  + type,
		dataType: 'json',
		success: function(data) {
			if (timeportal.process_ajax(data)) {
				cl4.ajax_log_msg(data['log']);
			}
		},
		error: function(msg) {
			cl4.add_ajax_error('The smart parameter was not set because an ajax error occurred.');
		}
	});
}

/**
 * Set the specified smart paramter value.
 *
 * @param parameter_name
 * @param value
 * @param type
 * @param success_function
 */
base.set_smart_parameter = function(parameter_name, value, type, success_function) {
	$.ajax({
		type: 'GET',
		url: '/ajax/get_smart_parameter?parameter_name=' + parameter_name + '&' + parameter_name + '=' + value + '&type='  + type,
		dataType: 'json',
		success: function(data) {
			if (base.process_ajax(data)) {
				base.console('parameter ' + parameter_name + ' set to ' + data['html']);
				// execute the success_function if it exists
				if (success_function) {
					success_function();
				}
				return true;
			}
		},
		error: function(msg) {
			cl4.add_ajax_error('The smart parameter ' + parameter_name + ' was not set because an ajax error occurred.');
			return false;
		}
	});
}

/**
 * update a div with html from  an ajax request
 *
 * @type Object
 */
base.load_into = function(target_element, source_url, success_function) {
	base.console('timeportal.load_into ' + target_element.attr('id') + ' with ' + source_url);
	// show and add a waiting indicator to the target element
	target_element.html('<i class="fa fa-cog fa-spin"></i> Loading, please wait.');
	$.ajaxSetup({ cache: false });
	$.ajax({
		type: 'GET',
		cache: false,
		url: source_url,
		dataType: 'json',
		success: function(data) {
			if (base.process_ajax(data)) {
				// add the HTML
				target_element.html(data['html']).trigger("create");
				// execute the success_function if it exists
				if (success_function) {
					success_function(target_element);
				}
			} else {
				target_element.html(data['html']).show();
			}
		},
		error: function(msg) {
			target_element.html('Sorry, an error occured.  The information cannot be loaded right now.');
		}
	});
}


base.process_ajax = function(return_data) {
	if (typeof return_data != 'object' || jQuery.isEmptyObject(return_data)) {
		base.console('The returned JSON data is not parsable');
		return false;
	}

	if (typeof return_data.debug_msg != 'undefined' && return_data.debug_msg != '') {
		base.console(return_data.debug_msg);
	}

	// check to see if we've received the status, because we need it for the rest
	if (typeof return_data.status == 'undefined') {
		base.console('No status property in JSON data');
		return;
	}

	switch (return_data.status) {
		// successful
		case 1 :
			base.console('AJAX status is successful');
			return true;
			break;
		// not logged in
		case 2 :
			//cl4.add_default_ajax_error(return_data, cl4.ajax_error_msgs.not_logged_in);
			base.console('The user is not logged in');
			return false;
			break;
		// timed out
		case 3 :
			//cl4.add_default_ajax_error(return_data, cl4.ajax_error_msgs.timed_out);
			base.console('The user has timed out');
			return false;
			break;
		// not allowed (permissions)
		case 4 :
			//cl4.add_default_ajax_error(return_data, cl4.ajax_error_msgs.not_allowed);
			base.console('The user does not have permissions');
			return false;
			break;
		// not found 404
		case 5 :
			//cl4.add_default_ajax_error(return_data, cl4.ajax_error_msgs.not_found_404);
			base.console('The page/path could not be found');
			return false;
			break;
		// validation error
		case 6 :
			//cl4.add_ajax_validation_msg(return_data);
			base.console('There was a validation error');
			return false;
			break;
		// unknown error
		case 0 :
		default :
			//cl4.add_default_ajax_error(return_data);
			//if (cl4_in_debug) {
			if (typeof return_data.debug_msg == 'undefined' || return_data.debug_msg == '') {
				base.console('An unknown error occurred');
			}
			//}
			return false;
	} // switch
}

base.show_page_load = function(target) {

	var $this = $( target ),
		theme = $this.jqmData( "theme" ) || $.mobile.loader.prototype.options.theme,
		msgText = $this.jqmData( "msgtext" ) || $.mobile.loader.prototype.options.text,
		textVisible = $this.jqmData( "textvisible" ) || $.mobile.loader.prototype.options.textVisible,
		textonly = !!$this.jqmData( "textonly" );
	html = $this.jqmData( "html" ) || "";
	$.mobile.loading( "show", {
		text: msgText,
		textVisible: textVisible,
		theme: theme,
		textonly: textonly,
		html: html
	});
}
