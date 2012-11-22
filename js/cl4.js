// create the cl4 object
var cl4 = {};

// stores the count of the number of records checked
cl4.multiple_edit_count = 0;

/**
* Set the form action based on the source button input data-cl4_form_action parameter.
* This is used when you click on the top row buttons in editable list (eg. Search, Add New, Edit Selected, etc.)
*/
cl4.button_link_form = function() {
	var button_form_action = $(this).data('cl4_form_action');
	if (button_form_action) {
		$(this.form).attr('action', button_form_action);
		$(this.form).attr('target', $(this).data('cl4_form_target'));
	}
};

/**
* Go to another URL based on the data-cl4_link parameter
*/
cl4.button_link = function() {
	link = $(this).data('cl4_link');
	if (link) window.location = link;
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
	$count_select = $(this);
	$add_multiple_button = $('#' + $count_select.data('cl4_add_multiple_related_button'));
	$add_multiple_button.data('cl4_form_action', $add_multiple_button.data('cl4_add_multiple_form_action_prefix') + '/' + $count_select.val());
};

/**
* Determines if the multiple edit buttons should be disabled or not based on the checkboxes checked in the form.
*/
cl4.multiple_edit_form = function() {
	if ($('.cl4_multiple_edit_form_checkbox:checked').length > 0) {
		// checkboxes have been checked, so remove the disabled attributed
		$('.cl4_multiple_edit, .cl4_export_selected').removeAttr('disabled');
	} else {
		// no checkboxes have been checked, so add the disabled attribute
		$('.cl4_multiple_edit, .cl4_export_selected').attr('disabled', 'disabled');
	}
};

/**
* Checks all the checkboxes that have the class found in the data attribute data-cl4_check_all_checkbox_class
*/
cl4.check_all_checkbox = function() {
	$checkbox = $(this);
	if ($checkbox.filter(':checked').length > 0) {
		// trigger change so that any functionality related to the checkbox changing value will be triggered
		$('.' + $checkbox.data('cl4_check_all_checkbox_class')).attr('checked', 'checked').change();
	} else {
		$('.' + $checkbox.data('cl4_check_all_checkbox_class')).removeAttr('checked').change();
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

/**
* Checks all the checkboxes, used in get_editable_list()
*/
cl4.check_all = function(f, name, checked) {
	if (arguments.length == 2) { checked = true; }
	count = 0;
	var form = GetById(f);
	var children = GetByTagName(f, "input");
	for (i = 0; i < children.length; i++) {
		if (children[i].type == "checkbox") {
			if (!name || children[i].name == name) {
				children[i].checked = checked;
				if (children[i].checked) count++;
			}
		}
	}

	if (checked) {
		return count-1;
	} else {
		return 0;
	}
};

cl4.click_multiple_edit = function(checked) {
	if (checked) {
		++ cl4.multiple_edit_count;
	} else {
		-- cl4.multiple_edit_count;
	}
	var button = document.getElementById('submit_multiple_edit');
	if (button) {
		if (cl4.multiple_edit_count) {
			button.removeAttribute('disabled');
		} else {
			button.setAttribute('disabled', 'disabled');
		}
	}

	if (!checked) {
		// if a checkbox has been unchecked, then uncheck the check all checkbox
		c = document.getElementById('c_check_all');
		if (c) {
			c.checked = false;
		}
	}
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
		$('.cl4_date_field-date').datepicker();
	}

	// buttons and checkbox at the top of an editable list
	$('.cl4_button_link_form').click(cl4.button_link_form);
	$('.cl4_button_link').click(cl4.button_link);
	$('.cl4_multiple_edit').click(cl4.multiple_edit);
	$('.cl4_export_selected').click(cl4.export_selected);
	$('.cl4_multiple_edit_form').change(cl4.multiple_edit_form);
	$('.cl4_check_all_checkbox').click(cl4.check_all_checkbox);
	$('.cl4_add_multiple_count').change(cl4.add_multiple_form);

	// for checkboxes in tables to add .selected to the row
	$('.cl4_row_checkbox').change(cl4.row_checked);

	// found in views/cl4/cl4admin/header.php
	$('#cl4_model_select_form').change(cl4.model_select_change);
	$('#cl4_model_select_go').click(cl4.model_select_change);
});

// get a reference to an element by id
function GetById(id) {
	if (typeof id == "string") {
		return document.getElementById(id);
	} else {
		return id;
	}
}

// retrieves a list of all child tags with the appropriate name
function GetByTagName(tag, name) {
	if (arguments.length == 1) {
		return document.getElementsByTagName(tag);
	} else {
		var t = GetById(tag);
		if (! t) { return false; }
		return t.getElementsByTagName(name);
	}
}