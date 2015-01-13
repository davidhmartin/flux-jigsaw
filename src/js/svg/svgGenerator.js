var _ = require('underscore');
var seedrandom = require('seedrandom');

/**
 * An object that generates an svg path to draw the puzzle. It is initialized with the configuration values.
 * @param spec The configuration values
 */
var svgGenerator = function(spec) {
  var that = {};

  var random = seedrandom(spec.randSeed);
  var pixelWidth = parseInt(spec.pixelWidth);
  var pixelHeight = parseInt(spec.pixelHeight);
  var gridWidth = parseInt(spec.gridWidth);
  var gridHeight = parseInt(spec.gridHeight);
  var tabProbability = parseFloat(spec.tabProbability);
  var tabLenFactorMin = parseFloat(spec.tabLenFactorMin);
  var tabLenFactorMax = parseFloat(spec.tabLenFactorMax);
  var tabThicknessFactorMin = parseFloat(spec.tabThicknessFactorMin);
  var tabThicknessFactorMax = parseFloat(spec.tabThicknessFactorMax);
  var tabCurveFactorMin = parseFloat(spec.tabCurveFactorMin);
  var tabCurveFactorMax = parseFloat(spec.tabCurveFactorMax);
  var curveCtrlMin = parseFloat(spec.curveCtrlMin);
  var curveCtrlMax = parseFloat(spec.curveCtrlMax);

  var horizTemplates = {
    lineTemplate: _.template("M<%=x0%> <%=y0%> L<%=x1%> <%=y1%> "),
    curveTemplate: _.template("M<%=x0%> <%=y0%> Q<%=cx0%> <%=cy0%> <%=x1%> <%=y1%> "),
    bezierTemplate: _.template("M<%=x0%> <%=y0%> C<%=cx0%> <%=cy0%> <%=cx1%> <%=cy1%> <%=x1%> <%=y1%> ")
  };
  var vertTemplates = {
    lineTemplate: _.template("M<%=y0%> <%=x0%> L<%=y1%> <%=x1%> "),
    curveTemplate: _.template("M<%=y0%> <%=x0%> Q<%=cy0%> <%=cx0%> <%=y1%> <%=x1%> "),
    bezierTemplate: _.template("M<%=y0%> <%=x0%> C<%=cy0%> <%=cx0%> <%=cy1%> <%=cx1%> <%=y1%> <%=x1%> ")
  };

  var generateEdgeSegment = function(templates, edgeX, edgeY, lenX, lenY) {
    var x0 = edgeX * lenX;
    var y0 = edgeY * lenY;
    return templates.lineTemplate({x0: x0, y0: y0, x1: x0 + lenX, y1: y0});
  };

  var generateInnerSegment = function(templates, edgeX, edgeY, lenX, lenY) {
    if (random() <= tabProbability) {
      return generateTabbedSegment(templates, edgeX, edgeY, lenX, lenY);
    } else {
      return generateCurvedSegment(templates, edgeX, edgeY, lenX, lenY);
    }
  };

  /**
   * Generates a random number between the give min and max values
   * @param min
   * @param max
   * @returns {*}
   */
  var randomFromInterval = function(min, max) {
    return min + (max - min) * random();
  };

  var generateCurvedSegment = function(templates, edgeX, edgeY, lenX, lenY) {
    var x0 = edgeX * lenX;
    var y0 = edgeY * lenY;
    var direction = random() < 0.5 ? -1 : 1;

    var x1 = x0 + lenX;
    var cx0 = x0 + ((x1 - x0) / 2);
    var cy0 = Math.round(y0 + (direction * (lenY * randomFromInterval(curveCtrlMin, curveCtrlMax))));
    return templates.curveTemplate({x0: x0, y0: y0, cx0: cx0, cy0: cy0, x1: x1, y1: y0});
  };

  var generateTabbedSegment = function(templates, edgeX, edgeY, lenX, lenY) {
    var x0 = edgeX * lenX;
    var y0 = edgeY * lenY;
    var direction = random() < 0.5 ? -1 : 1;

    var x1 = x0 + lenX / 3;
    var cx0 = x0 + ((x1 - x0) / 2);
    var cy0 = Math.round(y0 + (direction * (lenY * randomFromInterval(curveCtrlMin, curveCtrlMax))));
    var result = templates.curveTemplate({x0: x0, y0: y0, cx0: cx0, cy0: cy0, x1: x1, y1: cy0});

    result += generatePuzzleTab(templates, cy0, x1, x1 + (lenX / 3), Math.round(lenY * randomFromInterval(tabLenFactorMin, tabLenFactorMax)), -direction);

    x0 = x1 + (lenX / 3);
    x1 = (edgeX + 1) * lenX;
    cx0 = x1 - ((x1 - x0) / 2);
    result += templates.curveTemplate({x0: x0, y0: cy0, cx0: cx0, cy0: cy0, x1: x1, y1: y0});

    return result;
  };

  var generateHalfTab = function(templates, x0, startY0, startY1, tabLen, xDirection, yDirection) {
    var median = (startY1 - startY0) / 2;

    if (yDirection === -1) {
      y0 = startY1;
    } else {
      y0 = startY0;
    }
    var cx0 = x0 + Math.round((xDirection * tabLen) * randomFromInterval(tabCurveFactorMin, tabCurveFactorMax));
    var cy0 = y0 + (yDirection * Math.round(tabLen * randomFromInterval(tabThicknessFactorMin, tabThicknessFactorMax)));
    var x1 = x0 + (xDirection * tabLen);
    var y1 = startY0 + median;
    var cx1 = x1;
    var cy1 = y0 - (yDirection * tabLen);
    return templates.bezierTemplate({y0: x0, x0: y0, cy0: cx0, cx0: cy0, cy1: cx1, cx1: cy1, y1: x1, x1: y1});
  }

  var generatePuzzleTab = function(templates, y0, x0, x1, tabLen, direction) {
    return generateHalfTab(templates,y0, x0, x1, tabLen, direction, 1) +
      generateHalfTab(templates, y0, x0, x1, tabLen, direction, -1);
  }

  /**
   * Generates the svg path string
   * @returns {string}
   */
  that.generateSvgPath = function() {
    var result = "";
    var lenX = pixelWidth / gridWidth;
    var lenY = pixelHeight / gridHeight;

    // We take the approach of iteratively appending each path segment to the string.
    // This is fairly simple, although it may not look the best if one animates the path rendering.
    // A future enhancement might be to order the path segments such that animation shows a smoother flow.

    // Note that with the rendering functions, we use the trick of swapping x and y parameters, to use the
    // same functions for vertical and horizontal edges.

    for (var gx = 0; gx <= gridWidth; ++gx) {
      for (var gy = 0; gy <= gridHeight; ++gy) {
        if (gy < gridHeight) {
          if (gx == 0 || gx == gridWidth) {
            result += generateEdgeSegment(vertTemplates, gy, gx, lenY, lenX);
          } else {
            result += generateInnerSegment(vertTemplates, gy, gx, lenY, lenX);
          }
        }
        if (gx < gridWidth) {
          if (gy == 0 || gy == gridHeight) {
            result += generateEdgeSegment(horizTemplates, gx, gy, lenX, lenY);
          } else {
            result += generateInnerSegment(horizTemplates, gx, gy, lenX, lenY);
          }
        }
      }
    }
    return result;
  };

  return that;

}

module.exports = svgGenerator;
