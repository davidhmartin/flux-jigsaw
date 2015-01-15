/*** @jsx React.DOM */

var React = require('react');
var JigsawStore = require('../stores/JigsawStore');
var JigsawActions = require('../actions/JigsawActions');

var UndoButton = React.createClass({
  getInitialState: function() {
    return {canUndo: JigsawStore.canUndo()};
  },

  componentDidMount: function() {
    JigsawStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    JigsawStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var disabled = ! this.state.canUndo;
    return (
      <button className="btn btn-default" onClick={this._undo} disabled={disabled}>Undo</button>
    );
  },

  _onChange: function() {
    this.setState({canUndo: JigsawStore.canUndo()});
  },

  _undo: function() {
    JigsawActions.undo();
      return false;
  }

});

module.exports = UndoButton;
