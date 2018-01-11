// set the dimensions and margins of the graph
// make a margin object to make the margins easier to work with later
let margin = {top: 20, right: 20, bottom: 30, left: 50};

// See, now the margins are easier to work with
let width = 960 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;

// create a function to parse the specific date/time format your data is in
let parseTime = d3.timeParse("%d-%b-%y");

// set the ranges
let x = d3.scaleTime().range([0, width]); // treat as date/time
let y = d3.scaleLinear().range([height, 0]);

// Define the line, create an array of x,y coordinates as part of the d3 obj.
// This array will be used to define an svg path later. 
// Note that we don't actually have data yet, we're just saying what to do
// with the data to make the array once it arrives.
let valueline = d3.line()
	.x(function(d) {return x(d.date); }) 	
	.y(function(d) {return y(d.close); }); 

// Make a curvier line
let basisline = d3.line()
	.curve(d3.curveBasis)
	.x(function(d) {return x(d.date); }) 	
	.y(function(d) {return y(d.close); }); 

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
	x.domain(d3.extent(data, function(d) {return d.date; }));
	y.domain([0, d3.max(data, function(d) {return d.close; })]);
	
	// add an svg path using the valueline array for coordinates
	// the .data([data]) line joins the data to the path element
	svg.append("path")
		.data([data])
		.attr("class", "line")
		.attr("d", valueline);

	// add the basis line (curvy line)
	svg.append("path")
		.data([data])
		.attr("class", "line")
		.attr("d", basisline);

	// add the x axis
	// call() makes drawing happen
	svg.append("g")
		.attr("transform", "translate(0," + height + ")")
		.call(d3.axisBottom(x)); // start from the lower left

	// add the y axis
	svg.append("g")
		.call(d3.axisLeft(y)); // the default position is (0,0), start there

});
