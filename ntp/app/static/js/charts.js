$.getJSON("/api/departments", function (response) {
    var departments = $("#department");

    $.each(response.departments, function (val, text) {
        departments.append($("<option></option>").val(text).html(text));
    });

});


$(function () {

    $(document).ready(function () {

        $('#charts-container')
            .append("<p> " +
            "The Nashville Transparency Project in partnership with the Human Relation's Commission is proud to present" +
            " IncluCivics, a simple data visualization tool for tracking the Nashville Metro employee demographics. " +
            " Simply choose a department and demographic to get started. " +
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
    $('#charts-container2').html('');


    var request_data = JSON.stringify({name: department_name, attribute: demographic_type});
    $.ajax({
        type: "POST",
        url: "/api/data",
        contentType: "application/json",
        data: request_data,
        success: function (data) {
            var charts = data.attribute;
            $('#charts-container').html('');
            $.each(charts, function (key) {
                var elementId = 'chart-' + key;
                $('#charts-container').append('<div id="' + elementId + '" class="chart">CHART</div>');
                drawPieChart(elementId, charts[key]);
            });

            var census = {
                "White (Not of Hispanic Origin)": 0.571,
                "Black": 0.281,
                "Hispanic": 0.099,
                "Unknown": 0.1,
                "Asian or Pacific Islander": 0.032,
                "American Indian/Alaskan Native": 0.005,
                "Hawaiian or Pacific Islander": 0.01,
                "Two or More Races": 0.0231
            };

            //var ideal = charts[0].data.map(function(elem) {
            //    elem.y = census[elem.name] * sum
            //    return elem
            //});

            $.each(charts, function (key) {
                var sum = charts[key].data.reduce(function(prev, cur) {return prev + cur.y}, 0);
                charts[key].data.map(function(elem) {
                    elem["y"] = Math.round(census[elem.name] * sum) / 10
                    return elem
                })
                console.log(charts[key].data)
                var elementId = 'chart-' + key + '2';
                $('#charts-container2').append('<div id="' + elementId + '" class="chart"></div>');
                drawPieChart(elementId, charts[key]);
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
            labelFormat: '<b>{name}</b>: Number of Employees: <b>{y}</b>   ({percentage:.1f}%)</b>'
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
