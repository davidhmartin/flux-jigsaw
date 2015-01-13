/*** @jsx React.DOM */

var React = require('react');
var JigsawStore = require('../stores/JigsawStore');
var JigsawActions = require('../actions/JigsawActions');

function valueFromStore(attrName) {
  return JigsawStore.getConfig()[attrName];
}

var TextInput = React.createClass({
    propTypes: {
      attrName: React.PropTypes.string.isRequired,
      label: React.PropTypes.string.isRequired,
      className: React.PropTypes.string,
      placeholder: React.PropTypes.string,
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
          <label for={this.props.attrName}>{this.props.label}</label>
            <input
              className={this.props.className}
              placeholder={this.props.placeholder}
              onBlur={this._save}
              onChange={this._onChange}
              value={this.state.value}
              autoFocus={this.props.autoFocus || false}
            />
          </div>
        );
    },

  _onChange: function(event) {
    this.setState({
      oldValue: this.state.value,
      value: event.target.value
    });
  },


  _onStoreChange: function() {
    this.setState({
      oldValue: this.state.value,
      value: valueFromStore(this.props.attrName)
    });
  },

  _save: function() {
    if (this.state.value != this.state.oldValue) {
      JigsawActions.updateValue(this.props.attrName, this.state.value);
    }
  }


});


module.exports = TextInput;


