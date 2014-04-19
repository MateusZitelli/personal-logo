/*
 * Define um elemento de coordenada bidimensional.
 * @param {int} x Abscissas
 * @param {int} y Ordenadas
 */
var Coord = function(x, y){
  this.x = x;
  this.y = y;
};

/* 
 * Gera um elemento path a partir das coordenadas passadas 
 * @param {list of Coord} coords Lista de coordenadas dos pontos
 */
var Path = function(coords, closed){
  if(coords === null){
    return;
  }
  this.coords = coords;
  this.closed = closed;
  this.svgPathString = this.strigifyCoords(coords);
};

/*
 * Gera uma string coma descrição de um path no formado definido
 * pela especificações do svg
 * @param {list of Coord} coords Lista de coordenadas
 */
Path.prototype.strigifyCoords = function(coords){
  var svgPathString = 'M';
  var finalPathChar = this.closed ? 'z': '';
  for(var index in coords){ 
    svgPathString += coords[index].x + ',' + coords[index].y;
    //If is the last line make a close path
    svgPathString += index == coords.length - 1 ? finalPathChar : 'L';
  }
  return svgPathString;
};

/*
 * Aplica o path à um elemento Snap
 * @param {Snap element} snap Elemento Snap no qual o path será aplicado
 */
Path.prototype.apply = function(snap){
  this.path = snap.path(this.svgPathString);
  return this.path;
};

/*
 * Cria uma cópia do path
 * @return {Path element} Copy of
 */
Path.prototype.copy = function(){
  var copy = new Path();
  copy.svgPathString = this.svgPathString;
  copy.coords = this.coords;
  copy.closed = this.closed;
  return copy;
};

/*
 * Anima o path para as novas coordenadas passadas
 * @param {list of Coords} coords Lista com as novas coordenadas
 * @param {float} time Duração da animação em microssegundos
 */
Path.prototype.animateCoords = function(coords, time){
  var newPathString = this.strigifyCoords(coords);
  this.path.animate({path:newPathString}, time, mina.easeinout);
};