/*** @jsx React.DOM */

var React = require('react');
var JigsawStore = require('../stores/JigsawStore');
var JigsawActions = require('../actions/JigsawActions');

var RedoButton = React.createClass({
  getInitialState: function() {
    return {canRedo: JigsawStore.canRedo()};
  },

  componentDidMount: function() {
    JigsawStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    JigsawStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var disabled = ! this.state.canRedo;
    return (<span>
      <button className="btn" onClick={this._redo} disabled={disabled}>Redo</button></span>
    );
  },

  _onChange: function() {
    this.setState({canRedo: JigsawStore.canRedo()});
  },

  _redo: function() {
    JigsawActions.redo();
  }

});

module.exports = RedoButton;
