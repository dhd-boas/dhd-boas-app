$.getJSON('../data/cache/doc-topic-matrix.json', function(data) {
  console.log('data', data);

  function getPointCategoryName(point, dimension) {
    var series = point.series,
      isY = dimension === 'y',
      axis = series[isY ? 'yAxis' : 'xAxis'];
    return axis.categories[point[isY ? 'y' : 'x']];
  }

  Highcharts.chart('hc-container', {

    chart: {
      type: 'heatmap',
      marginTop: 40,
      marginBottom: 80,
      plotBorderWidth: 0.1
    },


    title: {
      text: 'Document Topic Matrix'
    },

    xAxis: {
      categories: data["topics"]
    },

    yAxis: {
      categories: data["docs"],
    },

    accessibility: {
      point: {
        descriptionFormatter: function(point) {
          var ix = point.index + 1,
            xName = getPointCategoryName(point, 'x'),
            yName = getPointCategoryName(point, 'y'),
            val = point.value;
          return ix + '. ' + xName + ' sales ' + yName + ', ' + val + '.';
        }
      }
    },

    colorAxis: {
      min: 0,
      minColor: '#FFFFFF',
      maxColor: Highcharts.getOptions().colors[0]
    },

    legend: {
      align: 'right',
      layout: 'vertical',
      margin: 0,
      verticalAlign: 'top',
      y: 25,
      symbolHeight: 280
    },

    tooltip: {
      formatter: function() {
        return '';
      }
    },

    series: [{
            turboThreshold: 0,
            borderWidth: 1,
            data: data["items"],
            dataLabels: {
                enabled: true,
                color: 'black',
                style: {
                    textShadow: 'none',
                    HcTextStroke: null
                }
            }
        }],

    responsive: {
      rules: [{
        condition: {
          maxWidth: 500
        },
        chartOptions: {
          yAxis: {
            labels: {
              formatter: function() {
                return this.value.charAt(0);
              }
            }
          }
        }
      }]
    }

  });
})
