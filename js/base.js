var base = {};

/**
 * ********************************************************************************************************************************
 * add the page event actions:
 * ********************************************************************************************************************************
 */
$(document).on("mobileinit", function () {
	// Reference: http://api.jquerymobile.com/global-config/
	//$.mobile.ajaxEnabled = false;
	//$.mobile.ignoreContentEnabled = true;

});

// PERFORM ACTIONS ON PAGE LOAD SINCE PAGES ARE LOADED VIA AJAX WITH JQUERY MOBILE

$(document).on('pageshow', function () {
	// add generic suggest fields (ORM type suggest)
	base.add_suggest();
});

$(document).on('pageshow', "#page_cl4admin", function () {
	base.setup_admin_page();
});

$(document).on('pageshow', "#page_login", function () {
	if ($('#username').val() == '') {
		$('#username').focus();
	} else {
		$('#password').focus();
	}

	$('#reset_password').click(function() {
		base.show_page_load(this);
		$.ajax({
			type: 'POST',
			url: 'forgot',
			data: 'reset_username=' + $('#reset_username').val(),
			dataType: 'json',
			success: function(data) {
				window.location='/';
			},
			error: function(msg) {
                alert('rest password ajax call failed, please contact your system administrator');
			    window.location='/';
			}
		});
	});
});

$(document).on( "click", ".show-page-loading-msg", function() {
	base.show_page_load(this);
}).on( "click", ".hide-page-loading-msg", function() {
	$.mobile.loading( "hide" );
});

/**
 * ********************************************************************************************************************************
 * Here are the base methods:
 * ********************************************************************************************************************************
 */

/**
 * add the suggest feature to any relevant input fields (with class js_cl4_suggest, as per Form::suggest())
 */
base.add_suggest = function() {
	$('.js_cl4_suggest').on('keyup', function(e, data) {
		var search_field = $(this);
		var search_field_id = search_field.attr('id');
		var value = $(this).val();
		var model_name = $(this).data('model_name');
		var column_name = $(this).data('column_name');
		var result_ul = $('#ajax_search_for_' + search_field_id); // this field is created by classes/Form.php
		var value_field = $('#id_for_' + search_field_id); // this field is created by classes/Form.php

		// refresh the ul in case it was just added

		// set up the search results list view
		//if (result_ul.hasClass('ui-listview')) {
		//	$(result_ul).listview('refresh');
		//} else {
		//	$(result_ul).trigger('create');
		//}

		if (value && value.length > 2) {
			base.console('ajax suggest activated for model ' + model_name + ' and field ' + column_name + ' id will go to field: ' + '#id_for_' + search_field_id);
            //base.console('the id will be stored at ' + '#id_for_' + search_field.attr('name'))

			// add the waiting indicator
			result_ul.html('<li><i class="fa fa-cog fa-spin"></i> loading...</li>').listview().listview("refresh").fadeIn();

			$.ajax({
				type: 'GET',
				cache: false,
				url: '/dbadmin/' + model_name + '/lookup/0/' + column_name + '?q=' + value,
				dataType: 'json',
				success: function(response) {
					var html = "";
					// populate the result listing
					$.each(response.data, function (i, val) {
						html += '<li data-id="' + val.id + '">' + val.name + "</li>";
					});
					result_ul.html(html);
					result_ul.listview("refresh");
					result_ul.trigger("updatelayout");

					// add the click action on the result items
					// todo: save the current scroll position and return to it after click or cancel
					// todo: add cancel? esc or click somewhere?
					$('#ajax_search_for_' + search_field_id + " > li").on('click', function() {
						result_ul.hide();
                        base.console('id ' + $(this).data('id') + ' stored for ' + $(this).text() + ' in ' + '#id_for_' + search_field_id);
						search_field.val($(this).text());
                        // set the id value and spark a change event so that we can add custom code in our application to catch the change
                        $('#id_for_' + search_field_id).val($(this).data('id')).change();
					});
				},
				error: function(msg) {
				}
			});
		}
	});
}

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
		cache: false,
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
		cache: false,
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
 * add the actions required for the cl4 editable list / admin pages
 */
base.setup_admin_page = function() {
	base.console('set up editable list / admin actions');

	// buttons and checkbox at the top of an editable list
	$('.js_cl4_button_link_form').on('click', cl4.button_link_form);
	$('.js_cl4_button_link').on('click', cl4.button_link);
	$('.js_cl4_multiple_edit').on('click', cl4.multiple_edit);
	$('.js_cl4_export_selected').on('click', cl4.export_selected);
	$('.js_cl4_multiple_edit_form').on('change', cl4.multiple_edit_form);
	$('.js_cl4_check_all_checkbox').on('click', cl4.check_all_checkbox);
	$('.cl4_add_multiple_count').on('change', cl4.add_multiple_form);
	// for checkboxes in tables to add .selected to the row
	$('.js_cl4_row_checkbox').on('change', cl4.row_checked);
	// found in views/cl4/cl4admin/header.php
	$('.js_cl4_model_select_form').on('change', cl4.model_select_change);
	$('.js_cl4_model_select_go').on('click', cl4.model_select_change);
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

base.reload_page = function() {
	window.location.href = window.location.href;
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
