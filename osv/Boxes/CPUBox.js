var OSv = OSv || {};

OSv.Boxes.CPUBox = (function() {

  function CPUBox() {
    OSv.Boxes.GraphBox.call(this, arguments)
  }

  CPUBox.prototype = Object.create(OSv.Boxes.GraphBox.prototype);

  CPUBox.prototype.cpus = [];

  CPUBox.prototype.title = "CPU";
  
  CPUBox.prototype.extraSettings = function() {
    return {
      axes: {
        xaxis: {
          renderer: $.jqplot.DateAxisRenderer,
          tickOptions: {
            formatString: "%H:%M:%S"
          },
          label: "Time"
        }
      },
    series: [{
          lineWidth: 1,
          markerOptions: {
            style: "circle"
          },
          label: "CPU Usage %",
          size: 1
      }]
    }
  };

  CPUBox.prototype.fetchData = function() {
    var cpuData = OSv.API.OS.CPUAverage();
    var plots = cpuData.slice(-1 * OSv.Settings.Graph.MaxTicks )
    if (plots.length == 0) {
      plots = [ null ];
    } 
    return $.Deferred().resolve([ plots ]);
  };

  return CPUBox;

}());