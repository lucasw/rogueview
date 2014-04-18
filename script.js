/*
 Copyright Lucas Walter April 2014
 
 This file is part of Rogueview.

 Rogueview is free software: you can redistribute it and/or modify
 it under the terms of the GNU General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 Rogueview is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU General Public License for more details.

 You should have received a copy of the GNU General Public License
 along with Rogueview.  If not, see <http://www.gnu.org/licenses/>.
 
 */

var map;
var SC = 16;

var map_wd = 50;
var map_ht = 30;

var px;
var py;


var KEYCODE_UP = 38;
var KEYCODE_DOWN = 40;
var KEYCODE_LEFT = 37;
var KEYCODE_RIGHT = 39;


var key_left = false;
var key_right = false;
var key_up = false;
var key_down = false;

document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;

function handleKeyDown(e) {
  if (!e) { var e = window.event; }
  handleKey(e, true);
}
function handleKeyUp(e) {
  if (!e) { var e = window.event; }
  handleKey(e, false);
}

function handleKey(e, val) {
  var do_update = true;

  var key = e.keyCode; //String.fromCharCode( e.keyCode ).charCodeAt(0);
  if (key == ' '.charCodeAt(0)) {
    cat.action(val);
  }
  if (key == 'A'.charCodeAt(0))  key_left = val;
  if (key == 'D'.charCodeAt(0))  key_right = val;
  if (key == 'W'.charCodeAt(0))  key_up = val;
  if (key == 'S'.charCodeAt(0))  key_down = val;
  //console.log(key + " " + e.keyCode + " " + 'A'.charCodeAt(0));

  switch (e.keyCode) {
    case KEYCODE_LEFT:
      key_left = val;
      break;
    case KEYCODE_RIGHT:
      key_right = val;
      break;
    case KEYCODE_UP:
      key_up = val;
      break;
    case KEYCODE_DOWN:
      key_down = val;
      break;
    default:
      do_update = false;
      //return true;
      break;
  }

  if (do_update)
    update();
  return false;
}

function Map() {
  
  var grid;

  grid = new Array(map_wd);
  for (var i = 0; i < grid.length; i++) {
    grid[i] = new Array(map_ht);

    for (var j = 0; j < grid[i].length; j++) {
      
      var obstruction = 0;
      if (Math.random() < 0.03) 
        obstruction = 1.0;
      
      grid[i][j] = new Tile(i, j, obstruction);
      stage.addChild(grid[i][j].tile);
    }
  }

  this.update = function(px, py) {
    for (var i = 0; i < grid.length; i++) {
      for (var j = 0; j < grid[i].length; j++) {
        //console.log(i + " " + j + " : " + grid[i][j]); 
        grid[i][j].update(px, py);     
      }
    }
  }

  this.goodCoords = function(x, y) {
    if (
          (x >= grid.length) ||
          (x < 0)
          ) {
        console.log("bad x " + x + ", len " + grid.length);
        return false;
      } 
      
      if (
          (y >= grid[x].length) ||
          (y < 0) 
         ) {
        console.log("bad y " + x + " " + y + ", len " + grid[x].length);
        return false;
      }
    return true;
  }

  this.getObstruction = function(x, y) {
    if (!this.goodCoords(x, y)) return 1.0;
    return grid[x][y].obstruction;
  }
}

function update() {
  var dx = 0;
  var dy = 0;

  var dval = 1;
  if (key_left) dx -= dval;
  if (key_right) dx += dval;
  if (key_up) dy -= dval;
  if (key_down) dy += dval;

  var test_x = px + dx;
  var test_y = py + dy;
  if (map.goodCoords(test_x, test_y)) {
    px += dx;
    py += dy;
    //console.log("move " + px + " " + py + ", " + dx + " " + dy);
  } else {
    console.log("bad move " + test_x + " " + test_y);
  }

  if ((dx !== 0) || (dy !== 0))
  updateView();

  return false;
}

// can vx, vy be seen from x,y
function isInView(vx, vy, x, y) {
  
  var max_dist = 18;
  var dx = x - vx;
  var dy = y - vy;

  if (Math.abs(dx) > max_dist) return false;
  if (Math.abs(dy) > max_dist) return false;

  var dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > max_dist)
    return false;
  if (dist < 0.5)
    return true;

  //return false;

  var cx = 0;
  var cy = 0;
  if //((dx > 0) && 
      ((Math.abs(dx) >= Math.abs(dy)) 
      ) {
    
    var slope = dy / Math.abs(dx);
    for (cx = 0; cx < Math.abs(dx); cx++) {
      var off_x = cx;
      if (dx < 0) off_x = -cx;
      var x = parseInt( vx + off_x );
      var y = parseInt( vy + Math.round(cy) );
      
      var obs = map.getObstruction(x,y);
      //console.log(x + " " + y + " " + obs); 
      if (obs > 0.1) return false; 
      cy += slope;
    }
    //console.log(cx + " " + cy);

    return true;
  } else {
    var slope = dx / Math.abs(dy);
    for (cy = 0; cy < Math.abs(dy); cy++) {
      var off_y = cy;
      if (dy < 0) off_y = -cy;
      var x = parseInt( vx + Math.round(cx) );
      var y = parseInt( vy + off_y );
      
      if (map.getObstruction(x,y) > 0.1) return false; 
      cx += slope;
    }
    return true;
  }

  return false;
}

function Tile(x, y, obstruction) {
  
  var x = x;
  var y = y;
  this.obstruction = obstruction;
  
  this.tile = new createjs.Shape();
  this.tile.graphics.beginFill("#0f00ff");
  this.tile.graphics.drawRect(0, 0, 1, 1);
  this.tile.x = x;
  this.tile.y = y;

  this.is_in_view = false;

  this.update = function(vx, vy) {

    this.is_in_view = isInView(vx, vy, x, y);
    //this.tile.graphics.clear();   
    if (this.obstruction <= 0.1) {
        if (this.is_in_view) 
          this.tile.graphics.beginFill("#aaaaaa");
        else 
          this.tile.graphics.beginFill("#777777");
    } else {
        if (this.is_in_view) 
          this.tile.graphics.beginFill("#886666");
        else 
          this.tile.graphics.beginFill("#654444");
    }
    this.tile.graphics.drawRect(0, 0, 1, 1);
    this.tile.x = x;
    this.tile.y = y;
  }
  return this;
}

function init() {
  
  stage = new createjs.Stage("Rogueview");
  stage.scaleX = SC;
  stage.scaleY = SC;

  px = Math.floor(Math.random() * map_wd);
  py = Math.floor(Math.random() * map_ht);

  map = new Map();

  updateView();
  //createjs.Ticker.on("tick", update);
  //createjs.Ticker.setFPS(10);
}

function updateView() {
  //console.log("update view " + px + " " + py);
  map.update(px, py);

  stage.update();
}

