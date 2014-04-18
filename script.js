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
var SC = 8;

function init() {
  
  stage = new createjs.Stage("Rogueview");
  stage.scaleX = SC;
  stage.scaleY = SC;
  grid = new Array(50);
  for (var i = 0; i < grid.length; i++) {
    grid[i] = new Array(30);
    for (var j = 0; j < grid.length; j++) {
      var tile = new createjs.Shape();
      if (Math.random() > 0.8) {
        tile.graphics.beginFill("#aaaaaa");
      } else {
        tile.graphics.beginFill("#666666");
      }
      tile.graphics.drawRect(0, 0, SC, SC);
      tile.x = i;
      tile.y = j;
      grid[i][j] = tile;
      stage.addChild(tile);
    }
  }
  stage.update();
}

