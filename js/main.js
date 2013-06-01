function startSearch(){
	$("#legSearchBtn").attr("disabled", "disabled");
	var searchPromise = search();

	searchPromise.done(function(){
		$("#legSearchBtn").removeAttr("disabled");
	});
}

function search () {
	var def = $.Deferred();

	$("[id^='results']").remove();
	var searchQuery = $("#legSearch")[0].value;

	var searchURL = 'http://openstates.org/api/v1/bills/?state=mn&q=' + searchQuery + '&apikey=e74b1e987eec45f8ba07ef58c54a231a';

   $.getJSON(searchURL + "&callback=?", null, function(bills) {
		console.log(bills);
		def.resolve(); 
    });

   return def.promise();
}