$(function () {
  RenderGraph();
});

function RenderGraph();
  if (params['source'])
    var url = 'https://bm-lastheard.pi9noz.ampr.org/stats/?source=1&days=30&callback=?'
  else
    var url = 'https://bm-lastheard.pi9noz.ampr.org/stats/?days=30&callback=?'
     
  $.getJSON(url, function (jsondata) {
    data = [{type: 'area', name: 'Total'}];

    //Generate total
    qso = [];
    source = [];
    for (index in jsondata)
    {
      if (jsondata[index]['qso'])
      {
        qso.push([parseInt(index), jsondata[index]['qso']]);
      }
      if (jsondata[index][0]['source'])
      {
        for(tgindex in jsondata[index])
        {
          source[tgindex].push([parseInt(index), jsondata[index][tgindex]['qso']])
        }
      }
    }
    if (source.lengt > 0)
    {
      data = [];
      for(index in source)
      {
        data.push{name: 'TG '+index,data: source[index]};
      }
    } 
    else
      data[0]['data'] = qso;

    $('#container1').highcharts({
      chart: {
        zoomType: 'x'
      },
      title: {
        text: 'QSOs per Hour'
      },
      subtitle: {
        text: document.ontouchstart === undefined ?
          'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
        },
      xAxis: {
        type: 'datetime'
      },
      yAxis: {
        title: {
          text: 'QSOs'
        }
      },
      legend: {
        enabled: true 
      },
      plotOptions: {
        area: {
          fillColor: {
            linearGradient: {
              x1: 0,
              y1: 0,
              x2: 0,
              y2: 1
            },
            stops: [
              [0, Highcharts.getOptions().colors[0]],
              [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
            ]
          },
          marker: {
            radius: 2
          },
          lineWidth: 1,
          states: {
            hover: {
              lineWidth: 1
            }
          },
          threshold: null
        }
      },
      series: data
    });
  });
});
