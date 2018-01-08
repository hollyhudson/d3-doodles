// set the dimensions and margins of the graph
// make a margin object to make the margins easier to work with later
let margin = {top: 20, right: 20, bottom: 30, left: 50};

// See, now the margins are easier to work with
let width = 960 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;

// parse the date/time
var parseTime = d3.timeParse("%d-%b-%y");

// Load the data
d3.csv("data.csv", function(error, data) {
	if (error) throw error;

	// format the data
	data.forEach(function(d) {
		d.date = parseTime(d.date); 
		d.close = +d.close; 	// make this a number
	});
});)
