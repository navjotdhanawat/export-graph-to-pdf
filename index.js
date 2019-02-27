const D3Node = require('d3-node')

const options = { selector: '#chart', container: '<style>.line{fill:none;stroke:green;stroke-width:5px;}</style><div id="container"><div id="chart"></div></div>' }
const d3n = new D3Node(options)
const d3 = d3n.d3

var fs = require('fs');
var pdf = require('dynamic-html-pdf');
// var html = fs.readFileSync('template.html', 'utf8');



// set the dimensions and margins of the graph
var margin = { top: 20, right: 20, bottom: 30, left: 50 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function (d) { return x(d.year); })
    .y(function (d) { return y(d.population); });

let svg = d3.select(d3n.document.querySelector('#chart')).append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g").attr("transform",
    "translate(" + margin.left + "," + margin.top + ")");


// format the data
let data = [{ "year": "2006", "population": "40" }, { "year": "2008", "population": "45" }, { "year": "2010", "population": "48" }, { "year": "2012", "population": "51" }, { "year": "2014", "population": "53" }, { "year": "2016", "population": "57" }, { "year": "2017", "population": "62" }];
data.forEach(function (d) {
    d.year = d.year;
    d.population = +d.population;
});

// Scale the range of the data
x.domain(d3.extent(data, function (d) { return d.year; }));
y.domain([0, d3.max(data, function (d) { return d.population; })]);

// Add the valueline path.
svg.append("path")
    .data([data])
    .attr("class", "line")
    .attr("d", valueline);

// Add the X Axis
svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

// Add the Y Axis
svg.append("g")
    .call(d3.axisLeft(y));

// let svgStr = d3n.svg()
let html = d3n.html();


var pdfOptions = {
    format: "A3",
    orientation: "portrait",
    border: "10mm"
};

var document = {
    type: 'file',     // 'file' or 'buffer'
    template: html,
    context: {},
    path: "./output.pdf"    // it is not required if type is buffer
};

pdf.create(document, pdfOptions)
    .then(res => {
        console.log(res)
    })
    .catch(error => {
        console.error(error)
    });