// set the dimensions and margins of the graph
let margin = {top: 20, right: 20, bottom: 30, left: 50};

let width = 960 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;

// create a function to parse the specific date/time format your data is in
let parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
let xScale = d3.scaleTime().range([0, width]); // treat as date/time
let yScale = d3.scaleLinear().range([height, 0]);

// append the svg object to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin so each data point
// will have a common reference point for placement relative to.
let svg = d3.select("body").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Load the data
// the variable 'data' will hold the data
d3.csv("data.csv", function(error, data) {
	if (error) console.log("no data");
		//throw error;

	// format each of the values in the data correctly
	// the variable 'd' holds the current line of data
	data.forEach(function(d) {
		d.date = parseTime(d.date); 
		d.close = +d.close; 	// make this a number, not a string
	});

	// scale the range of the data
	xScale.domain(d3.extent(data, function(d) {return d.date; }));
	yScale.domain([0, d3.max(data, function(d) {return d.close; })]);
	
	// make scatter points, 'dot' is the label for the svg group of them
	svg.selectAll("dot")
			.data(data)
		.enter().append("circle")
			.attr("class", "scatter_points")
			.attr("r", 5)
			.attr("cx", function(d) { return xScale(d.date); })
			.attr("cy", function(d) { return yScale(d.close); });

	// add the x axis
	// call() makes drawing happen
	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(xScale)); // start from the lower left

	// add the y axis
	svg.append("g")
		.call(d3.axisLeft(yScale)); // the default position is (0,0), start there

});
