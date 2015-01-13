/*** @jsx React.DOM */

var React = require('react');
var JigsawStore = require('../stores/JigsawStore');
var ReactPropTypes = React.PropTypes;
var JigsawActions = require('../actions/JigsawActions');
var ReactSlider = require('react-slider');

function valueFromStore(attrName) {
  return JigsawStore.getConfig()[attrName];
}

/**
 * Controls a range, defined by a min and max attribute, via a dual-tabbed slider.
 */
var SliderRangeInput = React.createClass({
  propTypes: {
    minAttrName: React.PropTypes.string.isRequired,
    maxAttrName: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    minVal: React.PropTypes.number,
    maxVal: React.PropTypes.number,
    step: React.PropTypes.number,
    className: React.PropTypes.string,
    autoFocus: React.PropTypes.string
  },


  getInitialState: function() {
    var ret = {};
    ret[this.props.minAttrName] = valueFromStore(this.props.minAttrName);
    ret[this.props.maxAttrName] = valueFromStore(this.props.maxAttrName);
    return ret;
  },

  componentDidMount: function() {
    JigsawStore.addChangeListener(this._onStoreChange);
  },

  componentWillUnmount: function() {
    JigsawStore.removeChangeListener(this._onStoreChange);
  },

  render: function() {
    return (
      <div>
        <label>{this.props.label}</label>
        <ReactSlider
          withBars
          value={[this.state[this.props.minAttrName], this.state[this.props.maxAttrName]]}
          pearling={true}
          onChange={this._onSliderChange}
          onChanged={this._onSliderChange}
          onBlur={this._save}
          min={this.props.minVal}
          max={this.props.maxVal}
          step={this.props.step}/>
      </div>
    );
  },

  _onStoreChange: function() {
    this.setState(this.getInitialState());
  },

  _onSliderChange: function(event, b, c, d) {
    var s = {};
    s[this.props.minAttrName] = event[0];
    s[this.props.maxAttrName] = event[1];
    this.setState(s, this._save);
  },

  _save: function() {
    JigsawActions.updateValues(this.state);
  }
});

module.exports = SliderRangeInput;


