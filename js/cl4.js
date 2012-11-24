// create the cl4 object
var cl4 = {};

// stores the count of the number of records checked
cl4.multiple_edit_count = 0;

/**
* Set the form action based on the source button input data-cl4_form_action parameter.
* This is used when you click on the top row buttons in editable list (eg. Search, Add New, Edit Selected, etc.)
*/
cl4.button_link_form = function() {
	var button_form_action = $(this).data('cl4_form_action'),
		form,
		form_target;
	if (button_form_action) {
		form = $(this.form);
		form.attr('action', button_form_action);

		// check to see if we have a target
		// if we don't, "unset" the target on the form
		form_target = $(this).data('cl4_form_target');
		if (form_target) {
			form.attr('target', form_target);
		} else {
			form.attr('target', '');
		}
	}
};

/**
* Go to another URL based on the data-cl4_link parameter
*/
cl4.button_link = function() {
	var link = $(this).data('cl4_link');
	if (link) {
		window.location = link;
	}
};

cl4.multiple_edit = function() {
	// do some checking to make sure records are checked
};

cl4.export_selected = function() {
	// do some checking to make sure records are checked
};

/**
* For adding multiple records, uses cl4_add_multiple_related_button on the select and cl4_add_multiple_form_action_prefix on the button
*/
cl4.add_multiple_form = function() {
	var count_select = $(this),
		// unfortunately we "have" to use an ID because there is the possibility of there being multiple buttons on the same page
		add_multiple_button = $('#' + count_select.data('cl4_add_multiple_related_button')),
		add_multiple_form_action_prefix = add_multiple_button.data('cl4_add_multiple_form_action_prefix');
	add_multiple_button.data('cl4_form_action', add_multiple_form_action_prefix + '/' + count_select.val());
};

/**
* Determines if the multiple edit buttons should be disabled or not based on the checkboxes checked in the form.
*/
cl4.multiple_edit_form = function() {
	if ($('.js_cl4_multiple_edit_form_checkbox:checked').length > 0) {
		// checkboxes have been checked, so remove the disabled attributed
		$('.js_cl4_multiple_edit, .js_cl4_export_selected').removeAttr('disabled');
	} else {
		// no checkboxes have been checked, so add the disabled attribute
		$('.js_cl4_multiple_edit, .js_cl4_export_selected').attr('disabled', 'disabled');
	}
};

/**
* Checks all the checkboxes that have the class found in the data attribute data-cl4_check_all_checkbox_class
*/
cl4.check_all_checkbox = function() {
	var checkbox = $(this);
	if (checkbox.filter(':checked').length > 0) {
		// trigger change so that any functionality related to the checkbox changing value will be triggered
		$('.' + checkbox.data('cl4_check_all_checkbox_class')).attr('checked', 'checked').change();
	} else {
		$('.' + checkbox.data('cl4_check_all_checkbox_class')).removeAttr('checked').change();
	}
};

/**
* Adds the class selected to the row when the checkbox is checked
*/
cl4.row_checked = function() {
	if ($(this).attr('checked')) {
		$(this).parents('tr').addClass('selected');
	} else {
		$(this).parents('tr').removeClass('selected');
	}
};

/**
* When the model is changed or the go button is clicked at the top of the page this will be triggered
* Redirects the user to the selected model
*/
cl4.model_select_change = function() {
	window.location = '/dbadmin/' + $('#cl4_model_select').val() + '/index';
};

if (typeof $.datepicker != 'undefined') {
	// defaults for the date picker; these are necessary so the date picker within cl4 work
	$.datepicker.setDefaults({
		dateFormat: 'yy-mm-dd',
		buttonImage: '/cl4/images/calendar.gif',
		buttonImageOnly: true
	});
}

$(function() {
	if (typeof $.datepicker != 'undefined') {
		// adding the date picker to date fields
		$('.js_cl4_date_field-date').datepicker();
	}

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
});