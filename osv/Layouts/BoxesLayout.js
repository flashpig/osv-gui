var OSv = OSv || {};
OSv.Layouts = OSv.Layouts || {};

OSv.Layouts.BoxesLayout = (function() {

  function BoxesLayout(boxes) {
    this.boxes = boxes;
    this.layoutContainerID = "dashboard";
    this.mainContainer = $("#main");
    document.addEventListener("runRoute", this.clear.bind(this))
  }

  BoxesLayout.prototype.clear = function () {
    this.deleteLayoutContainer();
    this.boxes && this.boxes.map(function (box) { box.clear && box.clear(); })
  };

  BoxesLayout.prototype.layoutContainer = function() {
    return "<div id='"+this.layoutContainerID+"' class='row'>";
  };

  BoxesLayout.prototype.getLayoutContainer = function() {
    return $("#"+this.layoutContainerID);
  };

  BoxesLayout.prototype.allBoxesHtml = function (){
    return this.boxes.map(function(box) {
      return box.getHtml();
    });
  };

  BoxesLayout.prototype.deleteLayoutContainer = function() {
    this.getLayoutContainer().remove();
  };

  BoxesLayout.prototype.renderBoxHtml = function(html, id) {
    var uniuqeID = "Box" + id,
      $html = $(html).attr("id", uniuqeID);

    this.getLayoutContainer().append($html);
    if (this.boxes[id].postRender) {
      this.boxes[id].postRender(uniuqeID);
    }
  };


  BoxesLayout.prototype.render = function() {
    var self = this;

    this.deleteLayoutContainer();
    this.mainContainer.append(this.layoutContainer());

    return helpers.whenAll( this.allBoxesHtml() ).then(function(boxesHtml) {
      boxesHtml.forEach(self.renderBoxHtml.bind(self));
    });
  };

  return BoxesLayout;

}());