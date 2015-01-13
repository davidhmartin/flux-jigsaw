/*** @jsx React.DOM */

var React = require('react');
var JigsawStore = require('../stores/JigsawStore');
var JigsawActions = require('../actions/JigsawActions');

/**
 * A button to update the random number generator seed.
 * @type {*|Function}
 */
var Randomizer = React.createClass({
  getInitialState: function() {
    return {seed: JigsawStore.getRandSeed()};
  },

  componentDidMount: function() {
    JigsawStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    JigsawStore.removeChangeListener(this._onChange);
  },

  render: function() {
    var disabled = ! this.state.canRedo;
    return (
      <div><button className="btn" onClick={this._randomize}>Randomize</button>
      </div>
    );
  },

  _randomize: function() {
    JigsawActions.randomize();
  },

  _onChange: function() {
    this.setState({seed: JigsawStore.getRandSeed()})
  }

});

module.exports = Randomizer;
