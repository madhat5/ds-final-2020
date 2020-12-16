// console.log('sim sim salabim')
// set the dimensions and margins of the graph
let margin = {
        top: 10,
        right: 20,
        bottom: 30,
        left: 50
    },
    width = 1200 - margin.left - margin.right,
    height = 520 - margin.top - margin.bottom;

// ---------------------------//
//       TOOLTIP      //
// ---------------------------//

// -1- Create a tooltip div that is hidden by default:
let tooltip = d3.select("#chart")
    .append("div")
    .attr("class", "tooltip")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("background-color", "rgba(1, 51, 105, 0.75)")
    // .style("background-color", "#013369")
    .style("border-radius", "5px")
    .style("padding", "10px")
    .style("color", "white")
    .style("width", "100px")
    .style("font", "12px Helvetica")

// -2- Create 3 functions to show / update (when mouse move but stay on same circle) / hide the tooltip
let showTooltip = function (d) {
    tooltip
        .transition()
        .duration(200)
    tooltip
        .style("visibility", "visible")
        .html(
            "date: " + d.date + "<br>" +
            // "time: " + d.time + "<br>" +
            "weight: " + d.weight + "<br>" +
            "temp: " + d.temp + "<br>" +
            "hrs_slept: " + d.hrs_slept)
}
let moveTooltip = function (d) {
    return tooltip.style("top", (d3.event.pageY - 10) + "px").style("left", (d3.event.pageX + 10) + "px");
}
let hideTooltip = function (d) {
    return tooltip.style("visibility", "hidden");
}

// ---------------------------//
//       HIGHLIGHT GROUP      //
// ---------------------------//

// What to do when one group is hovered
var highlight = function (d) {
    // reduce opacity of all groups
    d3.selectAll(".bubbles").style("opacity", .05)
    // expect the one that is hovered
    d3.selectAll("." + d).style("opacity", 1)
}

// And when it is not hovered anymore
var noHighlight = function (d) {
    d3.selectAll(".bubbles").style("opacity", 1)
}

// append the svg object to the body of the page
let svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

let svgTwo = d3.select("#blog-legend")
    .append("svg")
    .attr("width", (width / 2) + margin.left + margin.right)
    .attr("height", (height / 2) + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + -375 + "," + 0 + ")");

//Read the data
d3.json("../data/blog-data.json", (data) => {
    // console.log(data)

    let dateCheck = d3.range(data.length).map((d, i) => {
        return {
            date: new Date(data[i].date)
        }
    });
    // console.log(dateCheck)

    // Add X axis
    let x = d3.scaleLinear()
        .domain([0, data.length])
        .range([0, width]);
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add Y axis
    let y = d3.scaleLinear()
        .domain([94, 100])
        .range([height, 0]);
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add a scale for bubble size
    let z = d3.scaleLinear()
        .domain([150, 170])
        .range([1, 20]);

    // Add a scale for bubble color
    let myColor = d3.scaleOrdinal()
        .domain([0, 1, 2])
        .range(d3.schemeSet1);

    // Add dots
    svg.append('g')
        .selectAll("dot")
        .data(data)
        .enter()
        .append("circle")
        .attr("class", function (d) {
            let hm = d.hrs_slept; // your input string
            let a = hm.split(':'); // split it at the colons

            // Hours are worth 60 minutes.
            let minutes = (+a[0]) * 60 + (+a[1]);
            // console.log(minutes);

            if (minutes < 420) {
                return "bubbles " + "underslept"
            } else if (minutes >= 420 && minutes <= 480) {
                return "bubbles " + "regular"
            } else if (minutes > 480) {
                return "bubbles " + "overslept"
            }
        })
        .attr("cx", (d, i) => {
            // console.log(dateCheck[i])
            return x(i);
        })
        .attr("cy", (d) => {
            return y(d.temp);
        })
        .attr("r", (d) => {
            return z(d.weight);
        })
        .style("fill", function (d) {
            let hm = d.hrs_slept; // your input string
            let a = hm.split(':'); // split it at the colons

            // Hours are worth 60 minutes.
            let minutes = (+a[0]) * 60 + (+a[1]);
            // console.log(minutes);

            if (minutes < 420) {
                return myColor(0);
            } else if (minutes >= 420 && minutes <= 480) {
                return myColor(1);
            } else if (minutes > 480) {
                return myColor(2);
            }
        })
        // .style("opacity", "0.7")
        .attr("stroke", "white")
        .attr('stroke-width', "1px")
        .on("mouseover", showTooltip)
        .on("mousemove", moveTooltip)
        .on("mouseout", hideTooltip);


    // ---------------------------//
    //       LEGEND              //
    // ---------------------------//
    // Add one dot in the legend for each name.
    let size = 20
    let tempColor = [400, 440, 500]
    let allgroups = ["underslept", "regular", "overslept"]
    svgTwo.selectAll("myrect")
        .data(allgroups)
        .enter()
        .append("circle")
        .attr("cx", 390)
        .attr("cy", function (d, i) {
            return 10 + i * (size + 5)
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .attr("r", 7)
        .style("fill", function (d, i) {
            // console.log(d)
            if (tempColor[i] < 420) {
                return myColor(0);
            } else if (tempColor[i] >= 420 && tempColor[i] <= 480) {
                return myColor(1);
            } else if (tempColor[i] > 480) {
                return myColor(2);
            }
            // return myColor(tempColor[i])
        })
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

    // Add labels beside legend dots
    svgTwo.selectAll("mylabels")
        .data(allgroups)
        .enter()
        .append("text")
        .attr("x", 390 + size * .8)
        .attr("y", function (d, i) {
            return i * (size + 5) + (size / 2)
        }) // 100 is where the first dot appears. 25 is the distance between dots
        .style("fill", function (d, i) {
            // console.log(d)
            if (tempColor[i] < 420) {
                return myColor(0);
            } else if (tempColor[i] >= 420 && tempColor[i] <= 480) {
                return myColor(1);
            } else if (tempColor[i] > 480) {
                return myColor(2);
            }
            // return myColor(tempColor[i])
        })
        .text(function (d) {
            return d
        })
        .attr("text-anchor", "left")
        .style("alignment-baseline", "middle")
        .on("mouseover", highlight)
        .on("mouseleave", noHighlight)

})