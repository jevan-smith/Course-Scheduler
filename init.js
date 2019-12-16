var original_days = [];
var colors = ['#46D1A1', '#2662AD', '#D95782', '#CF8353', '#AED190', '#26A3AD', '#DB5337', '#CFB853', '#D19099', '#7FAC62', '#DBBA37', '#5397CF', '#D1B48A', '#AB4B4C', '#8757C2', '#379DDB', '#53CF75']

var margin = {top:20, right: 10, bottom: 10, left: 50},
    height = 700 - margin.top - margin.bottom,
    height = 700 - margin.top - margin.bottom,
    width  = 700 - margin.left - margin.right;

var days = ['Monday','Tuesday','Wednesday','Thursday','Friday'];

var hours = ['08:00 AM','08:30 AM','09:00 AM','09:30 AM','10:00 AM','10:30 AM','11:00 AM','11:30 AM','12:00 PM','12:30 PM',
             '01:00 PM','01:30 PM','02:00 PM','02:30 PM','03:00 PM','03:30 PM','04:00 PM','04:30 PM','05:00 PM','05:30 PM','06:00 PM',
             '06:30 PM','07:00 PM','07:30 PM','08:00 PM','08:30 PM','09:00 PM','09:30 PM'];

var hourScaleRangeBand = height / hours.length;
var format = d3.timeParse("%I:%M %p");
var d3datehours = hours.map(format);

var dayScale = d3.scaleBand()
    .domain(days)
    .rangeRound([0, width])
    .padding(0.01);

var hourScale = d3.scaleTime()
    .domain([d3datehours[0], d3datehours[27]])
    .rangeRound([0, height]);