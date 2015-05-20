$.getJSON("/api/departments", function (response) {
    var departments = $("#department");
    var deps = response.departments;
    //Put all dept's at the top
    deps.sort(function(a,b){
        if (a === 'All Departments')
            return -1;
        if (b === 'All Departments')
            return 1;
        return a - b;
    });


    $.each(deps, function (val, text) {
        departments.append($("<option></option>").val(text).html(text));
    });
    $('<option>').addClass('select-option')
    .val('')
    .html('--Select a department--')
    .prependTo(departments);
});

// Highcharts options 
$(function () {
    //var overall_time = {
    //        series: [{'color': '#EF5325',
    //          'data': [0.7071847189060126, 0.7022729817489642, 0.7019874944171505],
    //          'name': 'White (Not of Hispanic Origin)'},
    //         {'color': '#AB509E',
    //          'data': [0.2605817234642935, 0.2641361549658493, 0.26429209468512727],
    //          'name': 'Black'},
    //         {'color': '#ACAE4E',
    //          'data': [0.01812459301063599, 0.018922852983988356, 0.019205002233139794],
    //          'name': 'Hispanic'},
    //         {'color': '#ACAE4E',
    //          'data': [0.005317994356414152, 0.0050386294927779645, 0.004912907548012505],
    //          'name': 'Unknown'},
    //         {'color': '#ACAE4E',
    //          'data': [0.007271543303668331, 0.007725898555592879, 0.007815989280928986],
    //          'name': 'Asian or Pacific Islander'},
    //         {'color': '#ACAE4E',
    //          'data': [0.001302365964836119, 0.001455604075691412, 0.0013398838767306833],
    //          'name': 'American Indian/Alaskan Native'},
    //         {'color': '#ACAE4E',
    //          'data': [0.00010853049706967658,
    //           0.00011196954428395476,
    //           0.00011165698972755694],
    //          'name': 'Hawaiian or Pacific Islander'},
    //         {'color': '#ACAE4E',
    //          'data': [0.00010853049706967658,
    //           0.0003359086328518643,
    //           0.00033497096918267083],
    //          'name': 'Two or More Races'}],
    //        time: ["2014 - December", "2015 - March", "2015 - April"]
    //    };


    // $.ajax({
    //        type: "GET",
    //        url: "/api/temporal",
    //        contentType: "application/json",
    //        data: {},
    //        success: function (data) {
    //            drawLineGraph('graph-container', {series: data.temporal.series}, data.temporal.axis);
    //            console.log({series: data.temporal.series});
    //        }
    //    }
    //)

    //drawLineGraph('graph-container', {series: overall_time.series}, overall_time.time);
    //drawLineGraph('graph-container1', {series: overall_time.series}, overall_time.time);
    //drawLineGraph('graph-container2', {series: overall_time.series}, overall_time.time);
    //drawLineGraph('graph-container3', {series: overall_time.series}, overall_time.time);

    // Load "About" page and line charts
    aboutPage();

    // Reload aboutPage by clicking home page link
    $('#home-link').click(function() {
        aboutPage();
    })

    // Setup handler to reload pie graphs when Departments or Demographics dropdown changes
    $('select#department, select#demographics').change(function () {
        $('.select-option').remove();
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
    $.getJSON("static/js/graphs.json", function(graphs) {
        $.each(graphs, function(graph) {
            var ent = graphs[graph]
            drawLineGraph(ent.title, {series: ent.series}, ent.time, ent.title);
            console.log(ent)
        })
    });

    // Clear graph content and about page if there
    $('#charts-container').empty()
    $('#charts-container2').empty()

    $('#graph').empty();
    $('#about-message-container').empty();

    $('#about-message-container')
        .prepend(
            "<p>" +
            "In January 2015, the Metro Human Relations Commission (MHRC) released the IncluCivics Report, " +
            "analyzing the demographic makeup of 50 Metro Nashville departments. The data in the original " +
            "report was provided by Metro Human Resources (Metro HR) in August 2014. Since then, Metro HR has " +
            " provided more recent data (captured April 1, 2015) and has announced that updated data will be " +
            "released quarterly. The original IncluCivics Report, and a recent and more robust Data Update are " +
            "at <a href='https://www.nashville.gov/Human-Relations-Commission/IncluCivics.aspx'>https://www.nashville.gov/Human-Relations-Commission/IncluCivics.aspx</a>." +
            "</p>" +
            "<p>" +
            "This platform, graciously created and maintained free of charge by Code for Nashville, exists for " +
            "two reasons. First, it is imperative to establish a baseline from which to assess our collective " +
            "efforts at attaining a more diverse workforce in the future. Second, to further encourage " +
            "transparency and public education, this platform will capture the demographic data provided " +
            "quarterly by Metro HR, render it in user-friendly charts and graphs, and will track changes " +
            "in the data over time. The raw data used on this platform is available to the public and can be " +
            "found at <a href='https://data.nashville.gov/Metro-Government/General-Government-Employees-Demographics/4ibi-mxs4'>https://data.nashville.gov/Metro-Government/General-Government-Employees-Demographics/4ibi-mxs4</a>" +
            "</p>");
}

function reloadCharts() {
    var department_name = $('select#department').val();
    var demographic_type = $('select#demographics').val();


    $('#charts-container').html('');
    $('#charts-container').html('<div class="loading">Loading...</div>');
    $('#graph').empty();

    // Remove about message when you reload charts
    $('#about-message-container').empty();

    var request_data = JSON.stringify({name: department_name, attribute: demographic_type});
    $.ajax({
        type: "POST",
        url: "/api/data",
        contentType: "application/json",
        data: request_data,
        success: function (data) {
            var charts = data.attribute;

            $('#charts-container').html('').append(
                "<h3 align='center'>Actual Demographics</h3>"
            );
            $('#charts-container2').html('').append(
                "<h3 align='center'>Census Predicted</h3>"
            );

            $.each(charts, function (key, item) {
                var sortOrder = ('White (Not of Hispanic Origin),Black,Hispanic,Unknown,'+
                                'Asian or Pacific Islander,American Indian/Alaskan Native,'+
                                'Hawaiian or Pacific Islander,Two or More Races,F,M').split(',');

                var elementId = 'chart-' + key;
                $('#charts-container').append(
                    '<div id="' + elementId + '" class="chart">CHART</div>'
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

                drawPieChart(elementId, item);

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

                var elementId2 = 'chart-2' + key;
                $('#charts-container2').append('<div id="' + elementId2 + '" class="chart"></div>');
                drawPieChart(elementId2, comparisonChart);
            });

        }
    });
};

function drawPieChart(elementId, chartData) {
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
            text: chartData.income_level
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

function drawLineGraph(elementId, chartData, axes, title)
{

     $('<div>').attr('id', elementId).highcharts({
        chart: {
            backgroundColor: null,
            style: {
                color: '#FFFFFF'
            }
        },
        title: {
            text: title,
            x: -20 //center
        },
        subtitle: {
            text: 'Source: Nashville Metro',
            x: -20,
            color: '#FFFFFF'
        },
        // This needs to be refactored to read this from input ala chartData.xAxis
        xAxis: {
            categories: axes
        },
        yAxis: {
            title: {
                text: 'Proportion of Total Metro Employees'
            },
            plotLines: [{
                value: 0,
                width: 1,
                color: '#000000'
            }],
            min: 0,
            max: 1
        },
        tooltip: {
            valueSuffix: '%'
        },
        legend: {
            layout: 'vertical',
            align: 'right',
            verticalAlign: 'middle',
            borderWidth: 0
        },
        // Series is of form {name: "Line Name", data: ["positionally", "relevant", fields]}
        series: chartData.series
    }).appendTo('#graph');
}
