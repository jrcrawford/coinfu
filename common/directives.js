angular.module('coinfu.directives', [])
    .directive('cfGauge', [function() {
        "use strict";

        return {
            //Initialise gauges to default
            link: function(scope, element, attrs){

                // Gather IDs
                var gId = element.prop('id'); // Gauge container id e.g. cf-gauge-1
                var gcId = $('canvas', element).prop('id'); // Gauge canvas id e.g. cf-gauge-1-g
                var gmId = $('.metric', element).prop('id'); // Gauge metric id e.g. cf-gauge-1-m

                //Create a canvas
                var ratio = 2.1;
                var width = $('.canvas',element).width();
                var height = Math.round(width/ratio);
                $('canvas', element).prop('width', width).prop('height', height);

                // Set options
                var rGopts = {};
                rGopts.lineWidth = 0.30;
                rGopts.strokeColor = gaugeTrackColor;
                rGopts.limitMax = true;
                rGopts.colorStart = gaugeBarColor;
                rGopts.percentColors = void 0;
                rGopts.pointer = {
                    length: 0.7,
                    strokeWidth: 0.035,
                    color: gaugePointerColor
                };

                // Create gauge
                cf_rGs[gId] = new Gauge(document.getElementById(gcId)).setOptions(rGopts);
                cf_rGs[gId].setTextField(document.getElementById(gmId));

                // Set up values for gauge (in reality it'll likely be done one by one calling the function, not from here)
                scope.$watch(attrs.cfGauge, function(value) {
                    var updateOpts = {'minVal':0,'maxVal':Math.round(value*2),'newVal':value};
                    gaugeUpdate(gId, updateOpts);
                });

                /*
                 *	Set or update a Gauge
                 *	@param gauge string ID of gauge container
                 *	@param opts	object JSON object of options
                 */
                function gaugeUpdate(gauge, opts){
                    if(opts.minVal || opts.minVal === 0){
                        $('.val-min .metric-small', $('#'+gauge)).html(opts.minVal);
                        cf_rGs[gauge].minValue = opts.minVal;
                    }
                    if(opts.maxVal){
                        cf_rGs[gauge].maxValue = opts.maxVal;
                        $('.val-max .metric-small', $('#'+gauge)).html(opts.maxVal);
                    }
                    if(opts.newVal){
                        cf_rGs[gauge].set(opts.newVal);
                    }
                }

                // Responsiveness
                $(window).resize(function(){

                    //Get canvas measurements
                    var ratio = 2.1;
                    var gauge = $('#'+gId);
                    var width = $('.canvas', gauge).width();
                    var height = Math.round(width/ratio);

                    cf_rGs[gId].ctx.clearRect(0, 0, width, height);
                    $('canvas', gauge).width(width).height(height);
                    cf_rGs[gId].render();
                });
            }
        };
    }])


    .directive('cfRag', [function() {
        "use strict";

        return {
            link: function(scope, element, attrs){
                    scope.$watch(attrs.cfRag, function(value) {
                    if (value) {
                        var labels = ['Exchanged','Unexchanged','Immature', 'Total'];
                        var opts = {rgaLength: 4, customColor: ['#66ce39','#e89640','#f23c25','#CACA42'] };

                        var data = [value.exchanged, value.unexchanged, value.immature, 0];

                        if (value.exchanged === 0 && value.unexchanged === 0 && value.immature === 0) {
                            data = [1, 1, 1, 0]; // fill in some dummy data to the graph is drawn initially
                        }

                        cf_rRags['cf-rag-1'] = new RagChart('cf-rag-1', data, labels, opts);
                        $(window).resize();
                    }

                });
            }
        };
    }])

    .directive('cfFunnel', [function() {
        "use strict";

        return {
            //Initialise gauges to default
            link: function(scope, element, attrs){

                scope.$watch(attrs.cfFunnel, function(value) {
                    if (value) {
                        var data = [];
                        var labels = [];

                        for(var i = 0; i<value.length; i++){
                            data.push(parseFloat(value[i].hashrate).toFixed(4));
                            labels.push(value[i].username);
                        }

                        var options = {barOpacity:true, layout:'left'};

                        cf_rFunnels[element.prop('id')] = new FunnelChart(element.prop('id'), data, labels, options);
                    }
                });

            }
        };
    }])

    .directive('cfSparkline', [function() {
        "use strict";

        return {
            //Initialise gauges to default
            link: function(scope, element, attrs){

                scope.$watch(attrs.cfSparkline, function(value) {
                    if (value && value.length > 0) {
                        /*
                         // Set custom options and merge with default
                         customSparkOptions = {};
                         customSparkOptions.minSpotColor = true;
                         var sparkOptions = cf_defaultSparkOpts;
                         var sparkOptions = $.extend({}, cf_defaultSparkOpts, customSparkOptions);
                         */

                        // No custom options
                        var options = cf_defaultSparkOpts;

                        var data = [];
                        for(var i = 0; i<value.length; i++){
                            data.push(parseFloat(value[i]));
                        }

                        createSparkline(element, data, options);
                    }
                });

            }
        };


    }])


.directive('cfArea', [function() {
        'use strict';

        return {
            restrict: 'E',

            // set up the isolate scope so that we don't clobber parent scope
            scope: {
                onClick:     '=',
                width:       '=',
                height:      '=',
                bind:        '=',
                label:       '@',
                field:       '@',
                duration:    '@',
                delay:       '@',
                plot:        '@',
                pointRadius: '@'
            },

            link: function(scope, element, attrs) {

                var margin = {top: 20, right: 80, bottom: 30, left: 50},
                    width = 960 - margin.left - margin.right,
                    height = 500 - margin.top - margin.bottom;

                var parseDate = d3.time.format("%Y%m%d").parse;

                var x = d3.time.scale()
                    .range([0, width]);

                var y = d3.scale.linear()
                    .range([height, 0]);

                var color = d3.scale.category10();

                var xAxis = d3.svg.axis()
                    .scale(x)
                    .orient("bottom");

                var yAxis = d3.svg.axis()
                    .scale(y)
                    .orient("left");

                var line = d3.svg.line()
                    .interpolate("basis")
                    .x(function(d) { return x(d.time); })
                    .y(function(d) { return y(d.temperature); });

                var data = [];

                var svg = d3.select(element[0]).append("svg")
                    .attr("width", width + margin.left + margin.right)
                    .attr("height", height + margin.top + margin.bottom)
                    .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

//                var data = [{"date": "20111001", "New York": "63.4", "San Francisco": "62.6", "Austin": "72.2"},
//                    {"date": "20111002", "New York":	"58.0", "San Francisco": "59.9", "Austin": "67.7"},
//                    {"date": "20111003", "New York":	"52.0", "San Francisco": "59.9", "Austin": "75.7"},
//                    {"date": "20111004", "New York":	"50.0", "San Francisco": "59.9", "Austin": "55.7"},
//                    {"date": "20111005", "New York":	"53.3", "San Francisco": "59.1", "Austin": "69.4"}];




                // main observer fn called when scope is updated. Data and scope vars are now bound
                scope.$watch('bind', function(bind) {

                    // pull info from scope
                    ///var duration = scope.duration || 0;
                    //var delay = scope.delay || 0;
                    //var dataPoints = scope.plot || 'true';
                    //var pointRadius = scope.pointRadius || 8;
                    //var field = scope.field || attrs.bind.split('.').pop().toLowerCase();

                    // just because scope is bound doesn't imply we have data.
                    if (bind) {

                        // pull the data array from the facet
                        data = bind || [];

                        color.domain(d3.keys(data[0]).filter(function(key) { return key !== "time"; }));

                        var cities = color.domain().map(function(name) {
                            return {
                                name: name,
                                values: data.map(function(d) {
                                    return {time: d.time, temperature: +d[name]};
                                })
                            };
                        });

                        x.domain(d3.extent(data, function(d) { return d.time; }));

                        y.domain([
                            d3.min(cities, function(c) { return d3.min(c.values, function(v) { return v.temperature; }); }),
                            d3.max(cities, function(c) { return d3.max(c.values, function(v) { return v.temperature; }); })
                        ]);

                        svg.append("g")
                            .attr("class", "x axis")
                            .attr("transform", "translate(0," + height + ")")
                            .call(xAxis);

                        svg.append("g")
                            .attr("class", "y axis")
                            .call(yAxis)
                            .append("text")
                            .attr("transform", "rotate(-90)")
                            .attr("y", 6)
                            .attr("dy", ".71em")
                            .style("text-anchor", "end")
                            .text("BTC");

                        var city = svg.selectAll(".city")
                            .data(cities)
                            .enter().append("g")
                            .attr("class", "city");

                        city.append("path")
                            .attr("class", "line")
                            .attr("d", function(d) { return line(d.values); })
                            .style("stroke", function(d) { return color(d.name); });

                        city.append("text")
                            .datum(function(d) { return {name: d.name, value: d.values[d.values.length - 1]}; })
                            .attr("transform", function(d) { return "translate(" + x(d.value.time) + "," + y(d.value.temperature) + ")"; })
                            .attr("x", 3)
                            .attr("dy", ".35em")
                            .text(function(d) { return d.name; });

//                        // use that data to build valid x,y ranges
//                        x.domain(d3.extent(data, function(d) { return d.time; }));
//                        y.domain([0, d3.max(data, function(d) { return d.count; })]);
//
//                        // create the transition
//                        var t = svg.transition().duration(duration);
//
//                        // feed the current data to our area/line generators
//                        t.select('.area').attr('d', area(data));
//                        t.select('.line').attr('d', line(data));

//                        // does the user want data points to be plotted
//                        if (dataPoints == 'true') {
//
//                            // create svg circle for each data point
//                            // using Math.random as (optional) key fn ensures old
//                            // data values are flushed and all new values inserted
//                            var points = svg.selectAll('circle')
//                                .data(data.filter(function(d) {
//                                return d.count;
//                            }), function(d) {
//                                    return Math.random();
//                                });
//
//                            // d3 enter fn binds each new value to a circle
//                            points.enter()
//                                .append('circle')
//                                .attr('class', 'area line points ' + klass)
//                                .attr('cursor', 'pointer')
//                                .attr("cx", line.x())
//                                .attr("cy", line.y())
//                                .style("opacity", 0)
//                                .transition()
//                                .duration(duration)
//                                .style("opacity", 1)
//                                .attr("cx", line.x())
//                                .attr("cy", line.y())
//                                .attr("r", pointRadius);
//
//                            // wire up any events (registers filter callback)
//                            points.on('mousedown', function(d) {
//                                scope.$apply(function() {
//                                    (scope.onClick || angular.noop)(field, d.time);
//                                });
//                            });
//
//                            // d3 exit/remove flushes old values (removes old circles)
//                            points.exit().remove();
//                        }
//
//                        // update our x,y axis based on new data values
//                        t.select('.x').call(xAxis);
//                        t.select('.y').call(yAxis);
                    }
                }, true);
            }
        };
    }]);
