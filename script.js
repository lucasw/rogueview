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

function isInView(vx, vy, x, y) {

  if (
      (Math.abs(vx - x) < 10) &&
      (Math.abs(vy - y) < 10)
      )
    return true;

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
      if (Math.random() < 0.1)  obstruction = 1.0;
      
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
          tile.graphics.beginFill("#666666");
        else 
          tile.graphics.beginFill("#444444");
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

