$(function() {
	$('#create_model').click(function() {
		$('#m_table_name').change();
	});

	$('#db_group').change(function() {
		window.location.search = '?db_group=' + $(this).val();
	});

	$('#table_name').change(function() {
		$.get('/dbadmin/' + $(this).val() + '/create?db_group=' + $('#db_group').val(), function(data) {
			$('#model_code_container').val(data);
		});
	});
});