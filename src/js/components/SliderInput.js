/*** @jsx React.DOM */

var React = require('react');
var JigsawStore = require('../stores/JigsawStore');
var ReactPropTypes = React.PropTypes;
var JigsawActions = require('../actions/JigsawActions');
var ReactSlider = require('react-slider');

function valueFromStore(attrName) {
  return JigsawStore.getConfig()[attrName];
}

var SliderInput = React.createClass({
  propTypes: {
    attrName: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired,
    minVal: React.PropTypes.number,
    maxVal: React.PropTypes.number,
    step: React.PropTypes.number,
    className: React.PropTypes.string,
    autoFocus: React.PropTypes.string
  },


  getInitialState: function() {
    var v = valueFromStore(this.props.attrName);
    return {
      value: v,
      oldValue: v
    };
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
        <div className="form-control">
        <ReactSlider
          withBars
          value={this.state.value}
          pearling={true}
          onChange={this._onSliderChange}
          onChanged={this._onSliderChange}
          onBlur={this._save}
          min={this.props.minVal}
          max={this.props.maxVal}
          step={this.props.step}/>
        </div>
      </div>
    );
  },

  _onStoreChange: function() {
    this.setState({
      oldValue: this.state.value,
      value: valueFromStore(this.props.attrName)
    });
  },

  _onSliderChange: function(event) {
    this.setState({
      oldValue: this.state.value,
      value: event
    }, this._save);
  },

  _save: function() {
    if (this.state.value != this.state.oldValue) {
      var newVal = this.state.value;
      if (this.props.minVal && newVal < this.props.minVal) {
        newVal = this.props.minVal;
      } else if (this.props.maxVal && newVal > this.props.maxVal) {
        newVal = this.props.maxVal;
      }
      JigsawActions.updateValue(this.props.attrName, newVal);
    }
  }


});


module.exports = SliderInput;


