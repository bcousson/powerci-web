$(document).ready(function(){
	$("#mainTab select").change(function() {
		$(this).closest('td').prev('td').prev('td').text(Math.round(parseFloat($(this).closest('td').prev('td').prev('td').text()) * 2).toFixed(2));
	});
});
