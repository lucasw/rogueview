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

var grid;
var SC = 16;

var map_wd = 50;
var map_ht = 30;

var px;
var py;

function goodCoords(x, y) {
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

function isInView(vx, vy, x, y) {

  var dx = x - vx;
  var dy = y - vy;
  var dist = Math.sqrt(dx * dx + dy * dy);
  if (dist > 18)
    return false;
  if (dist < 0.5)
    return true;

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
      
      if (!goodCoords(x,y)) return false;
     
      //console.log(x + " " + y + " " + grid[x][y]);
      if (grid[x][y] > 0.1) return false; 
      cy += slope;
    }

    return true;
  } else {
    var slope = dx / Math.abs(dy);
    for (cy = 0; cy < Math.abs(dy); cy++) {
      var off_y = cy;
      if (dy < 0) off_y = -cy;
      var x = parseInt( vx + Math.round(cx) );
      var y = parseInt( vy + off_y );
      
      if (!goodCoords(x,y)) return false;
     
      //console.log(dx + " " + dy + ", " + x + " " + y + " " + grid[x][y]);
      if (grid[x][y] > 0.1) return false; 
      cx += slope;
    }
    return true;
  }

  return false;
}

function init() {
  
  stage = new createjs.Stage("Rogueview");
  stage.scaleX = SC;
  stage.scaleY = SC;

  px = Math.floor(Math.random() * map_wd);
  py = Math.floor(Math.random() * map_ht);

  grid = new Array(map_wd);
  for (var i = 0; i < grid.length; i++) {
    grid[i] = new Array(map_ht);

    for (var j = 0; j < grid[i].length; j++) {
      
      var obstruction = 0;
      if (Math.random() < 0.03)  obstruction = 1.0;
      
      grid[i][j] = obstruction;
    }
  }

  for (var i = 0; i < grid.length; i++) {
    for (var j = 0; j < grid[i].length; j++) {
      var is_in_view = isInView(px, py, i, j);
      //console.log(i + " " + j + " : " + grid[i][j]); 
      var tile = new createjs.Shape();
      if (grid[i][j] <= 0.1) {
        if (is_in_view) 
          tile.graphics.beginFill("#aaaaaa");
        else 
          tile.graphics.beginFill("#777777");
      } else {
        if (is_in_view) 
          tile.graphics.beginFill("#886666");
        else 
          tile.graphics.beginFill("#654444");
      }
      tile.graphics.drawRect(0, 0, 1, 1);
      tile.x = i;
      tile.y = j;
      stage.addChild(tile);
    }
  }
  
  { // character
  var tile = new createjs.Shape();
  tile.graphics.beginFill("#11cc22");
  tile.graphics.drawRect(0, 0, 1, 1);
  tile.x = px;
  tile.y = py;
  stage.addChild(tile);
  }

  stage.update();
}

