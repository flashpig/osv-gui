var OSv = OSv || {};

OSv.Boxes.ThreadsGraph = (function() {

  function ThreadsGraph() {
    OSv.Boxes.GraphBox.call(this, arguments);
    for (var i = 0; i < 256; i++) {
      this.colors[i] = helpers.randomColor();
    }
  }

  ThreadsGraph.prototype = Object.create(OSv.Boxes.GraphBox.prototype);

  ThreadsGraph.prototype.visibleThreads = []
  ThreadsGraph.prototype.threads = [];
  ThreadsGraph.prototype.colors = {};
  ThreadsGraph.prototype.title = "Threads";
  
  ThreadsGraph.prototype.extraSettings = function() {
    var self = this;
    return {
      axes: {
        xaxis: {
          tickOptions: {
            formatter: function (_, t) {
              // before any data comes to the graph jqplot tries rendering weird values.
              // this fixes the issue by returning an empty string in case a value below 1 shows up
              // on the x axis.
              if (t <= 1) return "";
              var now = Date.now();
              var secondsAgo = ((now - t) / 1000).toFixed(0);
              return "-" + secondsAgo + "s";
            }
          },
          label: "Time"
        }
      },
    series: this.threads.map(function (thread) {
        return {
          lineWidth: 1,
          markerOptions: {
            style: "circle"
          },
          color: self.colors[ thread.id ],
          label: thread.id + " - " + thread.name,
          size: 1
        }
      }),
    }
  };

  ThreadsGraph.prototype.normalizeData = function(data) {
    var self = this,
      plots;
    
    this.threads = $.map(data, function (thread) { 
      return thread; 
    }).filter(function (thread) {
      return self.visibleThreads.indexOf(thread.id) != -1;
    });
    
    plots = this.threads.map(function (thread) {
      return thread.plot.slice(-1 * OSv.Settings.Graph.MaxTicks);
    })

    if (plots.length === 0) {
      plots =[ [ null ] ]
    } 

    return plots;
  };

  ThreadsGraph.prototype.fetchData = function() {
    var self = this;
    return OSv.API.OS.threadsGraph().then(function(threadsData) {
      return self.normalizeData(threadsData);
    });
  };

  return ThreadsGraph;

}());