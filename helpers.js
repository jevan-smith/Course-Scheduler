Object.size = function(obj) {
    var size = 0, key;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};

function getTranslation(transform) {
    // Create a dummy g for calculation purposes only. This will never
    // be appended to the DOM and will be discarded once this function 
    // returns.
    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    
    // Set the transform attribute to the provided string value.
    g.setAttributeNS(null, "transform", transform);
    
    // consolidate the SVGTransformList containing all transformations
    // to a single SVGTransform of type SVG_TRANSFORM_MATRIX and get
    // its SVGMatrix. 
    var matrix = g.transform.baseVal.consolidate().matrix;
    
    // As per definition values e and f are the ones for the translation.
    return [matrix.e, matrix.f];
  }

  function assign_colors(list, color_list) {
    for(let i = 0; i < list.length; i++) {
        list[i].color = color_list[Math.floor(Math.random() * color_list.length)];
        let random_color = Math.floor(Math.random() * color_list.length);
        list[i].color = color_list[random_color];
        color_list.splice(random_color, 1); // remove color so its not selected again
    }
}

function set_duration(list) {
    for(let i = 0; i < list.length; i++) {
        list[i].duration = (format(list[i].time.end) - format(list[i].time.start)) / 60000;
    }
}

function isColliding(course, otherCourses, trans) {
    return _.chain(otherCourses).map(function(otherCourse) {
        if (course.id != otherCourse.id) {
            if (_.intersection(course.day, otherCourse.day).length > 0){
                var otherStart = hourScale(format(otherCourse.time.start))+20;
                var otherEnd = hourScale(format(otherCourse.time.end));
                var thisStart = trans[1];
                var thisEnd = trans[1] + course.duration;
                //var thisEnd = trans[1] + (hourScale(format(course.time.end)) - hourScale(format(course.time.start)));
                return ((thisStart < otherStart && thisEnd > otherStart) || (thisStart > otherStart && thisStart < otherEnd));
            } 
            else {
                return false;
            }
        } 
        else {
            return false;
        }
    }).contains(true).value();
}