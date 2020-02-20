let draw = false;

init();

/**
 * FUNCTIONS
 */

function init() {
  // initialize DataTables
  const table = $("#myTable").DataTable(
    {
      "language": {
      "url": "https://cdn.datatables.net/plug-ins/1.10.19/i18n/German.json"
      },
      keepConditions: true,
      "pageLength": 50,
       orderCellsTop: true,
      dom:"'<'row'<'col-sm-4'f><'col-sm-4'i><'col-sm-4 exportbuttons'Br>>'"+
          "'<'row'<'col-sm-12't>>'"+
          "'<'row'<'col-sm-6 offset-sm-6'p>>'"
      ,
       buttons: [
          {
              extend:'colvis',
              className: 'btn-outline-green',
              init: function(api, node, config) {
                  $(node).removeClass('btn-secondary')
              }
          },
          {
              extend:    'copyHtml5',
              text:      '<i class="far fa-copy"/>',
              titleAttr: 'Copy',
              className: 'btn-link',
              init: function(api, node, config) {
                  $(node).removeClass('btn-secondary')
              }
          },
          {
              extend:    'excelHtml5',
              text:      '<i class="far fa-file-excel"/>',
              titleAttr: 'Excel',
              className: 'btn-link',
              init: function(api, node, config) {
                  $(node).removeClass('btn-secondary')
              }
          },
          {
              extend:    'pdfHtml5',
              text:      '<i class="far fa-file-pdf"/>',
              titleAttr: 'PDF',
              className: 'btn-link',
              init: function(api, node, config) {
                  $(node).removeClass('btn-secondary')
              }
          }
      ],
      responsive: true,
    }

  );
  $("#loader").hide();
  $("#myTable").show();
  $('#myTable thead #filterrow th').each( function (colIndex) {
  var title = $(this).text();
  $(this).html( '<input type="text"/>' );
   $( 'input', this ).on( 'keyup change', function () {
      if ( table.column(colIndex).search() !== this.value ) {
          table
              .column(colIndex)
              .search( this.value )
              .draw();
      }
  } );
  });
  // get table data
  const tableData = getTableData(table);
  // create Highcharts
  createHighcharts(tableData);
  // table events
  setTableEvents(table);
}

function getTableData(table) {
  const dataArray = [],
    countryArray = [],
    populationArray = [],
    densityArray = [];

  // loop table rows
  table.rows({ search: "applied" }).every(function() {
    const data = this.data();
    countryArray.push(data[0]);
    populationArray.push(parseInt(data[1].replace(/\,/g, "")));
  });

  // store all data in dataArray
  dataArray.push(countryArray, populationArray);

  return dataArray;
}

function createHighcharts(data) {
  Highcharts.setOptions({
    lang: {
      thousandsSep: ","
    }
  });

  Highcharts.chart("chart", {
    chart: {
      zoomType: 'x'
    },
    title: {
      text: "DataTables to Highcharts"
    },
    subtitle: {
      text: "Data from worldometers.info"
    },
    xAxis: [
      {
        categories: data[0],
        labels: {
          rotation: -45
        }
      }
    ],
    yAxis: [
      {
        // first yaxis
        title: {
          text: "Population (2017)"
        }
      }
    ],
    series: [
      {
        name: "Population (2017)",
        color: "#0071A7",
        type: "column",
        data: data[1],
        tooltip: {
          valueSuffix: " M"
        }
      }
    ],
    tooltip: {
      shared: true
    },
    legend: {
      backgroundColor: "#ececec",
      shadow: true
    },
    credits: {
      enabled: true
    },
    noData: {
      style: {
        fontSize: "16px"
      }
    }
  });
}

function setTableEvents(table) {
  // listen for page clicks
  table.on("page", () => {
    draw = true;
  });

  // listen for updates and adjust the chart accordingly
  table.on("draw", () => {
    if (draw) {
      draw = false;
    } else {
      const tableData = getTableData(table);
      createHighcharts(tableData);
    }
  });
}
