$.getJSON("/api/departments", function (response) {
    var departments = $("#department");

    $.each(response.departments, function (val, text) {
        departments.append($("<option></option>").val(text).html(text));
    });

});


$(function () {

    $(document).ready(function () {

        $('#graph-container')
            .prepend("<p> " +
            "Thank you for visiting IncluCivics! This platform was born from the IncluCivics report that was produced by the Metro Human Relations Commission in January of 2015. The report analyzed the diversity and equity of Metro Nashville government in regards to its employees. Code for Nashville graciously created this site and maintains it free of charge."
            +
            "</p>"
            +
            "<p>"
            +
            "The platform exists for two reasons The first is to show the community the diversity and equity of Metro government and its departments in real time. The second is to track progress toward ensuring that Metro government is reflective of the community it serves. If you have questions about the report, please contact the Metro Human Relations Commission."
            +
            "</p>"
        );


        $('select#department, select#demographics').change(function () {

            reloadCharts();
        });

    });

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

function reloadCharts() {
    var department_name = $('select#department').val();
    var demographic_type = $('select#demographics').val();


    $('#charts-container').html('');
    $('#charts-container').html('<div class="loading">Loading...</div>');
    $('#graph-container').empty();


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

                var elementId = 'chart-' + key;
                $('#charts-container').append(
                    '<div id="' + elementId + '" class="chart">CHART</div>'
                );

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
                    gender : {
                        "M": 0.48,
                        "F": 0.52
                    }
                };

                var sum = item.data.reduce(function (prev, cur) {
                    return prev + cur.y;
                }, 0);
                

                //Get names of ethnicities or genders in data
                var names = item.data.map(function(el){return el.name;});
                //Create a set of data for all ethnicities/genders
                //based on the census distributions and the sum
                //identical to the layout of the JSON's data
                var comparisonData = $.map(chartTypes[demographic_type], function(val, key) {
                    return {
                        name: key,
                        visible: true,
                        y: sum*val
                    };
                });
                //Creates the comparison chart that has the correct
                //type and income level. Also the data gets sorted
                //according to the order of the original data so
                //the colors of ethnicities/genders align when they
                //become a chart.
                var comparisonChart = {
                    income_level :  item.income_level,
                    type : item.type,
                    data : comparisonData.sort( function (a,b){
                            a = names.indexOf(a.name);
                            b = names.indexOf(b.name);
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
