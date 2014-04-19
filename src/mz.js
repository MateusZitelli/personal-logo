var MZ = (function(){
  //Private vars
  var module = {};

  var attrs = {
    border:{
      fill: "none",
      stroke: "#000",
      strokeWidth: 1,
      "fill-opacity": 1.0
    },
    invisible:{
      strokeWidth: 1,
      fill: "none",
      stroke: "#000", 
      "stroke-opacity": 0.0
    }
  };

  var matrixes ={
    M: new Snap.Matrix(),
    Z: new Snap.Matrix()
  }; 

  var snap;
  var stepDuration;
  var coords = {};
  var paths = {};

  // Private funtions
  var setCoords = function(){
    coords = {
      triangle: [
        new Coord(1, 0),
        new Coord(module.size.x, 0),
        new Coord(module.size.x / 2.0, module.size.y / 2.0)
      ],
      mirroredTriangle: [
        new Coord(1, module.size.y),
        new Coord(module.size.x, module.size.y),
        new Coord(module.size.x / 2.0, module.size.y / 2.0)
      ],
      externBox: [
        new Coord(1, 0),
        new Coord(module.size.x, 0),
        new Coord(module.size.x, module.size.y),
        new Coord(1, module.size.y)
      ],
      M: [
        new Coord(1, module.size.y),
        new Coord(1, 0),
        new Coord(module.size.x / 2.0, module.size.y / 2.0),
        new Coord(module.size.x, 0),
        new Coord(module.size.x, module.size.y)
      ],
      Z: [
        new Coord(1, 0),
        new Coord(module.size.x, 0),
        new Coord(1, module.size.y),
        new Coord(module.size.x, module.size.y)
      ]
    };
  };

  var setPaths = function(){
    if(coords === undefined){
      throw "Object coordinates undefined.";
    }

    paths = {
      triangle: new Path(coords.triangle, true),
      mirroredTriangle: new Path(coords.mirroredTriangle, true),
      externBox: new Path(coords.externBox, true),
      M: new Path(coords.M, false),
      Z: new Path(coords.Z, false),
    };

    paths.triangleCopy = paths.triangle.copy();
  };

  var applyInitialStateInSnap = function(){
    paths.triangle.apply(snap).attr(attrs.border);
    paths.triangleCopy.apply(snap).attr(attrs.border);
    paths.externBox.apply(snap).attr(attrs.invisible);
    paths.M.apply(snap).attr(attrs.invisible);
    paths.Z.apply(snap).attr(attrs.invisible);
  };

  var createMZ = function(){
    paths.MBox = new Path(coords.externBox, true);

    paths.MBox.apply(snap).attr(attrs.border);
    paths.mirroredTriangle.apply(snap).attr(attrs.border);

    var MGroup = snap.group(paths.triangle.path.clone(),
                              paths.mirroredTriangle.path, paths.MBox.path);
    var ZGroup = MGroup.clone();

    var showMZ = function(){
      paths.M.path.animate({'stroke-opacity': 1, strokeWidth: 5}, stepDuration,
                            mina.easeinout);
      paths.Z.path.animate({'stroke-opacity': 1, strokeWidth: 5}, stepDuration,
                            mina.easeinout);
      MGroup.animate({'stroke-opacity': 0}, stepDuration, mina.easeinout);
      ZGroup.animate({'stroke-opacity': 0}, stepDuration, mina.easeinout);
    };

    var moveGroupsToFinalDestinationAndShowMZ = function(){
      paths.M.path.animate({transform: matrixes.M}, stepDuration,
                            mina.easeinout);
      paths.Z.path.animate({transform: matrixes.Z}, stepDuration,
                            mina.easeinout);
      MGroup.animate({transform: matrixes.M}, stepDuration, mina.easeinout);
      ZGroup.animate({transform: matrixes.Z}, stepDuration, mina.easeinout);
      setTimeout(showMZ , stepDuration);
    };

    setTimeout(moveGroupsToFinalDestinationAndShowMZ, stepDuration);
  };

  //Public methods
  module.startAnimation = function(){
    if(this.size === undefined){
      throw "The MZ was not initialized.";
    }
    paths.triangleCopy.animateCoords(coords.mirroredTriangle, stepDuration);
    paths.externBox.path.animate({'stroke-opacity':1, }, stepDuration,
                                  mina.easeinout);
    applyInitialStateInSnap();
    setTimeout(createMZ, stepDuration);
  };

  module.init = function(div, width, height, duration){
    snap = Snap(div);
    stepDuration = duration;

    this.size = new Coord();
    this.size.x = width;
    this.size.y = height;

    matrixes.M.scale(0.2, 0.2, module.size.x / 2.0, module.size.y);
    matrixes.M.translate(0, -module.size.y * 3.5);

    matrixes.Z.scale(0.2, 0.2, module.size.x / 2.0, module.size.y);
    matrixes.Z.translate(0, -module.size.y * 0.5);

    setCoords();
    setPaths();
    applyInitialStateInSnap();
  };

  return module;
}());