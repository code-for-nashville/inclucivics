$(document).ready(function () {
    var app = {};

    $.getJSON("/api/departments", function (response) {
        var departments = $("#department")
          , $demographicSel = $("#demographics");

        var deps = response.departments;

        //Put all dept's at the top
        deps.sort(function(a,b){
            if (a === 'All Departments')
                return -1;
            if (b === 'All Departments')
                return 1;
            return a - b;
        });

        var depsPrepped = deps.map(function (dept) {
            return {
                text: dept,
                value: dept
            }
        });

        departments.selectize({
            options: depsPrepped,
        });

        $demographicSel.selectize();

        departments[0].selectize.on("change", function (item) {
            $demographicSel[0].selectize.addItem("ethnicity");
        });
    });

    // Highcharts options
    $(function () {

        // Load "About" page and line charts
        aboutPage();

        // Reload aboutPage by clicking home page link
        $('#demo-summary-link').click(function() {
            aboutPage();
        })

        // Setup handler to reload pie graphs when Departments or Demographics dropdown changes
        $('select#department, select#demographics').change(function () {
            //$('.select-option').remove();
            reloadCharts();
        });

        // Get shade of blue for Highcharts colors
        Highcharts.getOptions().plotOptions.pie.colors = (function () {
            var colors = [],
                base = Highcharts.getOptions().colors[0],
                i;

            for (i = 0; i < 10; i += 1) {
                colors.push(Highcharts.Color(base).brighten((i - 3) / 7).get());
            }
            return colors;
        }());
    });

    // Remove pie chart content and replace with a blurb about what
    // Metro and Code for Nashville are doing and our line graphs
    function aboutPage()
    {
        // did we already download that?
        if (app.graphs === void 0) {
            $.getJSON("static/js/graphs.json", function(graphs) {
                app.graphs = graphs;

                // mutate once to turn 0.75(...) to 75.(...)
                app.graphs.forEach(function (graph) {
                    graph.series.forEach(function (member) {
                        member.data.forEach(function (datum, _i, data) {
                            // mutate array members
                            data[_i] = (datum * 100);
                        });
                    });
                });

                // key iteration
                app.graphs.forEach(function (graph) {
                    drawLineGraph(graph.title, {series: graph.series}, graph.time, graph.title);
                });
            });

        } else {
            // key iteration
            $("#line-graphs").empty();

            app.graphs.forEach(function (graph) {
                drawLineGraph(graph.title, {series: graph.series}, graph.time, graph.title);
            });
        }

        // Clear graph content and about page if there
        //$('#metro-pie-charts').empty()
        //$('#census-pie-charts').empty()
    }

    function reloadCharts() {
        var department_name = $('select#department').val();
        var demographic_type = $('select#demographics').val();

        if (!(department_name && demographic_type))
            return // no op

        $metroPies = $("#metro-pie-charts");

        $metroPies.html('');
        $metroPies.html('<div class="loading">Loading...</div>');

        // Remove about message and line graphs when you reload charts
        $('#line-graphs').empty();

        var request_data = JSON.stringify({name: department_name, attribute: demographic_type});

        $.ajax({
            type: "POST",
            url: "/api/data",
            contentType: "application/json",
            data: request_data,
            success: function (data) {
                var charts = data.attribute;
                $("#metro-pies-link").trigger("click");

                $('#metro-pie-charts').html('').append(
                    "<h3 align='center'>Metro Demographics</h3>"
                );
                $('#census-pie-charts').html('').append(
                    "<h3 align='center'>Census Predicted</h3>"
                );

                $.each(charts, function (key, item) {
                    var sortOrder = ('White (Not of Hispanic Origin),Black,Hispanic,Unknown,'+
                                    'Asian or Pacific Islander,American Indian/Alaskan Native,'+
                                    'Hawaiian or Pacific Islander,Two or More Races,F,M').split(',');

                    var elementId = 'chart-' + key;
                    $('#metro-pie-charts').append(
                        '<div id="' + elementId + '" class="charts">CHART</div>'
                    );
                    item.data.sort(function (a,b) {
                        console.log( sortOrder.indexOf(a[0]) - sortOrder.indexOf(b[0]) );
                        return sortOrder.indexOf(a[0]) - sortOrder.indexOf(b[0]);
                    });
                    //Hacky way to maintain order of charts if the
                    //chart contains only male employees
                    if (item.data.length===1 && item.data[0][0]==='M'){
                        item.data.unshift(['F', 0]);
                    }

                    drawPieChart(elementId, item, item.income_level);

                    //Types of charts (ethnicity and gender) corresponds to
                    //the value of $('select#demographics')
                    var chartTypes = {
                        ethnicity : {
                            "White (Not of Hispanic Origin)": 0.571,
                            "Black": 0.281,
                            "Hispanic": 0.099,
                            "Unknown": 0.001,
                            "Asian or Pacific Islander": 0.032,
                            "American Indian/Alaskan Native": 0.005,
                            "Hawaiian or Pacific Islander": 0.01,
                            "Two or More Races": 0.0231
                        },
                        gender : {"M": 0.48, "F": 0.52}
                    };

                    var sum = item.data.reduce(function (a, b) { return a + b[1]; }, 0);

                    //Get names of ethnicities or genders in data
                    var names = item.data.map(function(el){return el[0];});
                    //Create a set of data for all ethnicities/genders
                    //based on the census distributions and the sum
                    //identical to the layout of the JSON's data
                    var comparisonData = [];
                    var demos = chartTypes[demographic_type];
                    for (var k in demos){
                        comparisonData.push([k, sum*demos[k]]);
                    }
                    //Creates the comparison chart that has the correct
                    //type and income level. Also the data gets sorted
                    //according to the order of the original data so
                    //the colors of ethnicities/genders align when they
                    //become a chart.
                    var comparisonChart = {
                        income_level :  item.income_level,
                        type : item.type,
                        data : comparisonData.sort( function (a,b){
                                a = names.indexOf(a[0]);
                                b = names.indexOf(b[0]);
                                a = a === -1 ? 1000 : a;
                                b = b === -1 ? 1000 : b;
                                return a - b;
                            })
                    };

                    var comparisonChartTitle = '';

                    var elementId2 = 'chart-2' + key;
                    $('#census-pie-charts').append('<div id="' + elementId2 + '" class="chart"></div>');
                    drawPieChart(elementId2, comparisonChart, comparisonChartTitle);
                });

            }
        });
        $(document).trigger("ChartView",[ department_name , demographic_type ]);
    };

    function drawPieChart(elementId, chartData, title) {
        $('#' + elementId).highcharts({
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: true
            },
            exporting: {
                enabled: false
            },
            title: {
                text: title
            },
            tooltip: {
                pointFormat: '{name}: <b>{point.percentage:.1f}%</b>'
            },
            legend: {
                enabled: true,
                labelFormat: '<b>{name}</b>: <b>{y:.1f}</b>   ({percentage:.1f}%)</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    dataLabels: {
                        enabled: false,
                        style: {
                            color: (Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black'
                        }
                    },
                    showInLegend: true
                }
            },
            series: [chartData]
        });
    }

    function drawLineGraph(elementId, chartData, axes, title) {

        var cssProps = {
            border: "1px solid black",
            marginTop: "2rem",
            marginBottom: "2rem",
            padding: "20px"
        }

        $table = $("<table />").addClass("graph-table table").appendTo("#line-graphs");
        $head = $("<thead />");
        $head.appendTo($table);
        $tRow = $("<tr />");
        $tRow.appendTo($head);

        $("<th />").text(title).appendTo($tRow);
        $("<td />").text("Percentage of employees by demographic").appendTo($tRow);
        $("<td />").text("Change").appendTo($tRow);

        chartData.series.forEach(function (member, _i) {
            var $row = $("<tr />")
            var $sparkContainer = $('<td />').attr('id', elementId + "-spark-" + _i).css({
            });

            $sparkContainer.highcharts("SparkLine", {
                series: [ member ],
                exporting: {
                    enabled: false
                },
                chart: {
                    style: {
                        marginTop: 5
                    }
                },
                tooltip: {
                    formatter: function () {
                        var name = axes[this.points[0].series._i];
                        var val = "" + this.y;
                        var _i = val.indexOf(".")

                        // do we have enough digits?
                        return val.slice(0 , _i + 4) + "% - " + name;
                    }
                }
            });

            var $bullet = $("<td />").attr("id", elementId + "-bullet-" + _i).css({
            });

            $bullet.highcharts("Chart", {
                //title: { text: member.name, style: { fontSize: "8px" }},
                title: null,
                credits: { enabled: false },
                exporting: { enabled: false },
                legend: { enabled: false },
                tooltip: {
                    formatter: function () {
                        var val = "" + this.y;
                        var _i = val.indexOf(".")

                        // do we have enough digits?
                        return val.slice(0 , _i + 4) + "%";
                    }
                },
                xAxis: {
                    tickLength: 0,
                    //categories: [member.name],
                    //align: "right",
                    labels: { enabled: false }
                },
                yAxis: {
                    endOnTick: true,
                    startOnTick: true,
                    min: 0,
                    max: 100,
                    minPadding: 0,
                    maxPadding: 0,
                    type: "linear",
                    tickInterval: 25,
                    breaks: [
                        {from: 0.001, to: 0.01 },
                        {}
                    ],
                    tickWidth: 0,
                    tickLength: 0,
                    tickHeight: 2,
                    title: {
                        text: null
                    },
                    labels: {
                        y: 12,
                        style: { fontSize: "10px" },
                        formatter: function () {
                            if (this.isLast) return this.value + "%"
                            else return this.value;
                        }
                    },
                    plotBands: [
                        {from: 0, to: 100, color: "rgba(200, 200, 200, 0.7)" },
                    ],
                },
                plotOptions: {
                    bar: {
                        //color: "black",
                        borderWidth: 0
                    }
                },
                chart: {
                    type: "bar",
                    //width: 600,
                    height: 50
                },
                series: [{
                    data: [member.data[member.data.length - 1]],
                    name: member.name
                }]
            });

            var $title = $("<td />").attr("id", elementId + "-title-" + _i).text(member.name);

            $title.appendTo($row);
            $bullet.appendTo($row);
            $sparkContainer.appendTo($row);
            $row.appendTo($table);
        });

        //$('<div>').attr('id', elementId).css(cssProps).highcharts({
            //chart: {
                //backgroundColor: null,
                //style: {
                    //color: '#FFFFFF'
                //}
            //},
            //title: {
                //text: title,
                //x: -20 //center
            //},
            //subtitle: {
                //text: 'Source: Nashville Metro',
                //x: -20,
                //color: '#FFFFFF'
            //},
            //// This needs to be refactored to read this from input ala chartData.xAxis
            //xAxis: {
                //categories: axes
            //},
            //yAxis: {
                //title: {
                    //text: 'Proportion of Total Metro Employees'
                //},
                //plotLines: [{
                    //value: 0,
                    //width: 1,
                    //color: '#000000'
                //}],
                //labels: {
                    //formatter: function () {
                        //return this.value + " %";
                    //}
                //},
                //min: 0,
                //max: 100
            //},
            //tooltip: {
                //formatter: function () {
                    //var val = "" + this.y;
                    //var _i = val.indexOf(".")

                    //// do we have enough digits?
                    //return val.slice(0 , _i + 4) + "%";
                //}
            //},
            //legend: {
                //layout: 'vertical',
                //align: 'right',
                //verticalAlign: 'middle',
                //borderWidth: 0
            //},
            //// Series is of form {name: "Line Name", data: ["positionally", "relevant", fields]}
            //series: chartData.series
        //}).appendTo('#line-graphs');
    }
});

