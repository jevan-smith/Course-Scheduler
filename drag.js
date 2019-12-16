var drag = d3.drag()
    // used on drag start
    .on('start', function (d) {
        if (event.ctrlKey == true) return;
        // Get this object
        var t = d3.select(this);
        var trans = getTranslation(t.attr('transform'));

        // Sets current objects x pos, and y pos to it's current pos
        this.x = trans[0];
        this.y = trans[1];

        this.cx = trans[0];
        this.cy = trans[1];

        d3.select(this).style("opacity", 0.5)
    })
    // used during drag
    .on('drag', function (d) {
        if (event.ctrlKey == true) return;

        // Changes x and y pos
        this.x += d3.event.dx;
        this.y += d3.event.dy;

        // Move object here
        d3.select(this).attr("transform", "translate(" + this.x + "," + this.y + ")");
    })
    // used on drag end
    .on('end', function (d) {

        if (event.ctrlKey == true) return;
        d3.select(this).style("opacity", 1.0)

        var new_days = [];
        var new_start;
        var new_end;

        // Get this object
        var t = d3.select(this);
        var trans = getTranslation(t.attr('transform'));

        // Sets current objects x pos, and y pos to it's current pos
        this.x = trans[0];
        this.y = trans[1];

        // Calculate Start time.
        var hrs = hours[Math.floor(trans[1] / hourScaleRangeBand)];
        //var min = minutes[Math.floor(trans[1] / minuteScaleRangeBand)];

        // Calculate the correct X position to place the box.
        var da = Math.floor((((dayScale.bandwidth())/2)+(this.x)) / dayScale.bandwidth());
        var x_pos = da * dayScale.bandwidth();
        x_pos += da; // Needed for Alignment, because of graph ticks


        // Calculate the End time, along with added start time and end time to the course json.
        new_start = hrs;
        var end_time = format(hrs);

        if(new_start == null || end_time == null) {
            d3.select(this).transition().attr("transform", "translate(" + this.cx + "," + this.cy + ")").duration(800);
            return;
        }

        end_time.setMinutes(end_time.getMinutes() + courses[d.id].duration);
        new_end = end_time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });

        // Calculates the new days.
        for (let i = 0; i < (courses[d.id].day).length; i++) {
            for (let j = 0; j < days.length; j++) {
                if(days[j] == (original_course[d.id].day[i]))  {
                    if(days[j+da] != null) {
                        new_days.push(days[j+da]);
                        break;
                    }
                }
            }
        }

        let prev_day = courses[d.id].day;
        let prev_start = courses[d.id].time.start;
        let prev_end = courses[d.id].time.end;

        courses[d.id].day = new_days; 
        courses[d.id].time.start = new_start;
        courses[d.id].time.end = new_end;

        if (courses[d.id].day.length != original_course[d.id].day.length) {
            // Set back to original
            courses[d.id].day = prev_day; 
            courses[d.id].time.start = prev_start;
            courses[d.id].time.end = prev_end;
            // redraw, course boxes here
            d3.select(this).transition().attr("transform", "translate(" + this.cx + "," + this.cy + ")").duration(800);

        }
        else if(isColliding(courses[d.id], courses, trans) == false) {
            // redraw, course boxes here
            d3.select(this).transition().attr("transform", "translate(" + x_pos + "," + hourScale(format(courses[d.id].time.start)) + ")").duration(800);
        }
        else {
            // Set back to original
            courses[d.id].day = prev_day; 
            courses[d.id].time.start = prev_start;
            courses[d.id].time.end = prev_end;
            // redraw, course boxes here
            d3.select(this).transition().attr("transform", "translate(" + this.cx + "," + this.cy + ")").duration(800);
        }

    });