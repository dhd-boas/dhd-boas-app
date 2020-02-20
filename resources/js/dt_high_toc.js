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
    itemArray = [],
    countArrayOne = [],
    countArrayTwo = [];

  // loop table rows
  table.rows({ search: "applied" }).every(function() {
    const data = this.data();
    itemArray.push(data[0]);
    countArrayOne.push(parseInt(data[3].replace(/\,/g, "")));
    countArrayTwo.push(parseInt(data[5].replace(/\,/g, "")));
  });

  // store all data in dataArray
  dataArray.push(itemArray, countArrayOne, countArrayTwo);

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
      text: "Konferenzbeiträge nach Person"
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
          text: "Anzahl Autor*innen"
        }
      },
      {
        // secondary yaxis
        title: {
          text: "Anzahl Organisationen"
        },
        min: 0,
        opposite: true
      }
    ],
    series: [
      {
        name: "Anzahl Autor*innen",
        color: "#0071A7",
        type: "column",
        data: data[1],
      },
      {
        name: "Anzahl Organisationen",
        color: "#FF404E",
        type: "spline",
        data: data[2],
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
