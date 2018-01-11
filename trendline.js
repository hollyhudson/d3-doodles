// set the dimensions and margins of the graph
let margin = {top: 20, right: 20, bottom: 30, left: 50};

let width = 960 - margin.left - margin.right;
let height = 500 - margin.top - margin.bottom;

// create a function to parse the specific date/time format your data is in
let parseDate = d3.timeParse("%d-%b-%y");

// set the ranges
let xScale = d3.scaleTime().range([0, width]); // treat as date/time
let yScale = d3.scaleLinear().range([height, 0]);

let valueline = d3.line()
	.curve(d3.curveBasis)
	.x(function(d) {return xScale(d.date); })
	.y(function(d) {return yScale(d.close); })

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
		d.date = parseDate(d.date); 
		d.close = +d.close; 	// make this a number, not a string
	});

	let xLabels = data.map(function(d) {return d.date; });

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

	// add a trendline
	// get the x and y values for least squares
	let xSeries = d3.range(1, xLabels.length + 1);
	let ySeries = data.map(function(d) {return d.close; });
	console.log("xSeries = " + xSeries);
	console.log("ySeries = " + ySeries);

	let leastSquaresCoeff = leastSquares(xSeries, ySeries);

	// apply the results to the least squares regression
	let x1 = d3.min(data, function(d) {return d.date; });
	// slope + intercept
	let y1 = leastSquaresCoeff[0] + leastSquaresCoeff[1];
	let x2 = d3.max(data, function(d) {return d.date; });
	let y2 = leastSquaresCoeff[0] * xSeries.length + leastSquaresCoeff[1];
	let trendData = [[x1,y1,x2,y2]];

	// join the trend data to the line
	let trendline = svg.selectAll(".trendline")
		.data(trendData);

	console.log(trendData);

	trendline.enter()
		.append("line")
		.attr("class", "trendline")
		.attr("x1", function(d) { return xScale[0]; })
		.attr("x2", function(d) { return xScale[1]; })
		.attr("y1", function(d) { return xScale[2]; })
		.attr("y2", function(d) { return xScale[3]; })
		.attr("stroke", "black")
		.attr("stroke-width", 1);
});

// Calculate least squares for linear regression trendline
// returns slope, intercept, and r-square of the line
function leastSquares(xSeries, ySeries) {
	let reduceSumFunc = function(prev, cur) { return prev + cur; };
	
	let xBar = xSeries.reduce(reduceSumFunc) * 1.0 / xSeries.length;
	let yBar = ySeries.reduce(reduceSumFunc) * 1.0 / ySeries.length;
	
	let ssXX = xSeries.map(function(d) { return Math.pow(d - xBar, 2); })
        	.reduce(reduceSumFunc);
	let ssYY = ySeries.map(function(d) { return Math.pow(d - yBar, 2); })
        	.reduce(reduceSumFunc);
	let ssXY = xSeries.map(function(d, i) { return (d - xBar) * (ySeries[i] - yBar); })
        	.reduce(reduceSumFunc);
	
	let slope = ssXY / ssXX;
	let intercept = yBar - (xBar * slope);
	let rSquare = Math.pow(ssXY, 2) / (ssXX * ssYY);
	
	return [slope, intercept, rSquare];
}
