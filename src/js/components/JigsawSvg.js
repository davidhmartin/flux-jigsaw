/*** @jsx React.DOM */

var React = require('react');
var JigsawStore = require('../stores/JigsawStore');
var _ = require('underscore');
var svgGenerator = require('../svg/svgGenerator');

/**
 * Renders the puzzle as an svg element.
 */
var JigsawSvg = React.createClass({

  getInitialState: function() {
    return JigsawStore.getConfig();
  },

  componentDidMount: function() {
      JigsawStore.addChangeListener(this._onStoreChange);
  },

  componentWillUnmount: function() {
    JigsawStore.removeChangeListener(this._onStoreChange);
  },

  render: function() {
    var lineStyle = {
          fill: "none",
          stroke: "black",
          strokeWidth: "1px",
          strokeLinecap: "butt",
          strokeLinejoin: "miter"};
    var pixelWidth = this.state["pixelWidth"];
    var pixelHeight = this.state["pixelHeight"];

    // Note: We size the element slightly larger than the pixel
      // dimentions, and translate by 5 pixels, to work around a
      // rendering issue in firefox, where the left and upper edges
      // were cut off. 
    return (
      <div>
      <h1>SVG:</h1>
      <svg style={{width: pixelWidth + 10, height: pixelHeight + 10}} transform="translate(5, 5)" version={"1.1"} xmlns={"http://www.w3.org/2000/svg"}>
      <path
        d={svgGenerator(this.state).generateSvgPath()}
        style={lineStyle}>
      </path>
      </svg>
      </div>
        );
  },

  _onStoreChange: function() {
    this.setState(JigsawStore.getConfig());
  }
});


module.exports = JigsawSvg;
