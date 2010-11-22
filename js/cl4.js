var cl4 = function() {}

/**
* Set the form action based on the source button input data-cl4_form_action parameter.
* This is used when you click on the top row buttons in editable list (eg. Search, Add New, Edit Selected, etc.)
*/
cl4.button_link_form = function() {
	button_form_action = $(this).data('cl4_form_action');
	if (button_form_action) $(this.form).attr('action', button_form_action);
} // function

/**
* Go to another URL based on the data-cl4_link parameter
*/
cl4.button_link = function() {
	link = $(this).data('cl4_link');
	if (link) window.location = link;
} // function

cl4.multiple_edit = function() {
	// do some checking to make sure records are checked
}

cl4.export_selected = function() {
	// do some checking to make sure records are checked
}

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
} // function

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
} // function

/**
* Adds the class selected to the row when the checkbox is checked
*/
cl4.row_checked = function() {
	if ($(this).attr('checked')) {
		$(this).parents('tr').addClass('selected');
	} else {
		$(this).parents('tr').removeClass('selected');
	}
} // function

/**
* When the model is changed or the go button is clicked at the top of the page this will be triggered
* Redirects the user to the selected model
*/
cl4.model_select_change = function() {
	window.location = '/dbadmin/' + $('#cl4_model_select').val() + '/index';
}

// everything above this has been cleaned up and is used *******************************

cl4.export_records = function() {
}

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
}

cl4.click_multiple_edit = function(checked) {
    if (checked) {
        MULTIPLE_EDIT++;
    } else {
        MULTIPLE_EDIT--;
    }
    var button = document.getElementById('submit_multiple_edit');
    if (button) {
        if (MULTIPLE_EDIT) {
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
}

// defaults for the date picker; these are necessary so the date picker within cl4 work
$.datepicker.setDefaults({
    dateFormat: 'yy-mm-dd',
    buttonImage: '/cl4/images/calendar.gif',
    buttonImageOnly: true
});

$(function() {
	// adding the date picker to date fields
	$('.cl4_date_field-date').datepicker();

	// buttons and checkbox at the top of an editable list
	$('.cl4_button_link_form').click(cl4.button_link_form);
	$('.cl4_button_link').click(cl4.button_link);
	$('.cl4_multiple_edit').click(cl4.multiple_edit);
	$('.cl4_export_selected').click(cl4.export_selected);
	$('.cl4_multiple_edit_form').change(cl4.multiple_edit_form);
	$('.cl4_check_all_checkbox').click(cl4.check_all_checkbox);

	// for checkboxes in tables to add .selected to the row
	$('.cl4_row_checkbox').change(cl4.row_checked);

	// found in claeroadmin/header.php
	$('#cl4_model_select_form').change(cl4.model_select_change);
	$('#cl4_model_select_go').click(cl4.model_select_change);
});

// ****************************************************************************************************
// 20100831 CSN need to establish if anyting below here should stay, move above this comment if it should...

var MULTIPLE_EDIT = 0;

// invoked when a user clicks the checkbox to either expire or delete a record
function SetExpireFlag(b) {
  var confirmDeleteForm = document.forms['confirm_delete'];
  if (b) {
      confirmDeleteForm.expiryFlag.value = 1;
  } else {
      confirmDeleteForm.expiryFlag.value = 0;
  }
//    f.submit();
}

function clickContentBox(box, trueValue, falseValue) {
    var pattern = box.id.replace(/checkbox_/, "");
    var checkbox = get(pattern);
    if (! checkbox) {
        alert('System error - this field may not be updated in the database');
    }
    if (box.checked) {
        checkbox.value = trueValue;
    } else {
        checkbox.value = falseValue;
    }
}

function confirmDelete(name) {
//    input_box=confirm("Are you sure you want to remove '" + name + "' ?");
//    if (input_box==true) {
        return true;
//    }
}


function CountCheckboxes(theForm, name) {
    count = 0;
    for (i=0,n=theForm.elements.length-1;i<n;i++) {
        if (theForm.elements[i].name.indexOf(name) !=-1 && theForm.elements[i].checked == true) count ++;
    }
    return count;
}

function CancelForm(theForm, url) {
    // no url was passed, so submit the form
    if (arguments.length == 1) {
        theForm.user_action.value = "cancel";
        theForm.submit();
    // a url was passed, so use that to redirect the browser
    } else {
        document.location = url;
    }
}

function CheckAllCheckBoxes(f, name, checked) {
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
}

/******************    helper functions    ******************/

// returns the number of checkboxes that are child elements of f and that are checked
/* long and complicated
function CountCheckedBoxes(f, name) {
    var count = 0;
    var children = GetByTagName(f, "input");
    for (var i = 0; i < children.length; i++) {
    alert(children[i].type);continue;
        if (children[i].type == "checkbox" && children[i].checked) {
            if (name) {
                if (children[i].name == name) {
                    count++;
                }
            } else {
                count++;
            }
        }
    }
    return count;
}
*/

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

/** the next 2 functions are for dealing with 1 to multiple edits **/
function AddMultipleRow(formId, table) {
    f = document.getElementById(formId);
    a = document.getElementById('c_add_row');
    if (f && a) {
        a.value = table;
        f.submit();
    } else {
        alert('There was an error while adding a new row.');
    }
}

function RemoveMultipleRow(rowId, deleteFlag) {
    r = document.getElementById(rowId);
    f = document.getElementById(deleteFlag);
    if (r && f) {
        r.style.display = 'none';
        f.value = 1;
    }
}