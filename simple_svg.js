// Hardcode the chart's width and the height of the bars
let width = 506,
barHeight = 34;

// x is set to a scalable d3 object of some sort
// where the range starts out as the hardcode value we set above
let x = d3.scaleLinear()
	.range([0, width]);

// So.. is this the frame for the chart?
// How is it different from the line above?
let chart = d3.select(".chart")
	.attr("width", width);

// Load the data
// Take the scalable d3 object and scale it based on the maximum value
// in the data?
// Also, notice the 'type' function, we use this to cast the data to
// the correct type because d3 doesn't know how to do this.
d3.tsv("data.tsv", type, function(error, data) {

	x.domain([0, d3.max(data, function(d) { return d.value; })]);

	// The height of the chart is set 
	// based on the number of entries in the data
	chart.attr("height", barHeight * data.length);

	// Where tf did "g" get defined?
	// If you do selectAll("g") on a d3 object do you get an svg group of
	// .. things? for all the, bars in this case, but data points
	// in the general case?
	// so the call to data(data).enter("g") is the data join, mapping the data
	// onto the items in the group?
	// looks like you get an empty group of stuff your want associated with
	// each data point.  So in this case a rect and the text on the rect.
	let bar = chart.selectAll("g")
		.data(data)
	.enter().append("g")
		.attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

	// 'bar' is what we're calling the grouped features of a data point
	bar.append("rect")
		.attr("width", function(d) { return x(d.value); })
		.attr("height", barHeight - 1);

	bar.append("text")
		.attr("x", function(d) { return x(d.value) - 3; })
		.attr("y", barHeight / 2)
		.attr("dy", ".35em")
		.text(function(d) { return d.value; });
});

function type(d) {
	d.value = +d.value; // coerce to number
	return d;
}

