var results;

function startSearch(){
	$("#legSearchBtn").attr("disabled", "disabled");
	$("#results").empty();

	var searchPromise = search();
	searchPromise.done(function(){
		var displayPromise = displayResults();

		displayPromise.done(function(){
			$("#legSearchBtn").removeAttr("disabled");
		});
	});
}

function search () {
	var def = $.Deferred();

	var searchQuery = $("#legSearch")[0].value;
	var searchURL = 'http://openstates.org/api/v1/bills/?state=mn&q=' + searchQuery + '&apikey=e74b1e987eec45f8ba07ef58c54a231a';

   $.getJSON(searchURL + "&callback=?", null, function(bills) {
		results = bills;
		def.resolve(); 
    });

   return def.promise();
}

function displayResults(){
	var def = $.Deferred();

	var resultsDiv = d3.select("#results");

	resultsDiv.append("h2")
	.text("There are " + results.length + " results.");

	results = d3.nest()
        .key(function(d) {return d.session;})
        .entries(results);

    resultsDiv.selectAll("div")
		.data(results)
		.enter()
		.append("div")
		.classed("sessionHead", true)
		.attr("id", function(d){return "session" + d.key;})
		.on("click", function(d){toggleHeader("session" + d.key);})
		.text(function(d){return "+ Session: " + d.key + " (" + d.values.length + " results)";});

	for (var i = 0; i < results.length; i++) {
		var parentDiv = d3.select("#session" + results[i].key);

		parentDiv.selectAll("div")
		.data(results[i].values)
		.enter()
		.append("div")
		.attr("id", function(d,i){return "session" + d.session + "-" + i ;})
		.classed("result", true)
		.text(function(d){return d.title;});
	}

    console.log(results);

	def.resolve();
	return def.promise();
}

function toggleHeader(header){
	$("div[id^='" + header + "']").show();
}