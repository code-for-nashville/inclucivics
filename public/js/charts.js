// XXX: Update based on departments from latest year
// "All Departments" is a special key added by the import_data script
// which contains demographic information aggregated for all departments
const departments = [
  'All Departments', 'Agricultural Extension', 'Arts Commission',
  'Assessor of Property', 'Beer Board', 'Circuit Court Clerk',
  'Circuit Court Satellite', 'Clerk and Master', 'Codes Administration',
  'Community Ed Commission', 'Convention Center Authority', 'County Clerk',
  'Criminal Court Clerk', 'Criminal Justice Planning Unit',
  'District Attorney', 'Election Commission', 'Emergency Communication Center',
  "Farmer's Market", 'Finance', 'Fire', 'General Services',
  'General Sessions Court', 'Health', 'Historical Commission',
  'Human Relations Commission', 'Human Resources',
  'Information Technology Service', 'Internal Audit',
  'Justice Integration Services', 'Juvenile Court', 'Juvenile Court Clerk',
  'Law', 'MTA', "Mayor's Office", 'Metro Action Commission',
  'Metropolitan Clerk', 'Metropolitan Council', 'Municipal Auditorium',
  'NCAC', 'Office of Emergency Mgmt', 'Parks', 'Planning Commission',
  'Police', 'Public Defender', 'Public Library', 'Public Works',
  'Register of Deeds', 'Sheriff', 'Social Services',
  'Soil and Water Conservation', 'Sports Authority', 'State Fair Board',
  'State Trial Courts', 'Trustee', 'Water Services'
]

// Ditto - each element of data is the sum for that year
const graphs = [
  {'series': [{'data': [0.1302365964836119,
     0.1455604075691412,
     0.13398838767306834],
    'name': 'American Indian/Alaskan Native'},
   {'data': [0.7271543303668331, 0.7725898555592879, 0.7815989280928985],
    'name': 'Asian or Pacific Islander'},
   {'data': [26.058172346429348, 26.41361549658493, 26.429209468512727],
    'name': 'Black'},
   {'data': [0.010853049706967658, 0.011196954428395476, 0.011165698972755694],
    'name': 'Hawaiian or Pacific Islander'},
   {'data': [1.812459301063599, 1.8922852983988356, 1.9205002233139794],
    'name': 'Hispanic'},
   {'data': [0.010853049706967658, 0.03359086328518643, 0.033497096918267084],
    'name': 'Two or More Races'},
   {'data': [0.5317994356414152, 0.5038629492777964, 0.49129075480125056],
    'name': 'Unknown'},
   {'data': [70.71847189060126, 70.22729817489642, 70.19874944171505],
    'name': 'White (Not of Hispanic Origin)'}],
  'time': ['2014 - December', '2015 - March', '2015 - April'],
  'title': 'Metro Overall'},
 {'series': [{'data': [0.04568296025582458,
     0.10989010989010989,
     0.10887316276537834],
    'date': ['2014 - August', '2015 - January', '2015 - April'],
    'name': 'American Indian/Alaskan Native'},
   {'data': [0.4111466423024212, 0.43956043956043955, 0.4899292324442025],
    'date': ['2014 - August', '2015 - January', '2015 - April'],
    'name': 'Asian or Pacific Islander'},
   {'data': [38.55641845591594, 41.64835164835165, 41.099618943930324],
    'date': ['2014 - August', '2015 - January', '2015 - April'],
    'name': 'Black'},
   {'data': [0.04568296025582458, 0.054945054945054944, 0.05443658138268917],
    'date': ['2014 - August', '2015 - January', '2015 - April'],
    'name': 'Hawaiian or Pacific Islander'},
   {'data': [2.5582457743261764, 2.8021978021978025, 2.939575394665215],
    'date': ['2014 - August', '2015 - January', '2015 - April'],
    'name': 'Hispanic'},
   {'data': [0.054945054945054944, 0.05443658138268917],
    'date': ['2015 - January', '2015 - April'],
    'name': 'Two or More Races'},
   {'data': [1.0507080858839652, 0.8791208791208791, 0.8165487207403375],
    'date': ['2014 - August', '2015 - January', '2015 - April'],
    'name': 'Unknown'},
   {'data': [57.33211512105984, 54.01098901098901, 54.43658138268916],
    'date': ['2014 - August', '2015 - January', '2015 - April'],
    'name': 'White (Not of Hispanic Origin)'}],
  'time': ['2014 - August', '2015 - January', '2015 - April'],
  'title': 'Lower Income Range (Less than $33,000)'},
 {'series': [{'data': [0.1841929002009377,
     0.1847187237615449,
     0.16758840288252053],
    'date': ['2014 - August', '2015 - January', '2015 - April'],
    'name': 'American Indian/Alaskan Native'},
   {'data': [0.8204956463496316, 0.8900083963056256, 0.8882185352773588],
    'date': ['2014 - August', '2015 - January', '2015 - April'],
    'name': 'Asian or Pacific Islander'},
   {'data': [23.593436034829203, 24.080604534005037, 24.233283056812468],
    'date': ['2014 - August', '2015 - January', '2015 - April'],
    'name': 'Black'},
   {'data': [0, 0, 0], 'name': 'Hawaiian or Pacific Islander'},
   {'data': [1.724715338245144, 1.8303946263643998, 1.8267135914194736],
    'date': ['2014 - August', '2015 - January', '2015 - April'],
    'name': 'Hispanic'},
   {'data': [0.016744809109176154, 0.033585222502099076, 0.03351768057650411],
    'date': ['2014 - August', '2015 - January', '2015 - April'],
    'name': 'Two or More Races'},
   {'data': [0.33489618218352313, 0.3694374475230898, 0.36869448634154517],
    'date': ['2014 - August', '2015 - January', '2015 - April'],
    'name': 'Unknown'},
   {'data': [73.32551908908238, 72.61125104953821, 72.48198424669013],
    'date': ['2014 - August', '2015 - January', '2015 - April'],
    'name': 'White (Not of Hispanic Origin)'}],
  'time': ['2014 - August', '2015 - January', '2015 - April'],
  'title': 'Middle Income Range ($33,000 and $66,000)'},
 {'series': [{'data': [0, 0, 0],
    'date': ['2014 - August', '2015 - January', '2015 - April'],
    'name': 'American Indian/Alaskan Native'},
   {'data': [0.8547008547008548, 0.6920415224913495, 0.6944444444444444],
    'date': ['2014 - August', '2015 - January', '2015 - April'],
    'name': 'Asian or Pacific Islander'},
   {'data': [14.055080721747387, 14.446366782006919, 14.409722222222221],
    'date': ['2014 - August', '2015 - January', '2015 - April'],
    'name': 'Black'},
   {'data': [0, 0, 0], 'name': 'Hawaiian or Pacific Islander'},
   {'data': [0.7597340930674265, 0.7785467128027681, 0.78125],
    'date': ['2014 - August', '2015 - January', '2015 - April'],
    'name': 'Hispanic'},
   {'data': [0, 0, 0],
    'date': ['2014 - August', '2015 - January', '2015 - April'],
    'name': 'Two or More Races'},
   {'data': [0.5698005698005698, 0.6055363321799307, 0.607638888888889],
    'date': ['2014 - August', '2015 - January', '2015 - April'],
    'name': 'Unknown'},
   {'data': [83.76068376068376, 83.47750865051903, 83.50694444444444],
    'date': ['2014 - August', '2015 - January', '2015 - April'],
    'name': 'White (Not of Hispanic Origin)'}],
  'time': ['2014 - August', '2015 - January', '2015 - April'],
  'title': 'Upper Income Range (Greater than $66,000)'}
]

$(document).ready(function () {
    const app = {};
    const $deps = $("#department")
      , $demographic = $("#demographics");

    const depsPrepped = departments.map(function (dep) {
        return {
            text: dep,
            value: dep
        }
    });

    $deps.selectize({
        options: depsPrepped,
    });

    $demographic.selectize();

    $deps[0].selectize.on("change", function (item) {
        $demographic[0].selectize.addItem("ethnicity");
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
        // key iteration
        $("#line-graphs").empty();

        graphs.forEach(function (graph) {
            drawLineGraph(graph.title, {series: graph.series}, graph.time, graph.title);
        });
    }

    let department_rollups;
    function reloadCharts() {
          var department_name = $('select#department').val();
          var demographic_type = $('select#demographics').val();

          if (!(department_name && demographic_type))
              return // no op

          $metroPies = $("#metro-pie-charts");

          $metroPies.html('');
          $metroPies.html('<div class="loading">Loading...</div>');

        if (department_rollups) {
          reloadChartsWithData(department_name, demographic_type)
        }
        else {
          $.getJSON('public/department_rollups.json', function(data) {
            department_rollups = data;
            reloadChartsWithData(department_name, demographic_type)
          })
        }
    };

    function reloadChartsWithData(department_name, demographic_type) {

      // Remove about message and line graphs when you reload charts
      $('#line-graphs').empty();

      const charts = department_rollups[department_name][demographic_type]

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
      $(document).trigger("ChartView",[ department_name , demographic_type ]);
    }

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
