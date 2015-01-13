/*** @jsx React.DOM */

var React = require('react');
var JigsawConfig = require('./components/JigsawConfig');
var JigsawSvg = require('./components/JigsawSvg');
var ReactSlider = React.createFactory(require('react-slider'));
React.renderComponent(
    <JigsawConfig />,
    document.getElementById('jigsawconfig')
);

React.renderComponent(
  <JigsawSvg />,
  document.getElementById('jigsawimage')
);
