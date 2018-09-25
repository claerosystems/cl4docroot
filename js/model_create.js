$(function() {
    $('#create_model').click(function() {
        $('#table_name').change();
    });

    $('#db_group').change(function() {
        window.location.search = '?db_group=' + $(this).val();
    });

    $('#table_name').change(function() {
        $.get('/model_create/' + $(this).val() + '/create?c_ajax=1&db_group=' + $('#db_group').val(), function(return_data) {
            if (cl4.process_ajax(return_data)) {
                $('#model_code_container').val(return_data.model_code);
            } else {
                $('#model_code_container').val('There was a problem generating the model.');
            }
        });
    });
});