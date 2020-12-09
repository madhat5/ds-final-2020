// console.log('sim sim salabim')

let dataModel = [{
    name: "davidGuess",
    values: [{
        time: "timestamp",
        values: 000
    }]
}, ]

// set the dimensions and margins of the graph
let margin = {
        top: 10,
        right: 100,
        bottom: 30,
        left: 30
    },
    width = 1000 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
let svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

//Read the data
d3.json("/data/sensor-data.json", (data) => {
    // console.log(data)

    // List of groups
    let allGroup = ["davidGuess", "assaneGuess", "actualRes"]

    // Reformat the data: we need an array of arrays of {x, y} tuples
    let dataReady = allGroup.map((grpName) => {
        return {
            name: grpName,
            values: data.map((d, i) => {
                return {
                    time: i,
                    // time: d.timeStamp
                    value: +d[grpName]
                };
            })
        };
    });
    console.log(dataReady)

    // A color scale: one color for each group
    let myColor = d3.scaleOrdinal()
        .domain(allGroup)
        .range(d3.schemeSet2);

    // Add X axis --> it is a date format
    let x = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    let y = d3.scaleLinear()
        .domain([69, 79])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add the lines
    let line = d3.line()
        .x((d) => {
            return x(+d.time)
        })
        .y((d) => {
            return y(+d.value)
        })
    svg.selectAll("myLines")
        .data(dataReady)
        .enter()
        .append("path")
        .attr("d", (d) => {
            return line(d.values)
        })
        .attr("stroke", (d) => {
            return myColor(d.name)
        })
        .style("stroke-width", 4)
        .style("fill", "none")

    // Add the points
    svg
        // First we need to enter in a group
        .selectAll("myDots")
        .data(dataReady)
        .enter()
        .append('g')
        .style("fill", (d) => {
            return myColor(d.name)
        })
        // Second we need to enter in the 'values' part of this group
        .selectAll("myPoints")
        .data((d) => {
            return d.values
        })
        .enter()
        .append("circle")
        .attr("cx", (d) => {
            return x(d.time)
        })
        .attr("cy", (d) => {
            return y(d.value)
        })
        .attr("r", 5)
        .attr("stroke", "white")

    // Add a legend at the end of each line
    svg
        .selectAll("myLabels")
        .data(dataReady)
        .enter()
        .append('g')
        .append("text")
        .datum((d) => {
            return {
                name: d.name,
                value: d.values[d.values.length - 1]
            };
        }) // keep only the last value of each time series
        .attr("transform", (d) => {
            return "translate(" + x(d.value.time) + "," + y(d.value.value) + ")";
        }) // Put the text at the position of the last point
        .attr("x", 12) // shift the text a bit more right
        .text((d) => {
            return d.name;
        })
        .style("fill", (d) => {
            return myColor(d.name)
        })
        .style("font-size", 15)
})