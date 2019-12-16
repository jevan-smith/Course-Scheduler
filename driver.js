set_duration(courses);
assign_colors(courses, colors)
const original_course = JSON.parse(JSON.stringify(courses));

svg = d3.select('body').append('svg')
    .call(d3.zoom().on("zoom", function () {
        if (event.ctrlKey == false) return; // User needs to hold CTRL to zoom, and pan
        svg.attr("transform", d3.event.transform)
    }))
    .attr('height', height + margin.top + margin.bottom)
    .attr('width', width + margin.right + margin.left)
    .append('g')
    .attr('transform','translate(' + margin.left + ',' + margin.top + ')');

function makeHourAxis() {
    return d3.axisLeft(hourScale)
}

function makeDayAxis() {
    return d3.axisTop(dayScale)
}

svg.append('g')
    .attr('class', 'hour axis')
    .attr('transform','translate(' + width + ',0)')
    .call(makeHourAxis().ticks(hours.length).tickSize(width, 0, 0).tickFormat(""));

svg.append('g')
    .attr('class', 'hour axis')
    .call(makeHourAxis());

svg.append('g')
    .attr('class', 'day axis')
    .attr('transform', 'translate(' + (dayScale.bandwidth() / 2) + ',' + height + ')')
    .call(makeDayAxis().tickSize(height, 0, 0).tickFormat(""));

svg.append('g')
    .attr('class', 'day axis')
    .call(makeDayAxis().tickSize(0));


var courseGroups = svg.selectAll('g.course')
    .data(courses)
    .enter().append('g')
    .attr("class", function(d, i) {
        return `course-${d.id}`;
    })
    .attr("fill", function(d) {
        return d.color;
    })
    .attr('transform', function(d) {
        return 'translate(' + 0 + ',' + hourScale(format(d.time.start)) + ')';
    })
    .call(drag);

var sections = courseGroups.selectAll('g.section')
    .data(function(d) {
        return d.day.map(function(e){
            return {day: e, time: d.time, abbr: d.abbr};
        });
    })
    .enter().append('g')
    .attr('class','section');

sections.append('rect')
    .attr('class','section')
    .style("cursor", "pointer")
    /*.style("stroke-opacity", .2)
    .style("stroke", 'black')*/
    .attr('y', 0)
    .attr('x', function(d){ return dayScale(d.day); })
    .attr('width', dayScale.bandwidth())
    .attr('height', function(d) {
        return hourScale(format(d.time.end)) - hourScale(format(d.time.start));
    });

sections.append('text')
    .attr('class','course-text')
    //.style('fill', 'white')
    .attr("font-size","10px")
    .attr('y', 15)
    .attr('x', function(d){ return dayScale(d.day) + 5; })
    .text(function(d){ return d.abbr; });