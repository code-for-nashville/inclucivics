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

    var request_data = JSON.stringify({name: department_name, attribute: demographic_type});
    $.ajax({
        type: "POST",
        url: "/api/data",
        contentType: "application/json",
        data: request_data,
        success: function (data) {
            var charts = data.attribute;
            console.log(data.attribute);
            $('#charts-container').html('');
            $.each(charts, function (key) {
                var elementId = 'chart-' + key;
                $('#charts-container').append('<div id="' + elementId + '" class="chart">CHART</div>');
                drawPieChart(elementId, charts[key]);
            });
        }
    });
};

function drawPieChart(elementId, chartData) {
    console.log(chartData);
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
